import { ProfileWidgets } from "@/components/ProfileWidgets";

export function ProfilePanel() {
  return (
    <aside className="hidden w-64 shrink-0 border-s border-slate-200 dark:border-slate-800 lg:block">
      <div className="sticky top-0 flex h-screen-zoom flex-col items-center justify-center px-6">
        <ProfileWidgets />
      </div>
    </aside>
  );
}
