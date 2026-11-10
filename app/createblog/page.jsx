import { redirect } from "next/navigation";

// Writing moved to /manage; this keeps old bookmarks working.
const page = () => {
  redirect("/manage?tab=blogs&new=1");
};

export default page;
