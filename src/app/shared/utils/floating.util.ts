export interface FloatingPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  above: boolean;
}

export function floatingPosition(
  anchor: DOMRect,
  viewportWidth: number,
  viewportHeight: number,
  preferredWidth: number,
  preferredMaxHeight: number,
  estimatedHeight: number,
  gap = 4,
  margin = 8,
): FloatingPosition {
  const width = Math.max(120, Math.min(preferredWidth, viewportWidth - margin * 2));
  const left = Math.max(margin, Math.min(anchor.left, viewportWidth - width - margin));
  const belowTop = anchor.bottom + gap;
  const aboveTop = anchor.top - gap;
  const contentHeight = Math.min(estimatedHeight, preferredMaxHeight);
  const fitsBelow = belowTop + contentHeight <= viewportHeight - margin;
  const fitsAbove = aboveTop - contentHeight >= margin;

  if (fitsBelow) {
    return {
      top: belowTop,
      left,
      width,
      maxHeight: Math.max(120, Math.min(preferredMaxHeight, viewportHeight - belowTop - margin)),
      above: false,
    };
  }

  if (fitsAbove) {
    return {
      top: aboveTop,
      left,
      width,
      maxHeight: Math.max(120, Math.min(preferredMaxHeight, aboveTop - margin)),
      above: true,
    };
  }

  return {
    top: margin,
    left,
    width,
    maxHeight: Math.max(120, viewportHeight - margin * 2),
    above: false,
  };
}