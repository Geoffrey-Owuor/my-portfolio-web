"use client";

import { ProgressLink } from "../Modules/RouteProgress";
import { ArrowLeft, ArrowRight, ChevronFirst, ChevronLast } from "lucide-react";
import ProjectStack from "../Wrappers/ProjectStack";

// One half of the prev/next pair. `direction` decides which way the card leans:
// "previous" is arrow-first and left aligned, "next" is arrow-last and right
// aligned, so the pair reads outward from the middle of the page.
const NeighbourCard = ({ id, name, stack, direction, isWrapping }) => {
  const isPrevious = direction === "previous";

  // At the ends of the list navigation wraps, so the label says where you
  // actually land rather than a "previous" that walks forwards.
  const label = isWrapping
    ? isPrevious
      ? "last project"
      : "first project"
    : direction;

  const Icon = isWrapping
    ? isPrevious
      ? ChevronFirst
      : ChevronLast
    : isPrevious
      ? ArrowLeft
      : ArrowRight;

  return (
    <ProgressLink
      href={`/projects/${id}`}
      aria-label={`${isPrevious ? "Previous" : "Next"} project: ${name}`}
      className={`group border-border-subtle hover:border-accent focus-visible:border-accent flex flex-col gap-2 rounded-xl border p-5 transition-colors duration-150 focus-visible:outline-none ${
        isPrevious ? "items-start" : "items-end text-right sm:col-start-2"
      }`}
    >
      <span
        className={`text-text-muted group-hover:text-accent flex items-center gap-1.5 font-mono text-xs transition-colors ${
          isPrevious ? "" : "flex-row-reverse"
        }`}
      >
        <Icon
          className={`h-4 w-4 transition-transform duration-200 ${
            isPrevious
              ? "group-hover:-translate-x-1"
              : "group-hover:translate-x-1"
          }`}
        />
        {label}
      </span>

      {/* Names run long, so they are clamped to two lines and allowed to break
          mid-word — a single unbroken token would otherwise overflow the card. */}
      <h2 className="text-text-primary group-hover:text-accent line-clamp-2 text-lg font-semibold wrap-break-word transition-colors">
        {name}
      </h2>

      {stack && (
        <div className={isPrevious ? "" : "flex justify-end"}>
          <ProjectStack projectStack={stack} limit={2} />
        </div>
      )}
    </ProgressLink>
  );
};

const ProjectNav = ({ project }) => {
  const hasPrevious =
    project.previous_project_id && project.previous_project_id !== project.id;
  const hasNext =
    project.next_project_id && project.next_project_id !== project.id;

  // A lone project is its own neighbour on both sides — nothing to page through.
  if (!hasPrevious && !hasNext) return null;

  return (
    <nav
      aria-label="Project navigation"
      className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {hasPrevious && (
        <NeighbourCard
          id={project.previous_project_id}
          name={project.previous_project_name}
          stack={project.previous_project_stack}
          direction="previous"
          isWrapping={project.is_first_project}
        />
      )}
      {hasNext && (
        <NeighbourCard
          id={project.next_project_id}
          name={project.next_project_name}
          stack={project.next_project_stack}
          direction="next"
          isWrapping={project.is_last_project}
        />
      )}
    </nav>
  );
};

export default ProjectNav;
