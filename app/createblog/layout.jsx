import { getSession } from "@/cache/getSession";
import { redirect } from "next/navigation";

import { UserProvider } from "@/context/UserContext";

export const metadata = {
  title: "Create a blog | Engage your audience with tech",
  description:
    "Create blogs that explores insights into current technology trends",

  openGraph: {
    title: "Create a blog | Engage your audience with tech",
    description:
      "Create blogs that explores insights into current technology trends",
    type: "website",
    url: "/createblog",
    siteName: "Create a blog",
  },
};

const layout = async ({ children }) => {
  const user = await getSession();
  if (!user) redirect("/login");
  return <UserProvider user={user}>{children}</UserProvider>;
};

export default layout;
