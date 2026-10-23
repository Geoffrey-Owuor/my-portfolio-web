"use client";

import { HeartHandshake, Loader2, Sparkle } from "lucide-react";
import SectionTitle from "./SectionTitle";
import ScrollReveal from "../Modules/ScrollReveal";

const SkillsWrapper = ({ technicalSkills, softSkills }) => {
  return (
    <div className="mx-1 w-full max-w-5xl min-w-0 flex-1 md:mx-auto">
      {/* Section Title */}
      <SectionTitle
        sectionId="skills"
        title="My Skills"
        subtitle="What I bring to the table"
        alertMessage="Applying technical skills to real-world problems"
        alertIcon={Sparkle}
      />

      <ScrollReveal>
        {/* --- Technical Skills: dominant terminal panel --- */}
        <div className="border-border-subtle bg-surface w-full overflow-hidden rounded-lg border font-mono">
          {/* Terminal chrome header */}
          <div className="border-border-subtle bg-surface-raised/50 flex items-center gap-2 border-b px-4 py-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="bg-danger/60 h-2.5 w-2.5 rounded-full" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <span className="bg-success/60 h-2.5 w-2.5 rounded-full" />
            </span>
            <span className="text-text-muted ml-2 text-xs">
              ~/skills --technical
            </span>
          </div>

          {/* Skill rows */}
          {technicalSkills.length > 0 && (
            <div className="divide-border-subtle grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              {[0, 1].map((col) => (
                <div key={col} className="divide-border-subtle divide-y">
                  {technicalSkills.map((skill, index) => {
                    if (index % 2 !== col) return null;
                    return (
                      <div
                        key={skill.id}
                        className="hover:bg-surface-raised group flex items-center gap-3 px-5 py-3 transition-colors duration-150"
                      >
                        <span className="text-accent/70 text-xs tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-text-primary group-hover:text-accent text-sm transition-colors duration-150">
                          {skill.skill_description}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {technicalSkills.length === 0 && (
            <div className="flex items-center gap-4 px-5 py-10">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-text-muted text-sm">
                Waiting for connection...
              </span>
            </div>
          )}
        </div>

        {/* --- Soft Skills: quiet, additive strip --- */}
        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:items-start">
          <span className="text-text-muted flex shrink-0 items-center gap-1.5 pt-0.5 text-sm">
            <HeartHandshake className="h-3.5 w-3.5" />
            Also brings
          </span>

          {softSkills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {softSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="border-border-subtle text-text-muted rounded-lg border px-3 py-1 text-sm"
                >
                  {skill.skill_description}
                </span>
              ))}
            </div>
          )}

          {softSkills.length === 0 && (
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-text-muted text-xs">
                Waiting for connection...
              </span>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
};

export default SkillsWrapper;
