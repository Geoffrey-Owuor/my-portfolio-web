"use client";
import { ArrowRight, BadgeCheck, CircleArrowOutUpRight } from "lucide-react";
import MarkdownPreview from "../Modules/MarkdownPreview";
import { motion } from "framer-motion";
import { useState } from "react";
import ProjectStack from "./ProjectStack";
import ProjectThumb from "./ProjectThumb";
import ShowMoreButtons from "./ShowMoreButtons";
import { ProgressLink, useProgressRouter } from "../Modules/RouteProgress";
import SectionTitle from "./SectionTitle";
import EmptyState from "../Modules/EmptyState";
import ScrollReveal from "../Modules/ScrollReveal";

const ProjectsWrapper = ({ projects }) => {
  const router = useProgressRouter();

  // The number of projects we see on mount
  const [visibleCount, setVisibleCount] = useState(3);

  // Derived states for button visibility logic
  const visibleProjects = (projects ?? []).slice(0, visibleCount);
  const canShowMore = visibleCount < (projects?.length ?? 0);
  const canShowLess = visibleCount > 3;

  // Handle show more and show less
  const handleShowMore = () =>
    setVisibleCount((prev) => Math.min(prev + 3, projects.length));
  const handleShowLess = () => setVisibleCount((prev) => Math.max(prev - 3, 3));

  // Icon animation variants
  const iconVariants = {
    rest: {
      scale: 1,
      rotate: 0,
      x: 0,
      y: 0,
    },
    hover: {
      rotate: 15,
      x: 3,
      y: -3,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Handle navigation to a particular project's case study
  const handleNavigate = (projectId) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <>
      <div className="min-w-0">
        {/* Section Title */}
        <SectionTitle
          sectionId="projects"
          title="My Projects"
          subtitle="Things i've built"
          alertMessage="Thoughtful, well-crafted project work"
          alertIcon={BadgeCheck}
        />
        {/* Responsive Projects Grid */}
        <ScrollReveal>
          <div className="custom:grid-cols-2 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project, _index) => (
              <motion.div
                key={project.id}
                role="link"
                tabIndex={0}
                initial="rest"
                whileHover="hover"
                animate="rest"
                onClick={() => handleNavigate(project.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleNavigate(project.id);
                  }
                }}
                className="group border-border-subtle hover:border-accent focus-visible:border-accent flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border p-6 transition-colors duration-150 focus-visible:outline-none"
              >
                <ProjectThumb
                  projectId={project.id}
                  name={project.project_name}
                />

                {/* Card Header: title + external visit icon */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-text-primary text-h3 line-clamp-2 font-semibold">
                    {project.project_name}
                  </h3>

                  <motion.div
                    variants={iconVariants}
                    className="text-text-muted shrink-0"
                  >
                    <CircleArrowOutUpRight className="h-5 w-5" />
                  </motion.div>
                </div>

                {/* Tech stack pills — quick-scan metadata, high in the hierarchy */}
                <ProjectStack projectStack={project.project_stack} limit={4} />

                {/* Card Description, trimmed for a consistent, skimmable card height */}
                <MarkdownPreview className="text-text-muted mt-3 line-clamp-3 flex-1 leading-relaxed">
                  {project.project_description}
                </MarkdownPreview>

                {/* Footer: primary in-site action */}
                <ProgressLink
                  href={`/projects/${project.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="border-border-subtle text-accent mt-4 flex items-center gap-1.5 border-t pt-4 text-sm font-semibold underline-offset-4 hover:underline"
                >
                  View case study
                  <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
                </ProgressLink>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

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
