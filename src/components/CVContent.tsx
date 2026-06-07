import { Award, Briefcase, GraduationCap, Heart } from "lucide-react";
import { GridSection } from "@/components/GridSection";
import { HeroSection } from "@/components/HeroSection";
import { ProfileWidgets } from "@/components/ProfileWidgets";
import { ResumeSection, ResumeTimelineItem } from "@/components/ResumeTimeline";
import { SkillsSection } from "@/components/SkillsSection";
import { ToolsSection } from "@/components/ToolsSection";
import {
  certifications,
  education,
  experiences,
  profile,
  volunteer,
} from "@/data/cv";

function ItemList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span
            aria-hidden
            className="mt-[0.35em] shrink-0 text-slate-300 dark:text-slate-600"
          >
            •
          </span>
          <span className="min-w-0 flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CVContent() {
  return (
    <div id="top">
      <HeroSection />

      <section className="mb-8 lg:hidden">
        <ProfileWidgets variant="mobile" />
      </section>

      <GridSection>
        <ResumeSection id="education" title="تحصیلات">
          {education.map((edu, index) => (
            <ResumeTimelineItem
              key={edu.school}
              icon={GraduationCap}
              period={edu.details?.[0] ?? ""}
              title={edu.degree}
              organization={edu.school}
              isLast={index === education.length - 1}
            >
              {edu.details && edu.details.length > 1 ? (
                <p>{edu.details[1]}</p>
              ) : null}
            </ResumeTimelineItem>
          ))}
        </ResumeSection>
      </GridSection>

      <GridSection>
        <ResumeSection id="experience" title="سوابق شغلی">
          {experiences.map((exp, index) => (
            <ResumeTimelineItem
              key={exp.company}
              icon={Briefcase}
              period={exp.period}
              title={exp.company}
              organization={exp.role}
              url={exp.url}
              isLast={index === experiences.length - 1}
            >
              <ItemList items={exp.items} />
            </ResumeTimelineItem>
          ))}
        </ResumeSection>
      </GridSection>

      <GridSection>
        <ResumeSection id="certifications" title="گواهی‌ها">
          {certifications.map((cert, index) => {
            const periodMatch = cert.detail.match(/\(سال ([^)]+)\)/);
            return (
              <ResumeTimelineItem
                key={cert.org}
                icon={Award}
                period={periodMatch ? periodMatch[1] : ""}
                title={cert.org}
                organization={cert.detail.replace(/\s*\([^)]+\)/, "").trim()}
                isLast={index === certifications.length - 1}
              />
            );
          })}
        </ResumeSection>
      </GridSection>

      <GridSection>
        <ResumeSection id="volunteer" title="فعالیت‌های داوطلبانه">
          {volunteer.map((item, index) => (
            <ResumeTimelineItem
              key={item.title}
              icon={Heart}
              period={item.period}
              title={item.title}
              organization={item.role}
              url={item.url}
              isLast={index === volunteer.length - 1}
            />
          ))}
        </ResumeSection>
      </GridSection>

      <GridSection>
        <SkillsSection />
      </GridSection>

      <GridSection>
        <ToolsSection />
      </GridSection>

      <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 py-8 text-sm text-slate-500 sm:flex-row lg:text-base dark:border-slate-800 dark:text-slate-400">
        <span>{profile.name}</span>
        <span>{profile.footerTitle}</span>
      </footer>

    </div>
  );
}
