"use client";

import { useEffect, useRef, useState } from "react";

const RESUME_URL =
  "https://drive.google.com/uc?export=download&id=1ZZzEsXGEL9zd7oNUYMCe8yQfXAAHuSpc";

const scrollToId = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const COMMANDS = [
  {
    id: "whoami",
    label: "whoami",
    output:
      "Jeff - full-stack developer, Nairobi. APIs, databases, interfaces, deploys.",
    run: null,
  },
  {
    id: "experience",
    label: "cat experience.md",
    output: "Opening experience section...",
    run: () => scrollToId("experience"),
  },
  {
    id: "projects",
    label: "ls projects/",
    output: "Opening projects section...",
    run: () => scrollToId("projects"),
  },
  {
    id: "resume",
    label: "open resume.pdf",
    output: "Opening resume in a new tab...",
    run: () => window.open(RESUME_URL, "_blank", "noopener,noreferrer"),
  },
  {
    id: "contact",
    label: "contact --new",
    output: "Opening contact form...",
    run: () => scrollToId("contact"),
  },
];

const TYPE_SPEED_MS = 22;

const HeroTerminal = () => {
  const [typed, setTyped] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [output, setOutput] = useState(null);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  const runCommand = (command) => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    setActiveId(command.id);
    setOutput(null);
    setTyped("");

    for (let i = 0; i < command.label.length; i++) {
      const t = setTimeout(
        () => setTyped(command.label.slice(0, i + 1)),
        i * TYPE_SPEED_MS,
      );
      timeoutsRef.current.push(t);
    }

    const t2 = setTimeout(
      () => {
        setOutput(command.output);
        command.run?.();
      },
      command.label.length * TYPE_SPEED_MS + 150,
    );
    timeoutsRef.current.push(t2);
  };

  return (
    <div className="font-dm-mono border-border-subtle bg-surface w-full max-w-xl rounded-lg border text-sm">
      {/* Prompt line */}
      <div className="border-border-subtle flex items-center gap-2 border-b px-4 py-3">
        <span className="text-accent select-none" aria-hidden="true">
          visitor@jeff:~$
        </span>
        <span className="text-text-primary" aria-live="polite">
          {typed}
          <span className="bg-accent ml-0.5 inline-block h-4 w-2 animate-pulse align-middle" />
        </span>
      </div>

      {/* Output line — reserved height so results don't shift layout */}
      <div className="text-text-muted min-h-11 px-4 py-3" aria-live="polite">
        {output ?? "Try a command below, or click through the site as usual."}
      </div>

      {/* Commands */}
      <div className="border-border-subtle flex flex-wrap gap-2 border-t px-4 py-3">
        {COMMANDS.map((command) => (
          <button
            key={command.id}
            type="button"
            onClick={() => runCommand(command)}
            aria-pressed={activeId === command.id}
            className="border-border-subtle text-text-muted hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent rounded-md border px-2.5 py-1.5 transition-colors focus-visible:outline-none"
          >
            {command.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroTerminal;
