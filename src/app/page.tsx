import { CVContent } from "@/components/CVContent";
import { MobileNav } from "@/components/MobileNav";
import { MobileThemeFab } from "@/components/MobileThemeFab";
import { ProfilePanel } from "@/components/ProfilePanel";
import { Sidebar } from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl lg:max-w-6xl">
      <Sidebar />
      <div id="cv-export" className="flex min-w-0 flex-1">
        <main className="min-w-0 flex-1">
          <MobileNav />
          <div className="px-6 py-8 sm:px-10 lg:px-12">
            <CVContent />
          </div>
        </main>
        <ProfilePanel />
      </div>
      <MobileThemeFab />
    </div>
  );
}
