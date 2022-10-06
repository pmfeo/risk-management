export default function roundNumber(num: number): number {
  const m = Number((Math.abs(num) * 100).toPrecision(15));
  const rounded = (Math.round(m) / 100) * Math.sign(num);
  const fixed = rounded.toFixed(2)
  return parseFloat(fixed)
}
