"use client";

import { useState } from "react";
import { ContactModal } from "@/components/ContactModal";
import { profile } from "@/data/cv";
import { downloadCvPdf } from "@/lib/downloadCvPdf";

export function HeroActions() {
  const [contactOpen, setContactOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function handleDownloadPdf() {
    if (downloading) return;

    setDownloading(true);
    try {
      const safeName = profile.name.trim() || "resume";
      await downloadCvPdf(`${safeName}.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <div
        data-pdf-hide
        className="mt-8 flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:flex-wrap"
      >
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="w-full rounded-full bg-primary px-8 py-3.5 text-center text-base font-medium text-white shadow-sm transition hover:bg-primary-hover lg:w-auto lg:px-6 lg:py-2.5 lg:text-sm dark:bg-primary dark:hover:bg-primary-soft"
        >
          با من تماس بگیرید
        </button>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="w-full rounded-full border border-slate-200 bg-white px-8 py-3.5 text-center text-base font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-70 lg:w-auto lg:px-6 lg:py-2.5 lg:text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
        >
          {downloading ? "در حال آماده‌سازی…" : "دانلود رزومه"}
        </button>
      </div>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}
