export const revalidate = 86400; // Revalidate after 24 hrs (Safety measure)

import { Suspense } from "react";
import Hero from "@/components/Home/Hero";
import Skills from "@/components/Home/Skills";
import Stack from "@/components/Home/Stack";
import Projects from "@/components/Home/Projects";
import Experience from "@/components/Home/Experience";
import Education from "@/components/Home/Education";
import Contact from "@/components/Home/Contact";
import SkillsSkeleton from "@/components/Skeletons/SkillsSkeleton";
import StackSkeleton from "@/components/Skeletons/StackSkeleton";
import ProjectsSkeleton from "@/components/Skeletons/ProjectsSkeleton";
import ExperienceSkeleton from "@/components/Skeletons/ExperienceSkeleton";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Suspense fallback={<SkillsSkeleton />}>
        <Skills />
      </Suspense>
      <Suspense fallback={<StackSkeleton />}>
        <Stack />
      </Suspense>
      <Suspense fallback={<ProjectsSkeleton />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<ExperienceSkeleton />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<ExperienceSkeleton />}>
        <Education />
      </Suspense>
      <Contact />
    </div>
  );
}
