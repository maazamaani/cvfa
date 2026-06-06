import { ProfileWidgets } from "@/components/ProfileWidgets";

export function ProfilePanel() {
  return (
    <aside className="hidden w-[200px] shrink-0 self-stretch border-s border-slate-200 dark:border-slate-800 lg:block">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-6">
        <ProfileWidgets />
      </div>
    </aside>
  );
}
