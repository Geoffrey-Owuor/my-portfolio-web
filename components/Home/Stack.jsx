import { tools } from "@/assets/assets";
import { query } from "@/lib/db";
import StackWrapper from "../Wrappers/StackWrapper";

const getToolNames = async () => {
  try {
    const selectQuery = `SELECT id, tool_name FROM tools ORDER BY tool_name`;
    const toolNames = await query(selectQuery);
    return toolNames;
  } catch (error) {
    console.error("Failed to fetch tool names:", error);
    return []; //Return empty array or an error
  }
};

const Stack = async () => {
  // Fetch dynamic data
  const toolNames = await getToolNames();

  // Get static data. Object.entries converts { React: '...' }
  // into [['React', '...']] so we can map over it.
  const toolIcons = Object.entries(tools);

  return (
    <section
      id="stack"
      className="min-h-screen containerizing w-full px-4 py-20 md:px-8"
    >
      <StackWrapper toolNames={toolNames} toolIcons={toolIcons} />
    </section>
  );
};

export default Stack;
