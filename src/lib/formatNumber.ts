export function formatLargeNumber(value: number): string {
  const trillion = 1e12;
  const billion = 1e9;
  const million = 1e6;
  const thousand = 1e3;

  if (value >= trillion) {
    return `$${(value / trillion).toFixed(2)}T`;
  } else if (value >= billion) {
    return `$${(value / billion).toFixed(2)}B`;
  } else if (value >= million) {
    return `$${(value / million).toFixed(2)}M`;
  } else if (value >= thousand) {
    return `$${(value / thousand).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}