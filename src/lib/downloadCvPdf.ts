import {
  computePageSegments,
  getAvoidBreakRanges,
  sliceCanvasSegment,
} from "@/lib/pdfPageBreaks";

const EXPORT_ROOT_ID = "cv-export";
const PDF_MARGIN_MM = 6;
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

export async function downloadCvPdf(filename: string): Promise<void> {
  const root = document.getElementById(EXPORT_ROOT_ID);
  if (!root) {
    throw new Error("CV export root not found");
  }

  const html = document.documentElement;
  const isDark = html.classList.contains("dark");
  const exportBackground = isDark
    ? EXPORT_BACKGROUNDS.dark
    : EXPORT_BACKGROUNDS.light;

  html.classList.add("pdf-exporting");
  root.classList.add("pdf-export-root");

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  try {
    const html2canvas = await loadHtml2Canvas();
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(root, {
      scale: 2,
      useCORS: true,
      backgroundColor: exportBackground,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: root.scrollWidth,
      onclone: (doc) => {
        doc.documentElement.classList.add("pdf-exporting");
        if (isDark) {
          doc.documentElement.classList.add("dark");
        }
        const clonedRoot = doc.getElementById(EXPORT_ROOT_ID);
        clonedRoot?.classList.add("pdf-export-root");
      },
    });

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

    // Measure after capture so layout matches the rendered canvas.
    const avoidRanges = getAvoidBreakRanges(root, imgHeight);
    const segments = computePageSegments(imgHeight, contentHeight, avoidRanges);

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
  } finally {
    root.classList.remove("pdf-export-root");
    html.classList.remove("pdf-exporting");
  }
}
