import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PreviewModal = ({ isOpen, content }) => {
  return (
    <>
      {isOpen && (
        <div className="max-h-[403px] min-h-[403px] w-full overflow-y-auto p-4">
          {/* 'prose' class comes from @tailwindcss/typography */}
          <article className="prose prose-sm dark:prose-invert prose-img:rounded-xl prose-headings:font-bold prose-a:text-blue-600 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || "*Nothing to preview yet...*"}
            </ReactMarkdown>
          </article>
        </div>
      )}
    </>
  );
};

export default PreviewModal;
