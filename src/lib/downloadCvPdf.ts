import {
  computePageSegments,
  convertAvoidRangesToMm,
  cropCanvasToHeight,
  getAvoidBreakRangesPx,
  getExportContentHeightPx,
  pruneInsignificantTailSegment,
  sliceCanvasSegment,
  trimCanvasBottomBackground,
  type AvoidRangePx,
} from "@/lib/pdfPageBreaks";

const EXPORT_ROOT_ID = "cv-export";
const PDF_MARGIN_MM = 6;
const CAPTURE_SCALE = 2;
/** Must be >= 1024 so lg: styles apply in the capture iframe. */
const CAPTURE_VIEWPORT_WIDTH = 1280;
const CAPTURE_VIEWPORT_HEIGHT_MAX = 12000;
const CAPTURE_VIEWPORT_HEIGHT_MIN = 900;

function getCaptureViewportHeight(root: HTMLElement): number {
  return Math.min(
    CAPTURE_VIEWPORT_HEIGHT_MAX,
    Math.max(CAPTURE_VIEWPORT_HEIGHT_MIN, root.scrollHeight + 64),
  );
}
const EXPORT_BACKGROUNDS = {
  light: "#ffffff",
  dark: "#0f172a",
} as const;

async function loadHtml2Canvas() {
  const mod = await import("html2canvas-pro");
  return mod.default ?? mod.html2canvas;
}

function fillPdfPageBackground(pdf: import("jspdf").jsPDF, isDark: boolean) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  if (isDark) {
    pdf.setFillColor(15, 23, 42);
  } else {
    pdf.setFillColor(255, 255, 255);
  }

  pdf.rect(0, 0, pageWidth, pageHeight, "F");
}

function applyExportDocumentStyles(doc: Document, isDark: boolean) {
  doc.documentElement.classList.add("pdf-exporting");
  if (isDark) {
    doc.documentElement.classList.add("dark");
  }

  const clonedRoot = doc.getElementById(EXPORT_ROOT_ID);
  if (!clonedRoot) {
    return;
  }

  clonedRoot.classList.add("pdf-export-root");

  // html2canvas copies computed dimensions as inline styles on the inner shell.
  clonedRoot.style.alignItems = "stretch";
  clonedRoot.style.height = "auto";
  clonedRoot.style.minHeight = "0";

  clonedRoot.querySelectorAll("aside").forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    node.style.height = "auto";
    node.style.minHeight = "0";
    node.style.maxHeight = "none";
    node.style.alignSelf = "stretch";
  });

  clonedRoot.querySelectorAll("aside > div").forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    node.style.height = "auto";
    node.style.minHeight = "0";
    node.style.maxHeight = "none";
    node.style.position = "static";
    node.style.alignSelf = "auto";
    node.style.justifyContent = "flex-start";
  });

  const main = clonedRoot.querySelector("main");
  const aside = clonedRoot.querySelector("aside");
  if (main instanceof HTMLElement && aside instanceof HTMLElement) {
    void main.offsetHeight;
    aside.style.height = `${main.offsetHeight}px`;
    aside.style.minHeight = `${main.offsetHeight}px`;
    aside.style.maxHeight = `${main.offsetHeight}px`;
  }
}

export async function downloadCvPdf(filename: string): Promise<void> {
  const root = document.getElementById(EXPORT_ROOT_ID);
  if (!root) {
    throw new Error("CV export root not found");
  }

  const isDark = document.documentElement.classList.contains("dark");
  const exportBackground = isDark
    ? EXPORT_BACKGROUNDS.dark
    : EXPORT_BACKGROUNDS.light;

  let avoidRangesPx: AvoidRangePx[] = [];
  let exportScrollHeightPx = 0;
  let exportMainWidthPx = 0;

  const html2canvas = await loadHtml2Canvas();
  const { jsPDF } = await import("jspdf");

  const captureViewportHeight = getCaptureViewportHeight(root);

  const rawCanvas = await html2canvas(root, {
    scale: CAPTURE_SCALE,
    useCORS: true,
    backgroundColor: exportBackground,
    scrollX: 0,
    scrollY: 0,
    windowWidth: CAPTURE_VIEWPORT_WIDTH,
    windowHeight: captureViewportHeight,
    onclone: (doc) => {
      applyExportDocumentStyles(doc, isDark);

      const clonedRoot = doc.getElementById(EXPORT_ROOT_ID);
      if (!clonedRoot) {
        return;
      }

      // Force layout so export styles and measurements are applied.
      void clonedRoot.offsetHeight;
      exportScrollHeightPx = getExportContentHeightPx(clonedRoot);
      avoidRangesPx = getAvoidBreakRangesPx(clonedRoot);

      const main = clonedRoot.querySelector("main");
      if (main instanceof HTMLElement) {
        exportMainWidthPx = main.offsetWidth;
      }
    },
  });

  const targetCanvasHeight = Math.max(
    1,
    Math.round(exportScrollHeightPx * CAPTURE_SCALE),
  );
  const mainSampleWidthPx = Math.max(
    1,
    Math.round(exportMainWidthPx * CAPTURE_SCALE),
  );
  const canvas = trimCanvasBottomBackground(
    cropCanvasToHeight(rawCanvas, targetCanvasHeight),
    exportBackground,
    mainSampleWidthPx,
  );
  const contentHeightPx = canvas.height / CAPTURE_SCALE;

  const pdf = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PDF_MARGIN_MM * 2;
  const contentHeight = pageHeight - PDF_MARGIN_MM * 2;
  const imgHeight = (canvas.height * contentWidth) / canvas.width;

  const avoidRanges = convertAvoidRangesToMm(
    avoidRangesPx,
    contentHeightPx,
    imgHeight,
  );
  const segments = pruneInsignificantTailSegment(
    computePageSegments(imgHeight, contentHeight, avoidRanges),
  );

  segments.forEach((segment, index) => {
    if (index > 0) {
      pdf.addPage();
    }

    fillPdfPageBackground(pdf, isDark);

    const slice = sliceCanvasSegment(canvas, segment.startMm, segment.endMm, imgHeight);
    const segmentHeightMm = segment.endMm - segment.startMm;
    const sliceHeightMm = (slice.height * contentWidth) / slice.width;

    pdf.addImage(
      slice.toDataURL("image/jpeg", 0.98),
      "JPEG",
      PDF_MARGIN_MM,
      PDF_MARGIN_MM,
      contentWidth,
      sliceHeightMm,
    );

    if (segmentHeightMm < contentHeight) {
      if (isDark) {
        pdf.setFillColor(15, 23, 42);
      } else {
        pdf.setFillColor(255, 255, 255);
      }
      pdf.rect(
        PDF_MARGIN_MM,
        PDF_MARGIN_MM + sliceHeightMm,
        contentWidth,
        contentHeight - segmentHeightMm,
        "F",
      );
    }
  });

  pdf.save(filename);
}
