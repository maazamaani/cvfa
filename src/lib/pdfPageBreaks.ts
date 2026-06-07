export const PRINT_AVOID_BREAK_CLASS = "print-avoid-break";

export type PageSegment = { startMm: number; endMm: number };

type AvoidRange = { startMm: number; endMm: number };

export type AvoidRangePx = { startPx: number; endPx: number };

function getElementBounds(
  element: HTMLElement,
  root: HTMLElement,
): { topPx: number; heightPx: number; bottomPx: number } {
  const rootRect = root.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const topPx = elementRect.top - rootRect.top;

  return {
    topPx,
    heightPx: elementRect.height,
    bottomPx: topPx + elementRect.height,
  };
}

/** Export height follows main content, not a stretched sidebar column. */
export function getExportContentHeightPx(root: HTMLElement): number {
  const main = root.querySelector("main");
  if (!(main instanceof HTMLElement)) {
    return root.scrollHeight;
  }

  const { bottomPx } = getElementBounds(main, root);
  return Math.max(1, Math.ceil(bottomPx));
}

function getLeafAvoidElements(root: HTMLElement): HTMLElement[] {
  const elements = Array.from(
    root.querySelectorAll<HTMLElement>(`.${PRINT_AVOID_BREAK_CLASS}`),
  );

  return elements.filter(
    (element) => !element.querySelector(`.${PRINT_AVOID_BREAK_CLASS}`),
  );
}

export function getAvoidBreakRangesPx(root: HTMLElement): AvoidRangePx[] {
  return getLeafAvoidElements(root)
    .map((element) => {
      const { topPx, heightPx } = getElementBounds(element, root);

      return {
        startPx: topPx,
        endPx: topPx + heightPx,
      };
    })
    .filter((range) => range.endPx > range.startPx)
    .sort((a, b) => a.startPx - b.startPx);
}

export function convertAvoidRangesToMm(
  rangesPx: AvoidRangePx[],
  rootScrollHeightPx: number,
  totalHeightMm: number,
): AvoidRange[] {
  if (rootScrollHeightPx <= 0) {
    return [];
  }

  const mmPerPx = totalHeightMm / rootScrollHeightPx;

  return rangesPx.map((range) => ({
    startMm: range.startPx * mmPerPx,
    endMm: range.endPx * mmPerPx,
  }));
}

export function getAvoidBreakRanges(
  root: HTMLElement,
  totalHeightMm: number,
): AvoidRange[] {
  return convertAvoidRangesToMm(
    getAvoidBreakRangesPx(root),
    root.scrollHeight,
    totalHeightMm,
  );
}

export function computePageSegments(
  totalHeightMm: number,
  pageContentHeightMm: number,
  avoidRanges: AvoidRange[],
): PageSegment[] {
  const segments: PageSegment[] = [];
  let offsetMm = 0;

  while (offsetMm < totalHeightMm - 0.01) {
    let endMm = Math.min(offsetMm + pageContentHeightMm, totalHeightMm);
    let adjusted = true;

    while (adjusted) {
      adjusted = false;

      for (const range of avoidRanges) {
        const elementHeightMm = range.endMm - range.startMm;

        if (elementHeightMm > pageContentHeightMm) {
          continue;
        }

        const splitsElement = range.startMm < endMm && endMm < range.endMm;
        if (!splitsElement) {
          continue;
        }

        if (range.startMm > offsetMm) {
          endMm = range.startMm;
          adjusted = true;
          continue;
        }

        const remainingMm = range.endMm - offsetMm;
        if (range.startMm <= offsetMm && remainingMm <= pageContentHeightMm) {
          endMm = range.endMm;
          adjusted = true;
        }
      }
    }

    if (endMm <= offsetMm) {
      endMm = Math.min(offsetMm + pageContentHeightMm, totalHeightMm);
    }

    segments.push({ startMm: offsetMm, endMm });
    offsetMm = endMm;
  }

  return segments;
}

export function cropCanvasToHeight(
  source: HTMLCanvasElement,
  targetHeightPx: number,
): HTMLCanvasElement {
  const height = Math.max(1, Math.min(source.height, targetHeightPx));
  if (height === source.height) {
    return source;
  }

  const cropped = document.createElement("canvas");
  cropped.width = source.width;
  cropped.height = height;

  const context = cropped.getContext("2d");
  if (!context) {
    throw new Error("Canvas 2D context unavailable");
  }

  context.drawImage(source, 0, 0, source.width, height, 0, 0, source.width, height);
  return cropped;
}

function parseHexBackground(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function isCanvasRowBlank(
  ctx: CanvasRenderingContext2D,
  y: number,
  width: number,
  background: { r: number; g: number; b: number },
): boolean {
  const { data } = ctx.getImageData(0, y, width, 1);

  for (let x = 0; x < width; x += 6) {
    const index = x * 4;
    if (
      Math.abs(data[index] - background.r) > 10 ||
      Math.abs(data[index + 1] - background.g) > 10 ||
      Math.abs(data[index + 2] - background.b) > 10
    ) {
      return false;
    }
  }

  return true;
}

export function trimCanvasBottomBackground(
  source: HTMLCanvasElement,
  backgroundHex: string,
  sampleWidthPx = source.width,
): HTMLCanvasElement {
  const context = source.getContext("2d");
  if (!context) {
    return source;
  }

  const background = parseHexBackground(backgroundHex);
  const width = Math.max(1, Math.min(source.width, sampleWidthPx));
  let bottom = source.height - 1;

  while (bottom > 0 && isCanvasRowBlank(context, bottom, width, background)) {
    bottom -= 1;
  }

  return cropCanvasToHeight(source, bottom + 1);
}

export function pruneInsignificantTailSegment(
  segments: PageSegment[],
  minHeightMm = 6,
): PageSegment[] {
  if (segments.length <= 1) {
    return segments;
  }

  const last = segments[segments.length - 1];
  if (last.endMm - last.startMm >= minHeightMm) {
    return segments;
  }

  return segments.slice(0, -1);
}

export function sliceCanvasSegment(
  source: HTMLCanvasElement,
  startMm: number,
  endMm: number,
  totalHeightMm: number,
): HTMLCanvasElement {
  const startPx = Math.round((startMm / totalHeightMm) * source.height);
  const endPx = Math.round((endMm / totalHeightMm) * source.height);
  const heightPx = Math.max(1, endPx - startPx);

  const slice = document.createElement("canvas");
  slice.width = source.width;
  slice.height = heightPx;

  const context = slice.getContext("2d");
  if (!context) {
    throw new Error("Canvas 2D context unavailable");
  }

  context.drawImage(
    source,
    0,
    startPx,
    source.width,
    heightPx,
    0,
    0,
    source.width,
    heightPx,
  );

  return slice;
}
