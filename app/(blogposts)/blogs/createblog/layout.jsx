import { getSession } from "@/cache/getSession";
import { redirect } from "next/navigation";

const layout = async ({ children }) => {
  const user = await getSession();

  if (!user) redirect("/blogs/login");
  return <>{children}</>;
};

export default layout;
