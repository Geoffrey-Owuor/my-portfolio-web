import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { highlightPlugin } from "@/utils/rehypeHighlight";

const PreviewModal = ({ isOpen, content }) => {
  return (
    <>
      {isOpen && (
        <div className="max-h-[403px] min-h-[403px] w-full overflow-y-auto p-4 [scrollbar-width:thin]">
          {/* 'prose' class comes from @tailwindcss/typography */}
          <article className="prose prose-sm dark:prose-invert prose-img:rounded-card prose-headings:font-semibold prose-a:text-accent max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[highlightPlugin]}
            >
              {content || "*Nothing to preview yet...*"}
            </ReactMarkdown>
          </article>
        </div>
      )}
    </>
  );
};

export default PreviewModal;
