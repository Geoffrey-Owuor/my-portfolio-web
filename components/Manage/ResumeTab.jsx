import { formatDate } from "@/utils/Helpers";
import ResumeHtmlControls from "../Resume/ResumeHtmlControls";
import ResumeUpload from "../Resume/ResumeUpload";
import ResumeView from "../Resume/ResumeView";

// The /resume page's own view, with the owner's controls on top: upload or
// replace the PDF, and manage its web version. The web version shows here
// even while it's hidden from visitors, so it can be checked first.
// `resume` is null until something has been uploaded; `failed` means storage
// couldn't be reached, so nothing is known about the current file.
const ResumeTab = ({ resume, html, failed }) => {
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
      {resume ? (
        <>
          <ResumeHtmlControls html={html} />
          <ResumeView resume={resume} html={html}>
            <ResumeUpload hasResume />
          </ResumeView>
        </>
      ) : (
        <ResumeUpload hasResume={false} />
      )}
    </section>
  );
};

export default ResumeTab;
