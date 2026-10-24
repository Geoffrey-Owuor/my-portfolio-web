import { getGitHubData } from "@/cache/GitHubData";
import GitHubWrapper from "../Wrappers/GitHubWrapper";

const GitHub = async () => {
  const data = await getGitHubData();

  return (
    <section
      id="activity" // For navbar link
      className="section-shell"
    >
      <GitHubWrapper data={data} />
    </section>
  );
};

export default GitHub;
