export const PRINT_AVOID_BREAK_CLASS = "print-avoid-break";

export type PageSegment = { startMm: number; endMm: number };

type AvoidRange = { startMm: number; endMm: number };

function getElementBounds(
  element: HTMLElement,
  root: HTMLElement,
): { topPx: number; heightPx: number } {
  const rootRect = root.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return {
    topPx: elementRect.top - rootRect.top,
    heightPx: elementRect.height,
  };
}

function getLeafAvoidElements(root: HTMLElement): HTMLElement[] {
  const elements = Array.from(
    root.querySelectorAll<HTMLElement>(`.${PRINT_AVOID_BREAK_CLASS}`),
  );

  return elements.filter(
    (element) => !element.querySelector(`.${PRINT_AVOID_BREAK_CLASS}`),
  );
}

export function getAvoidBreakRanges(
  root: HTMLElement,
  totalHeightMm: number,
): AvoidRange[] {
  const mmPerPx = totalHeightMm / root.scrollHeight;

  return getLeafAvoidElements(root)
    .map((element) => {
      const { topPx, heightPx } = getElementBounds(element, root);

      return {
        startMm: topPx * mmPerPx,
        endMm: (topPx + heightPx) * mmPerPx,
      };
    })
    .filter((range) => range.endMm > range.startMm)
    .sort((a, b) => a.startMm - b.startMm);
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
