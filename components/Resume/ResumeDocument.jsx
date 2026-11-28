// The résumé as a styled page, from the blocks lib/ResumeExtract.js read out
// of the PDF. Everything is plain text and links, so nothing from the PDF is
// ever rendered as HTML. Consecutive items become one list.

const SAFE_HREF = /^(https?:|mailto:)/;

const Runs = ({ runs, muted = false }) =>
  runs.map(({ text, bold, href }, index) => {
    const style = bold
      ? "text-text-primary font-semibold"
      : muted
        ? "text-text-muted"
        : undefined;
    if (href && SAFE_HREF.test(href)) {
      const external = !href.startsWith("mailto:");
      // The PDF's spacing rides on the runs; kept outside the link so the
      // underline stops at the words.
      const [, before, words, after] = text.match(/^(\s*)(.*?)(\s*)$/s);
      return (
        <span key={index}>
          {before}
          <a
            href={href}
            {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            className={`text-accent decoration-accent/40 hover:decoration-accent underline underline-offset-2 transition-colors ${bold ? "font-semibold" : ""}`}
          >
            {words}
          </a>
          {after}
        </span>
      );
    }
    return style ? (
      <span key={index} className={style}>
        {text}
      </span>
    ) : (
      text
    );
  });

// Groups runs of consecutive items so each group renders as one <ul>.
const group = (blocks) => {
  const groups = [];
  for (const block of blocks) {
    const last = groups.at(-1);
    if (block.type === "item" && last?.type === "list") {
      last.items.push(block);
    } else if (block.type === "item") {
      groups.push({ type: "list", items: [block] });
    } else {
      groups.push(block);
    }
  }
  return groups;
};

const ResumeDocument = ({ blocks }) => (
  <article className="border-border-subtle bg-surface rounded-card text-text-muted border px-5 py-8 text-[0.9375rem] leading-relaxed shadow-sm sm:px-10 sm:py-12">
    {group(blocks).map((block, index) => {
      switch (block.type) {
        case "title":
          return (
            <h2
              key={index}
              className="text-text-primary text-h2 text-center font-semibold text-balance"
            >
              {block.runs.map((run) => run.text).join("")}
            </h2>
          );
        case "meta":
          return (
            <p key={index} className="mt-1.5 text-center text-sm">
              <Runs runs={block.runs} />
            </p>
          );
        case "heading":
          return (
            <h3
              key={index}
              className="text-accent border-border-subtle mt-9 mb-4 border-b pb-2 text-xs font-semibold tracking-[0.14em] uppercase first:mt-0"
            >
              {block.runs.map((run) => run.text).join("")}
            </h3>
          );
        case "entry":
          return (
            <p key={index} className="mt-4">
              <Runs runs={block.runs} muted />
            </p>
          );
        case "list":
          return (
            <ul key={index} className="mt-2 space-y-2">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-3">
                  {/* The skills panel's marker, so the two read as one set. */}
                  <span
                    aria-hidden="true"
                    className="border-accent/70 mt-[0.6em] size-1.5 shrink-0 rotate-45 border"
                  />
                  <span className="min-w-0">
                    <Runs runs={item.runs} />
                  </span>
                </li>
              ))}
            </ul>
          );
        default:
          return (
            <p key={index} className="mt-2">
              <Runs runs={block.runs} />
            </p>
          );
      }
    })}
  </article>
);

export default ResumeDocument;
