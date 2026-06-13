import fs from 'node:fs';
import zlib from 'node:zlib';

const NOTE_BY_INDEX = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const TYPE_BY_ID = {
  0: 'major',
  1: 'major6',
  2: 'major7',
  6: 'minor',
  8: 'minor7',
  10: 'minor7Flat5',
  14: 'dominant7',
};

const TYPE_IDS = Object.keys(TYPE_BY_ID).map(Number);
const GRID_LEFT = 43;
const FRET_GAP = 22;
const STRING_YS = [30, 45, 60, 75, 91, 105];
const OPEN_MARKER_X = 27;
const TONE_INTERVALS = {
  major: [0, 4, 7],
  major6: [0, 4, 7, 9],
  major7: [0, 4, 7, 11],
  minor: [0, 3, 7],
  minor7: [0, 3, 7, 10],
  minor7Flat5: [0, 3, 6, 10],
  dominant7: [0, 4, 7, 10],
};
const STANDARD_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];

function readChunks(buffer) {
  const chunks = [];
  let offset = 8;
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    chunks.push({ type, data: buffer.subarray(offset + 8, offset + 8 + length) });
    offset += length + 12;
  }
  return chunks;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

function decodePng(buffer) {
  const chunks = readChunks(buffer);
  const ihdr = chunks.find((chunk) => chunk.type === 'IHDR')?.data;
  if (!ihdr) throw new Error('Missing IHDR');
  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const bitDepth = ihdr[8];
  const colorType = ihdr[9];
  if (bitDepth !== 8 || ![2, 6].includes(colorType)) throw new Error(`Unsupported PNG ${bitDepth}/${colorType}`);

  const raw = zlib.inflateSync(Buffer.concat(chunks.filter((chunk) => chunk.type === 'IDAT').map((chunk) => chunk.data)));
  const sourceBytesPerPixel = colorType === 6 ? 4 : 3;
  const sourceStride = width * sourceBytesPerPixel;
  const outputBytesPerPixel = 4;
  const pixels = Buffer.alloc(height * width * outputBytesPerPixel);
  const sourceRows = Buffer.alloc(height * sourceStride);
  let offset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = raw[offset];
    offset += 1;
    for (let x = 0; x < sourceStride; x += 1) {
      const left = x >= sourceBytesPerPixel ? sourceRows[y * sourceStride + x - sourceBytesPerPixel] : 0;
      const up = y > 0 ? sourceRows[(y - 1) * sourceStride + x] : 0;
      const upLeft = x >= sourceBytesPerPixel && y > 0 ? sourceRows[(y - 1) * sourceStride + x - sourceBytesPerPixel] : 0;
      let value = raw[offset];
      offset += 1;
      if (filter === 1) value = (value + left) & 255;
      else if (filter === 2) value = (value + up) & 255;
      else if (filter === 3) value = (value + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) value = (value + paeth(left, up, upLeft)) & 255;
      sourceRows[y * sourceStride + x] = value;
    }

    for (let x = 0; x < width; x += 1) {
      const sourceOffset = y * sourceStride + x * sourceBytesPerPixel;
      const outputOffset = (y * width + x) * outputBytesPerPixel;
      pixels[outputOffset] = sourceRows[sourceOffset];
      pixels[outputOffset + 1] = sourceRows[sourceOffset + 1];
      pixels[outputOffset + 2] = sourceRows[sourceOffset + 2];
      pixels[outputOffset + 3] = colorType === 6 ? sourceRows[sourceOffset + 3] : 255;
    }
  }

  return { width, height, pixels };
}

function pixel(image, x, y) {
  const offset = (y * image.width + x) * 4;
  return [
    image.pixels[offset],
    image.pixels[offset + 1],
    image.pixels[offset + 2],
    image.pixels[offset + 3],
  ];
}

function isRed(image, x, y) {
  const [r, g, b, a] = pixel(image, x, y);
  return a > 140 && r > 170 && g < 110 && b < 110;
}

function isDark(image, x, y) {
  const [r, g, b, a] = pixel(image, x, y);
  return a > 140 && r < 90 && g < 90 && b < 90;
}

function findComponents(image, predicate) {
  const visited = new Set();
  const components = [];
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const key = y * image.width + x;
      if (visited.has(key) || !predicate(image, x, y)) continue;
      const queue = [[x, y]];
      const xs = [];
      const ys = [];
      visited.add(key);
      while (queue.length > 0) {
        const [cx, cy] = queue.pop();
        xs.push(cx);
        ys.push(cy);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = cx + dx;
          const ny = cy + dy;
          const nextKey = ny * image.width + nx;
          if (
            nx >= 0 &&
            ny >= 0 &&
            nx < image.width &&
            ny < image.height &&
            !visited.has(nextKey) &&
            predicate(image, nx, ny)
          ) {
            visited.add(nextKey);
            queue.push([nx, ny]);
          }
        }
      }
      if (xs.length > 3) {
        components.push({
          size: xs.length,
          minX: Math.min(...xs),
          maxX: Math.max(...xs),
          minY: Math.min(...ys),
          maxY: Math.max(...ys),
          cx: xs.reduce((sum, value) => sum + value, 0) / xs.length,
          cy: ys.reduce((sum, value) => sum + value, 0) / ys.length,
        });
      }
    }
  }
  return components;
}

function readDigit(image, x0, y0, width, height) {
  const darkCount = new Map();
  for (let y = y0; y < y0 + height; y += 1) {
    for (let x = x0; x < x0 + width; x += 1) {
      if (isDark(image, x, y)) {
        const bucket = Math.round((x - x0) / 3);
        darkCount.set(bucket, (darkCount.get(bucket) ?? 0) + 1);
      }
    }
  }
  const total = [...darkCount.values()].reduce((sum, value) => sum + value, 0);
  if (total < 4) return undefined;
  const left = [...darkCount.entries()].filter(([bucket]) => bucket <= 1).reduce((sum, [, value]) => sum + value, 0);
  const mid = [...darkCount.entries()].filter(([bucket]) => bucket >= 2 && bucket <= 3).reduce((sum, [, value]) => sum + value, 0);
  const right = [...darkCount.entries()].filter(([bucket]) => bucket >= 4).reduce((sum, [, value]) => sum + value, 0);
  if (left > 8 && right > 8 && mid > 4) return 8;
  if (left < 4 && right > 8) return 1;
  if (left > 5 && right > 5 && mid < 5) return 0;
  return undefined;
}

function inferBaseFret(image) {
  const y = 120;
  const firstDigit = readDigit(image, 60, y - 8, 10, 16);
  if (firstDigit === 1) {
    const secondDigit = readDigit(image, 69, y - 8, 10, 16);
    if (secondDigit === 0) return 10;
    if (secondDigit === 1) return 11;
    if (secondDigit === 2) return 12;
    return 1;
  }
  return firstDigit ?? 1;
}

function nearestStringIndex(y) {
  let best = 0;
  let bestDistance = Infinity;
  for (const [index, stringY] of STRING_YS.entries()) {
    const distance = Math.abs(y - stringY);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  }
  return best;
}

function extractRawPattern(image) {
  const rawHighToLow = Array(6).fill(undefined);
  const redComponents = findComponents(image, isRed)
    .filter((component) => component.size >= 12)
    .filter((component) => component.cx < 160 && component.cy > 20 && component.cy < 112);

  for (const component of redComponents) {
    if (component.cx < GRID_LEFT) {
      const stringIndex = nearestStringIndex(component.cy);
      if (component.cy > 98) rawHighToLow[stringIndex] = 'x';
      else rawHighToLow[stringIndex] = 0;
      continue;
    }
    const fretOffset = Math.max(0, Math.min(3, Math.round((component.cx - (GRID_LEFT + FRET_GAP / 2)) / FRET_GAP)));
    if (component.maxY - component.minY > 18) {
      for (const [stringIndex, y] of STRING_YS.entries()) {
        if (y >= component.minY - 3 && y <= component.maxY + 3) rawHighToLow[stringIndex] = { fretOffset };
      }
    } else {
      rawHighToLow[nearestStringIndex(component.cy)] = { fretOffset };
    }
  }

  for (let index = 0; index < rawHighToLow.length; index += 1) {
    if (rawHighToLow[index] === undefined) rawHighToLow[index] = 'x';
  }

  return rawHighToLow;
}

function materializePattern(rawHighToLow, baseFret) {
  return [...rawHighToLow]
    .reverse()
    .map((value) => {
      if (value === 'x' || value === 0) return value;
      return baseFret + value.fretOffset;
    });
}

function transpose(note, semitones) {
  return NOTE_BY_INDEX[(NOTE_BY_INDEX.indexOf(note) + semitones + 120) % 12];
}

function noteAtFret(openNote, fret) {
  return transpose(openNote, fret);
}

function tonesFor(note, quality) {
  return TONE_INTERVALS[quality].map((interval) => transpose(note, interval));
}

function validPattern(pattern, note, quality) {
  const tones = tonesFor(note, quality);
  const playedNotes = pattern
    .map((value, stringIndex) => (value === 'x' ? undefined : noteAtFret(STANDARD_TUNING[stringIndex], value)))
    .filter(Boolean);
  return playedNotes.length > 0 && playedNotes.every((playedNote) => tones.includes(playedNote)) && tones.every((tone) => playedNotes.includes(tone));
}

function extractPattern(image, note, quality) {
  const rawHighToLow = extractRawPattern(image);
  if (!note || !quality) return materializePattern(rawHighToLow, inferBaseFret(image));

  const valid = [];
  for (let baseFret = 1; baseFret <= 12; baseFret += 1) {
    const pattern = materializePattern(rawHighToLow, baseFret);
    if (validPattern(pattern, note, quality)) valid.push(pattern);
  }
  return valid[0] ?? materializePattern(rawHighToLow, inferBaseFret(image));
}

if (process.argv[2] === '--debug-image') {
  const image = decodePng(fs.readFileSync(process.argv[3]));
  console.log({
    baseFret: inferBaseFret(image),
    components: findComponents(image, isRed)
      .filter((component) => component.size >= 12)
      .filter((component) => component.cx < 160 && component.cy > 10 && component.cy < 122),
    darkBottom: findComponents(image, isDark)
      .filter((component) => component.size >= 4)
      .filter((component) => component.cy > 108 && component.cy < 132),
    raw: extractRawPattern(image),
    pattern: extractPattern(image, process.argv[4], process.argv[5]),
  });
  process.exit(0);
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function fetchBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function listCandidateIds(baseId) {
  const html = await fetchText(`https://www.aki-f.com/chordbook/item.php?id=${baseId}`);
  return [...new Set([...html.matchAll(new RegExp(`chord_img/${baseId}_(\\d+)\\.png`, 'g'))].map((match) => `${baseId}_${match[1]}`))];
}

function toTsValue(value) {
  if (value === 'x') return "'x'";
  return String(value);
}

async function main() {
  const lines = [];
  let totalCandidates = 0;
  for (let rootIndex = 0; rootIndex < NOTE_BY_INDEX.length; rootIndex += 1) {
    for (const typeId of TYPE_IDS) {
      const baseId = `${rootIndex}_${typeId}`;
      const note = NOTE_BY_INDEX[rootIndex];
      const quality = TYPE_BY_ID[typeId];
      const candidateIds = await listCandidateIds(baseId);
      if (candidateIds.length === 0) continue;
      totalCandidates += candidateIds.length;
      lines.push(`  '${note}:${quality}': [`);
      for (const candidateId of candidateIds) {
        const image = decodePng(await fetchBuffer(`https://www.aki-f.com/chordbook/img/chord_img/${candidateId}.png`));
        const pattern = extractPattern(image, note, quality);
        lines.push(`    { sourceId: '${candidateId}', pattern: [${pattern.map(toTsValue).join(', ')}] },`);
      }
      lines.push('  ],');
    }
  }

  const output = `import { DiatonicChord } from './chords';
import { ChordQuality, NoteName } from './notes';
import { generateVoicings, selectRepresentativeVoicingsByPosition, voicingFromPattern, VoicingCandidate } from './voicings';

type ReferencePattern = {
  sourceId: string;
  pattern: Array<'x' | number>;
};

const REFERENCE_PATTERNS: Partial<Record<\`\${NoteName}:\${ChordQuality}\`, ReferencePattern[]>> = {
${lines.join('\n')}
};

export function getReferenceVoicings(chord: DiatonicChord): VoicingCandidate[] {
  const key = \`\${chord.root}:\${chord.quality}\` as const;
  const patterns = REFERENCE_PATTERNS[key] ?? [];
  return patterns
    .map((item) => voicingFromPattern(item.pattern, chord.tones, item.sourceId))
    .filter((candidate): candidate is VoicingCandidate => Boolean(candidate));
}

export function getPreferredVoicings(chord: DiatonicChord): VoicingCandidate[] {
  const referenceVoicings = getReferenceVoicings(chord);
  if (referenceVoicings.length > 0) return referenceVoicings;
  return selectRepresentativeVoicingsByPosition(generateVoicings(chord.tones, { limit: 500 }));
}
`;

  fs.writeFileSync('src/domain/referenceVoicings.ts', output);
  console.log(`wrote ${totalCandidates} candidates`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
