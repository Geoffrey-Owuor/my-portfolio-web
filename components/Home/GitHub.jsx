import { getGitHubData } from "@/cache/GitHubData";
import GitHubWrapper from "../Wrappers/GitHubWrapper";

const GitHub = async () => {
  const data = await getGitHubData();

  return (
    <section
      id="activity" // For navbar link
      className="mx-auto flex w-full max-w-7xl justify-center px-4 py-20 md:py-28"
    >
      <GitHubWrapper data={data} />
    </section>
  );
};

export default GitHub;
