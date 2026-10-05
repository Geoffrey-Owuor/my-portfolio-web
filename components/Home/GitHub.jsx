import { getGitHubData } from "@/cache/GitHubData";
import GitHubWrapper from "../Wrappers/GitHubWrapper";

const GitHub = async () => {
  const data = await getGitHubData();

  return (
    <section
      id="activity" // For navbar link
      className="min-h-app mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-16"
    >
      <GitHubWrapper data={data} />
    </section>
  );
};

export default GitHub;
