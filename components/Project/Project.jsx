import Image from "next/image";
import { ExternalLink, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { highlightPlugin } from "@/utils/rehypeHighlight";
import { ProgressLink } from "../Modules/RouteProgress";
import ProjectStack from "../Wrappers/ProjectStack";
import ProjectNav from "./ProjectNav";

// The screenshots' shared shape; h-auto lets each keep its exact proportions.
const PREVIEW_WIDTH = 1792;
const PREVIEW_HEIGHT = 830;

// The entrance is CSS, like the hero's: everything here is visible on first
// paint, so it must not wait for hydration to appear. Each block rises in turn.
const rise = "motion-safe:animate-hero-rise";

// Rendered on the server, so readers don't download the markdown and syntax
// highlighting libraries.
const Project = ({ projectInfo }) => {
  const project = projectInfo[0];

  return (
    <section className="container-page py-8">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb + Back */}
        <div className={rise}>
          <p className="text-text-muted mb-3 font-mono text-xs">
            ~/projects/{project.id}
          </p>
          <ProgressLink
            href="/#projects"
            className="group text-text-muted hover:text-accent inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to projects
          </ProgressLink>
        </div>

        {/* Title */}
        <h1
          className={`text-text-primary text-h1 mt-8 font-semibold [--hero-delay:80ms] ${rise}`}
        >
          {project.project_name}
        </h1>

        {/* Meta row: stack + repository link */}
        <div
          className={`mt-5 flex flex-col gap-4 [--hero-delay:160ms] sm:flex-row sm:items-center sm:justify-between ${rise}`}
        >
          <ProjectStack projectStack={project.project_stack} />

          {project.project_link && (
            <a
              href={project.project_link}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border-subtle text-text-primary hover:border-accent hover:text-accent focus-visible:border-accent rounded-control inline-flex w-fit shrink-0 items-center gap-2 border px-4 py-2 font-mono text-sm font-medium transition-colors focus-visible:outline-none"
            >
              <span className="text-accent" aria-hidden="true">
                $
              </span>
              open --repo
              {/* The visible label stays the accessible name's start, so
                  voice control can target it. */}
              <span className="sr-only">
                : {project.project_name} repository, opens in a new tab
              </span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>

        {/* Preview pane */}
        {project.project_image && (
          <div
            className={`border-border-subtle bg-surface rounded-card mt-10 overflow-hidden border [--hero-delay:240ms] ${rise}`}
          >
            <div className="border-border-subtle text-text-muted flex items-center gap-2 border-b px-4 py-2.5 font-mono text-xs">
              <span className="text-accent" aria-hidden="true">
                ●
              </span>
              preview.png
            </div>
            <Image
              src={project.project_image}
              alt={`${project.project_name} preview`}
              width={PREVIEW_WIDTH}
              height={PREVIEW_HEIGHT}
              className="h-auto w-full object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* README pane */}
        <div
          className={`border-border-subtle bg-surface rounded-card mt-6 overflow-hidden border [--hero-delay:320ms] ${rise}`}
        >
          <div className="border-border-subtle text-text-muted flex items-center gap-2 border-b px-4 py-2.5 font-mono text-xs">
            <span className="text-accent" aria-hidden="true">
              ●
            </span>
            README.md
          </div>
          <div className="prose dark:prose-invert prose-img:rounded-card prose-headings:font-semibold prose-a:text-accent max-w-none px-6 py-8 wrap-break-word">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[highlightPlugin]}
            >
              {project.project_description}
            </ReactMarkdown>
          </div>
        </div>

        {/* Neighbouring projects — keeps the reader inside the case studies
            instead of bouncing back to the grid between each one. */}
        <div className={`[--hero-delay:400ms] ${rise}`}>
          <div className="bg-border-subtle mt-10 h-px" />
          <ProjectNav project={project} />
        </div>
      </div>
    </section>
  );
};

export default Project;
