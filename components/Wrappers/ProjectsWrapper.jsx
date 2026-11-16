"use client";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { useState } from "react";
import ProjectStack from "./ProjectStack";
import ProjectThumb from "./ProjectThumb";
import ShowMoreButtons from "./ShowMoreButtons";
import { ProgressLink } from "../Modules/RouteProgress";
import SectionTitle from "./SectionTitle";
import EmptyState from "../Modules/EmptyState";
import { RevealItem } from "../Modules/ScrollReveal";

const ProjectsWrapper = ({ projects }) => {
  // The number of projects we see on mount
  const [visibleCount, setVisibleCount] = useState(3);

  // Every card is in the HTML, so crawlers and find-in-page see them all;
  // the ones past visibleCount are only hidden.
  const canShowMore = visibleCount < (projects?.length ?? 0);
  const canShowLess = visibleCount > 3;

  // Handle show more and show less
  const handleShowMore = () =>
    setVisibleCount((prev) => Math.min(prev + 3, projects.length));
  const handleShowLess = () => setVisibleCount((prev) => Math.max(prev - 3, 3));

  return (
    <>
      <div className="min-w-0">
        {/* Section Title */}
        <SectionTitle
          sectionId="projects"
          title="My Projects"
          subtitle="Things I've built"
          alertMessage="Thoughtful, well-crafted project work"
          alertIcon={BadgeCheck}
        />
        {/* Responsive Projects Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Staggered across a row of up to three. */}
          {(projects ?? []).map((project, index) => (
            <RevealItem
              key={project.id}
              from="lift"
              index={index % 3}
              step={0.08}
              className={index < visibleCount ? "h-full" : "hidden"}
            >
              {/* The card is one real link, so it can be middle-clicked or
                  opened in a new tab. Its name is the project's title; the
                  rest of the card is still read as its content. */}
              <ProgressLink
                href={`/projects/${project.id}`}
                aria-labelledby={`project-title-${project.id}`}
                className="group border-border-subtle hover:border-accent focus-visible:border-accent rounded-card flex h-full flex-col overflow-hidden border p-6 transition-colors duration-150 focus-visible:outline-none"
              >
                <ProjectThumb
                  projectId={project.id}
                  image={project.project_image}
                  name={project.project_name}
                />

                <h3
                  id={`project-title-${project.id}`}
                  className="text-text-primary text-h3 mb-3 line-clamp-2 font-semibold"
                >
                  {project.project_name}
                </h3>

                {/* Tech stack pills — quick-scan metadata, high in the hierarchy */}
                <ProjectStack projectStack={project.project_stack} limit={4} />

                {/* Card Description (rendered on the server), clamped for a
                    consistent, skimmable card height */}
                {project.preview}

                {/* Footer: says where the card goes */}
                <span className="border-border-subtle text-accent mt-4 flex items-center gap-1.5 border-t pt-4 text-sm font-semibold underline-offset-4 group-hover:underline">
                  View case study
                  <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
                </span>
              </ProgressLink>
            </RevealItem>
          ))}
        </div>

        {/* Show more buttons */}
        <ShowMoreButtons
          canShowMore={canShowMore}
          canShowLess={canShowLess}
          handleShowLess={handleShowLess}
          handleShowMore={handleShowMore}
        />

        {!projects?.length && (
          <EmptyState
            command="ls ~/projects"
            failed={!projects}
            emptyMessage="No projects published yet."
          />
        )}
      </div>
    </>
  );
};

export default ProjectsWrapper;
