"use client";

import type { ElementType } from "react";
import { useState } from "react";
import {
  Activity,
  ArrowUpLeft,
  BarChart3,
  Bot,
  Box,
  Brush,
  CheckSquare,
  Code2,
  Container,
  Cpu,
  Database,
  Eye,
  FileCode,
  FileSpreadsheet,
  Globe,
  Image,
  Layers,
  LineChart,
  Palette,
  PenTool,
  Plug,
  Ruler,
  Search,
  Server,
  Tag,
  Target,
  Terminal,
  Webhook,
} from "lucide-react";
import { ToolModal, type SelectedTool } from "@/components/ToolModal";
import { toolGroups, type ToolGroup } from "@/data/cv";

const iconMap: Record<string, ElementType> = {
  brush: Brush,
  image: Image,
  "pen-tool": PenTool,
  ruler: Ruler,
  box: Box,
  layers: Layers,
  "code-2": Code2,
  "file-code": FileCode,
  "file-spreadsheet": FileSpreadsheet,
  palette: Palette,
  database: Database,
  bot: Bot,
  globe: Globe,
  plug: Plug,
  container: Container,
  terminal: Terminal,
  server: Server,
  activity: Activity,
  "check-square": CheckSquare,
  "bar-chart-3": BarChart3,
  search: Search,
  "line-chart": LineChart,
  target: Target,
  eye: Eye,
  tag: Tag,
  webhook: Webhook,
  cpu: Cpu,
};

function ToolCard({
  tool,
  group,
  onSelect,
}: {
  tool: ToolGroup["tools"][number];
  group: ToolGroup;
  onSelect: (tool: SelectedTool) => void;
}) {
  const Icon = iconMap[tool.icon] ?? Code2;

  return (
    <button
      type="button"
      onClick={() =>
        onSelect({
          name: tool.name,
          icon: Icon,
          group,
          description: tool.description,
        })
      }
      className="print-avoid-break flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-start transition hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${group.iconBg}`}
      >
        <Icon className={`h-4 w-4 ${group.iconColor}`} strokeWidth={1.75} />
      </div>
      <span className="min-w-0 flex-1 text-sm font-semibold text-slate-800 lg:text-base dark:text-slate-100">
        {tool.name}
      </span>
      <ArrowUpLeft
        className="h-3.5 w-3.5 shrink-0 text-primary dark:text-primary-soft"
        strokeWidth={2}
      />
    </button>
  );
}

export function ToolsSection() {
  const [selectedTool, setSelectedTool] = useState<SelectedTool | null>(null);

  return (
    <>
      <section id="tools" className="scroll-mt-[140px]">
        <h2 className="mb-8 text-2xl font-semibold text-slate-800 lg:text-3xl dark:text-slate-100">
          ابزارها
        </h2>

        <div className="space-y-10">
          {toolGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-lg font-semibold text-slate-800 lg:text-xl dark:text-slate-100">
                {group.title}
              </h3>
              <div className="cv-card-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool) => (
                  <ToolCard
                    key={`${group.title}-${tool.name}`}
                    tool={tool}
                    group={group}
                    onSelect={setSelectedTool}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
    </>
  );
}
