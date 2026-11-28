import PageHeader from "@/components/Layout/PageHeader";
import ResumeView from "@/components/Resume/ResumeView";
import {
  getCachedLatestResume,
  getCachedResumeHtml,
} from "@/lib/ResumeStorage";
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

// The web version is an extra: if it can't be read, the PDF still shows.
const readHtml = (key) =>
  getCachedResumeHtml(key).then(
    (html) => (html && !html.hidden ? html : null),
    (error) => {
      console.error("Failed to read the résumé's web version:", error);
      return null;
    },
  );

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
  const html = resume ? await readHtml(resume.key) : null;

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
      <ResumeView resume={resume ?? null} html={html} failed={failed} />
    </div>
  );
};

export default ResumePage;
