import { Download, ExternalLink } from "lucide-react";
import PageHeader from "@/components/Layout/PageHeader";
import ResumePreview from "@/components/Resume/ResumePreview";
import { getCachedLatestResume } from "@/lib/ResumeStorage";
import { formatDate } from "@/utils/Helpers";
import { pageMetadata, SITE_NAME } from "@/utils/metadata";

// Prerendering would freeze a failed storage lookup into the page until the
// next upload. The lookup itself stays cached, so this costs very little.
export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Résumé",
  socialTitle: `Résumé | ${SITE_NAME}`,
  description:
    "Geoffrey Owuor's résumé: experience, education and skills as a software developer.",
  path: "/resume",
});

const FILE_URL = "/resume/file";

const actionClass =
  "rounded-control inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors";

const ResumePage = async () => {
  // The lookup throws when storage can't be reached; null means nothing has
  // been uploaded yet.
  const { resume, failed } = await getCachedLatestResume().then(
    (resume) => ({ resume }),
    (error) => {
      console.error("Failed to look up the résumé:", error);
      return { failed: true };
    },
  );

  return (
    <div className="container-page py-section">
      <PageHeader
        path="resume"
        title="Résumé"
        subtitle={
          resume
            ? `Last updated ${formatDate(resume.updatedAt)}`
            : "Experience, education and skills at a glance"
        }
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        {resume && (
          <>
            <a
              href={`${FILE_URL}?download=1`}
              download
              className={`bg-text-primary text-surface hover:opacity-90 ${actionClass}`}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
            <a
              href={FILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`border-border-subtle text-text-primary hover:border-accent hover:text-accent border ${actionClass}`}
            >
              <ExternalLink className="h-4 w-4" />
              Open in new tab
            </a>
          </>
        )}
      </div>

      {resume ? (
        // The key changes on every upload, so the viewer never reuses a
        // stale copy of the previous version, and the preview remounts to
        // show its loading state again.
        <ResumePreview
          key={resume.key}
          file={`${FILE_URL}?v=${encodeURIComponent(resume.key)}`}
        />
      ) : (
        <p
          className={`border-border-subtle rounded-card border border-dashed px-5 py-8 text-center text-sm ${
            failed ? "text-danger" : "text-text-muted"
          }`}
        >
          {failed
            ? "Couldn't load the résumé right now. Please try again shortly."
            : "The résumé hasn't been published yet. Check back soon."}
        </p>
      )}
    </div>
  );
};

export default ResumePage;
