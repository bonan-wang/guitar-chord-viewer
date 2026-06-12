import { NoteName, transpose } from './notes';

const MAJOR_SCALE_STEPS = [0, 2, 4, 5, 7, 9, 11];

export function getMajorScale(root: NoteName): NoteName[] {
  return MAJOR_SCALE_STEPS.map((step) => transpose(root, step));
}
