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
import BackToTopButton from "@/components/Modules/BackToTopButton";
import NavBar from "@/components/Home/NavBar";
import Footer from "@/components/Home/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center overflow-x-hidden">
      <BackToTopButton />
      <NavBar />
      <main className="flex-1">
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
      </main>
      <Footer />
    </div>
  );
}
