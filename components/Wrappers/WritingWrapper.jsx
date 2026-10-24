"use client";

import { ArrowRight, NotebookPen } from "lucide-react";
import { formatDate } from "@/utils/Helpers";
import SectionTitle from "./SectionTitle";
import EmptyState from "../Modules/EmptyState";
import ScrollReveal from "../Modules/ScrollReveal";
import { ProgressLink } from "../Modules/RouteProgress";

// The most recent posts as a ruled list rather than another card grid, so
// the section reads as a reading list and doesn't echo Projects above it.
const WritingWrapper = ({ posts }) => {
  return (
    <div className="min-w-0">
      <SectionTitle
        sectionId="writing"
        title="Latest Writing"
        subtitle="Notes from building things"
        alertMessage="Fresh from the blog"
        alertIcon={NotebookPen}
      />

      <ScrollReveal>
        {posts?.length > 0 && (
          <ol className="divide-border-subtle border-border-subtle divide-y border-y">
            {posts.map((post) => (
              <li key={post.id}>
                <ProgressLink
                  href={`/blog/${post.id}`}
                  className="group hover:bg-surface-raised/60 focus-visible:bg-surface-raised/60 grid grid-cols-1 gap-2 px-2 py-6 transition-colors focus-visible:outline-none sm:grid-cols-[9rem_1fr_auto] sm:gap-6 sm:px-4"
                >
                  <span className="text-text-muted pt-1 font-mono text-xs tabular-nums">
                    {formatDate(post.date)}
                    <span className="block">{post.readTime}</span>
                  </span>

                  <span className="min-w-0">
                    <span className="text-text-primary group-hover:text-accent block text-lg font-semibold transition-colors">
                      {post.title}
                    </span>
                    <span className="text-text-muted mt-1.5 line-clamp-2 block max-w-3xl text-sm leading-relaxed">
                      {post.excerpt}
                    </span>
                  </span>

                  <ArrowRight className="text-text-muted group-hover:text-accent hidden h-5 w-5 self-center transition-transform duration-150 group-hover:translate-x-1 sm:block" />
                </ProgressLink>
              </li>
            ))}
          </ol>
        )}

        {!posts?.length && (
          <EmptyState
            command="ls ~/blog"
            failed={!posts}
            emptyMessage="No posts published yet."
          />
        )}

        <ProgressLink
          href="/blogs"
          className="text-accent mt-6 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
        >
          Read all posts
        </ProgressLink>
      </ScrollReveal>
    </div>
  );
};

export default WritingWrapper;
