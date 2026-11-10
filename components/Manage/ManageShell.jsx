"use client";

import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "../Layout/PageHeader";
import LogoutButton from "../Modules/LogoutButton";
import UserInfoCard from "../Modules/UserInfoCard";
import BlogsTab from "./BlogsTab";
import InboxTab from "./InboxTab";
import ResourceList from "./ResourceList";
import ResumeTab from "./ResumeTab";

const TABS = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "stack", label: "Stack" },
  { id: "blogs", label: "Blogs" },
  { id: "resume", label: "Résumé" },
  { id: "inbox", label: "Inbox" },
];

// One page with a tab per content type. The active tab lives in ?tab=, so a
// reload, a deep link and the back button all land on the same tab.
const ManageShell = ({ user, content }) => {
  const searchParams = useSearchParams();
  const tabRefs = useRef({});

  const requested = searchParams.get("tab");
  const activeTab = TABS.some((tab) => tab.id === requested)
    ? requested
    : TABS[0].id;

  const selectTab = (id) => {
    if (id === activeTab) return;
    // Next keeps useSearchParams in step with pushState, without a server
    // round trip for what is only a change of panel.
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  const moveTo = (id) => {
    selectTab(id);
    const tab = tabRefs.current[id];
    tab?.focus();
    tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const handleKeyDown = (event) => {
    const index = TABS.findIndex((tab) => tab.id === activeTab);
    const targets = {
      ArrowRight: TABS[(index + 1) % TABS.length],
      ArrowLeft: TABS[(index - 1 + TABS.length) % TABS.length],
      Home: TABS[0],
      End: TABS[TABS.length - 1],
    };
    const target = targets[event.key];
    if (!target) return;
    event.preventDefault();
    moveTo(target.id);
  };

  return (
    <div className="container-page py-section">
      <div className="relative">
        {/* The padding keeps the title clear of the account controls. */}
        <PageHeader
          path="manage"
          title="Manage portfolio"
          subtitle="Everything visitors see, in one place"
          className="pr-14 sm:pr-32 lg:pr-96"
        />
        <div className="absolute top-0 right-0 flex items-center gap-3">
          <UserInfoCard user={user} />
          <LogoutButton />
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Content types"
        onKeyDown={handleKeyDown}
        className="border-border-subtle mb-8 flex gap-1 overflow-x-auto border-b pb-2 [scrollbar-width:none]"
      >
        {TABS.map((tab) => {
          const selected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[tab.id] = node;
              }}
              type="button"
              role="tab"
              id={`manage-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls="manage-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(tab.id)}
              className={`rounded-control focus-visible:outline-accent shrink-0 cursor-pointer px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 ${
                selected
                  ? "bg-surface-raised text-text-primary"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="manage-panel"
        aria-labelledby={`manage-tab-${activeTab}`}
        tabIndex={0}
        className="focus-visible:outline-none"
      >
        {activeTab === "projects" && (
          <ResourceList resource="projects" rows={content.projects} />
        )}
        {activeTab === "experience" && (
          <ResourceList resource="experience" rows={content.experience} />
        )}
        {activeTab === "education" && (
          <ResourceList resource="education" rows={content.education} />
        )}
        {activeTab === "skills" && (
          <div className="space-y-10">
            <ResourceList
              resource="technical-skills"
              rows={content["technical-skills"]}
              heading="Technical skills"
            />
            <ResourceList
              resource="soft-skills"
              rows={content["soft-skills"]}
              heading="Soft skills"
            />
          </div>
        )}
        {activeTab === "stack" && (
          <ResourceList
            resource="tools"
            rows={content.tools}
            note="Shown alphabetically in the “Also using” list."
          />
        )}
        {activeTab === "blogs" && (
          <BlogsTab rows={content.blogs} author={user.name} />
        )}
        {activeTab === "resume" && (
          <ResumeTab
            resume={content.resume.latest ?? null}
            failed={Boolean(content.resume.failed)}
          />
        )}
        {activeTab === "inbox" && <InboxTab />}
      </div>
    </div>
  );
};

export default ManageShell;
