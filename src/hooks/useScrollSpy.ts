"use client";

import { useCallback, useEffect, useState } from "react";

const SCROLL_OFFSET = 140;

export function useScrollSpy(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = useState<string>("top");

  const updateActiveSection = useCallback(() => {
    const sections = sectionIds
      .map((id) => {
        const el = document.getElementById(id);
        return el ? { id, el } : null;
      })
      .filter((section): section is { id: string; el: HTMLElement } => section !== null)
      .sort(
        (a, b) =>
          a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top,
      );

    if (sections.length === 0) {
      setActiveId("top");
      return;
    }

    const viewportBottom = window.scrollY + window.innerHeight;
    const nearBottom =
      viewportBottom >= document.documentElement.scrollHeight - 2;

    if (nearBottom) {
      setActiveId(sections[sections.length - 1].id);
      return;
    }

    if (sections[0].el.getBoundingClientRect().top > SCROLL_OFFSET) {
      setActiveId("top");
      return;
    }

    let current = sections[0].id;
    for (const { id, el } of sections) {
      if (el.getBoundingClientRect().top <= SCROLL_OFFSET) {
        current = id;
      }
    }

    setActiveId(current);
  }, [sectionIds]);

  useEffect(() => {
    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [updateActiveSection]);

  return activeId;
}
