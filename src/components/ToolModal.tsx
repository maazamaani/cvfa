"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AppModal, useModalClose } from "@/components/AppModal";
import type { ToolGroup } from "@/data/cv";
import type { ElementType } from "react";

export type SelectedTool = {
  name: string;
  icon: ElementType;
  group: ToolGroup;
  description: string;
};

function ToolModalHeader({ tool }: { tool: SelectedTool }) {
  const requestClose = useModalClose();
  const Icon = tool.icon;

  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tool.group.iconBg}`}
        >
          <Icon
            className={`h-5 w-5 ${tool.group.iconColor}`}
            strokeWidth={1.75}
          />
        </div>
        <div className="min-w-0">
          <h2
            id="tool-modal-title"
            className="text-lg font-semibold text-slate-800 dark:text-slate-100"
          >
            {tool.name}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tool.group.title}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={requestClose}
        aria-label="بستن"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToolModal({
  tool,
  onClose,
}: {
  tool: SelectedTool | null;
  onClose: () => void;
}) {
  const [presentedTool, setPresentedTool] = useState<SelectedTool | null>(null);

  useEffect(() => {
    if (tool) setPresentedTool(tool);
  }, [tool]);

  const handleClose = useCallback(() => {
    setPresentedTool(null);
    onClose();
  }, [onClose]);

  if (!presentedTool) return null;

  return (
    <AppModal
      isVisible={Boolean(tool)}
      onClose={handleClose}
      titleId="tool-modal-title"
      header={<ToolModalHeader tool={presentedTool} />}
    >
      <p className="px-5 py-5 text-sm leading-7 text-slate-600 dark:text-slate-400">
        {presentedTool.description}
      </p>
    </AppModal>
  );
}
