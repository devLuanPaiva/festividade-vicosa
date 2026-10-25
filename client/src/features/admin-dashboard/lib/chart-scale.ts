const TARGET_TICKS = 4;
const NICE_STEPS = [1, 2, 5, 10];
const MIN_STEP = 1;

export interface ChartScale {
  max: number;
  ticks: number[];
}

function niceStep(rawStep: number): number {
  if (rawStep <= 0) {
    return 1;
  }
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const fraction = rawStep / magnitude;
  const niceFraction = NICE_STEPS.find((step) => fraction <= step) ?? 10;
  return niceFraction * magnitude;
}

export function niceScale(maxValue: number): ChartScale {
  const step = Math.max(MIN_STEP, niceStep(maxValue / TARGET_TICKS));
  const max = Math.max(Math.ceil(maxValue / step) * step, step);
  const ticks = Array.from({ length: max / step + 1 }, (_, index) => index * step);
  return { max, ticks };
}
