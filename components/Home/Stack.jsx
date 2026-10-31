import { tools } from "@/assets/assets";
import { getCachedToolNames } from "@/cache/CachedData";
import StackWrapper from "../Wrappers/StackWrapper";

const Stack = async () => {
  // Fetch dynamic data
  const toolNames = await getCachedToolNames();

  // Render the inline SVG logos here on the server so their path data stays
  // out of the client bundle. The marquee shows each logo twice (for a
  // seamless loop), so each gets its own element: icons with gradients take a
  // per-instance id, and a shared one would duplicate it in the DOM.
  const toolIcons = Object.entries(tools).map(([name, Icon]) => ({
    name,
    icon: <Icon className="h-10 w-10" />,
    loopIcon: <Icon className="h-10 w-10" />,
  }));

  return (
    <section id="stack" className="section-shell">
      <StackWrapper toolNames={toolNames} toolIcons={toolIcons} />
    </section>
  );
};

export default Stack;
