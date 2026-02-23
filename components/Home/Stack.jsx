import { tools } from "@/assets/assets";
import { getCachedToolNames } from "@/cache/CachedData";
import StackWrapper from "../Wrappers/StackWrapper";

const Stack = async () => {
  // Fetch dynamic data
  const toolNames = await getCachedToolNames();

  // Get static data. Object.entries converts { React: '...' }
  // into [['React', '...']] so we can map over it.
  const toolIcons = Object.entries(tools);

  return (
    <section
      id="stack"
      className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-24 md:px-8"
    >
      <StackWrapper toolNames={toolNames} toolIcons={toolIcons} />
    </section>
  );
};

export default Stack;
