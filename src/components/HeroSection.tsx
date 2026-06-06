import { HeroActions } from "@/components/HeroActions";
import { MobilePersonalInfoRow } from "@/components/ProfileWidgets";
import { profile } from "@/data/cv";

export function HeroSection() {
  const { hero, name } = profile;

  return (
    <header className="pb-12 pt-2 sm:pb-16 sm:pt-4">
      <h1 className="max-w-2xl text-5xl font-bold leading-[1.1] tracking-tight text-slate-800 lg:text-[2.75rem] lg:leading-[1.2] dark:text-slate-100">
        {name}
      </h1>

      <p className="mt-4 max-w-2xl text-3xl font-semibold leading-snug text-slate-800 lg:text-3xl dark:text-slate-100">
        {hero.titleBefore}{" "}
        <span className="relative inline-block whitespace-nowrap px-0.5">
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-1 top-2 -rotate-1 rounded-sm bg-primary/15 dark:bg-primary-soft/20"
          />
          <span className="relative text-primary dark:text-primary-soft">
            {hero.highlight}
          </span>
        </span>
      </p>

      <p className="mt-6 max-w-xl text-xl leading-relaxed text-slate-500 sm:mt-8 lg:text-lg dark:text-slate-400">
        {hero.summary}
      </p>

      <MobilePersonalInfoRow />

      <HeroActions />
    </header>
  );
}
