import { Download, ExternalLink } from "lucide-react";
import { formatDate } from "@/utils/Helpers";
import ResumeUpload from "../Resume/ResumeUpload";

const FILE_URL = "/resume/file";

const linkClass =
  "border-border-subtle text-text-primary hover:border-accent hover:text-accent rounded-control inline-flex items-center gap-2 border px-4 py-2.5 text-sm font-semibold transition-colors";

// `resume` is null until something has been uploaded; `failed` means storage
// couldn't be reached, so nothing is known about the current file.
const ResumeTab = ({ resume, failed }) => {
  if (failed) {
    return (
      <p className="border-border-subtle text-danger rounded-card border border-dashed px-5 py-8 text-center text-sm">
        Couldn&apos;t reach storage. Please reload and try again.
      </p>
    );
  }

  return (
    <section>
      <p className="text-text-muted mb-4 text-sm">
        {resume
          ? `Last updated ${formatDate(resume.updatedAt)}`
          : "No résumé has been uploaded yet."}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <ResumeUpload hasResume={Boolean(resume)} />
        {resume && (
          <>
            <a
              href={FILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              <ExternalLink className="h-4 w-4" />
              Preview
            </a>
            <a href={`${FILE_URL}?download=1`} download className={linkClass}>
              <Download className="h-4 w-4" />
              Download
            </a>
          </>
        )}
      </div>
    </section>
  );
};

export default ResumeTab;
