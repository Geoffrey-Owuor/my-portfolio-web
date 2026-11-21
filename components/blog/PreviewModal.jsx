import MarkdownContent from "./MarkdownContent";

const PreviewModal = ({ isOpen, content }) => {
  return (
    <>
      {isOpen && (
        <div className="scrollbar-slim max-h-[403px] min-h-[403px] w-full overflow-y-auto p-4">
          <MarkdownContent
            size="sm"
            content={content || "*Nothing to preview yet...*"}
          />
        </div>
      )}
    </>
  );
};

export default PreviewModal;
