"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const MODAL_ANIMATION_MS = 320;

const ModalCloseContext = createContext<(() => void) | null>(null);

export function useModalClose() {
  const close = useContext(ModalCloseContext);
  if (!close) {
    throw new Error("useModalClose must be used within AppModal");
  }
  return close;
}

function getPanelAnimationClass(isOpen: boolean, hasOpened: boolean) {
  if (isOpen) return "sheet-enter lg:modal-enter";
  if (hasOpened) return "sheet-exit lg:modal-exit";
  return "sheet-closed";
}

export function AppModal({
  isVisible,
  onClose,
  title,
  titleId,
  children,
  header,
}: {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  titleId?: string;
  children: ReactNode;
  header?: ReactNode;
}) {
  const [contentVisible, setContentVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const requestClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isVisible) {
      setContentVisible(true);
      const frame = requestAnimationFrame(() => {
        setIsOpen(true);
        setHasOpened(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    if (hasOpened) {
      setIsOpen(false);
    }
  }, [isVisible, hasOpened]);

  useEffect(() => {
    if (!contentVisible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [contentVisible, requestClose]);

  useEffect(() => {
    if (isOpen || !contentVisible) return;

    const timer = window.setTimeout(() => {
      setContentVisible(false);
      setHasOpened(false);
      onClose();
    }, MODAL_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, [isOpen, contentVisible, onClose]);

  if (!contentVisible) return null;

  return (
    <ModalCloseContext.Provider value={requestClose}>
      <div
        className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-4"
        role="presentation"
      >
        <button
          type="button"
          aria-label="بستن"
          onClick={requestClose}
          className={`pointer-events-auto absolute inset-0 cursor-default bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`pointer-events-auto relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-2xl border border-b-0 border-slate-200 bg-white shadow-xl lg:max-h-none lg:max-w-md lg:rounded-xl lg:border-b dark:border-slate-700 dark:bg-slate-900 ${getPanelAnimationClass(isOpen, hasOpened)}`}
        >
          {header ?? (
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              {title ? (
                <h2
                  id={titleId}
                  className="text-lg font-semibold text-slate-800 dark:text-slate-100"
                >
                  {title}
                </h2>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={requestClose}
                aria-label="بستن"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="overflow-y-auto">{children}</div>
        </div>
      </div>
    </ModalCloseContext.Provider>
  );
}
