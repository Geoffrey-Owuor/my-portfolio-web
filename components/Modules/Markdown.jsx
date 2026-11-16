import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Markdown rendered on the server. Pass the result to a client component as a
// prop or child, so the markdown libraries never reach the browser.
const Markdown = ({ children }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
);

export default Markdown;
