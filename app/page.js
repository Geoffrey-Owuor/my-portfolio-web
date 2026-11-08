import { Suspense } from "react";
import Hero from "@/components/Home/Hero";
import Skills from "@/components/Home/Skills";
import Stack from "@/components/Home/Stack";
import Projects from "@/components/Home/Projects";
import GitHub from "@/components/Home/GitHub";
import Experience from "@/components/Home/Experience";
import Education from "@/components/Home/Education";
import Contact from "@/components/Home/Contact";
import Writing from "@/components/Home/Writing";
import SkillsSkeleton from "@/components/Skeletons/SkillsSkeleton";
import StackSkeleton from "@/components/Skeletons/StackSkeleton";
import ProjectsSkeleton from "@/components/Skeletons/ProjectsSkeleton";
import ExperienceSkeleton from "@/components/Skeletons/ExperienceSkeleton";
import GitHubSkeleton from "@/components/Skeletons/GitHubSkeleton";
import JsonLd from "@/components/Modules/JsonLd";
import {
  pageMetadata,
  PERSON_SCHEMA,
  SITE_DESCRIPTION,
  SITE_TITLE,
  WEBSITE_SCHEMA,
} from "@/utils/metadata";

export const metadata = pageMetadata({
  title: { absolute: SITE_TITLE },
  socialTitle: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [PERSON_SCHEMA, WEBSITE_SCHEMA],
        }}
      />
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
      <Suspense fallback={<GitHubSkeleton />}>
        <GitHub />
      </Suspense>
      <Suspense fallback={<ExperienceSkeleton />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<ExperienceSkeleton />}>
        <Education />
      </Suspense>
      <Suspense fallback={null}>
        <Writing />
      </Suspense>
      <Contact />
    </div>
  );
}
