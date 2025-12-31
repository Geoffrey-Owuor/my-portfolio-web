import { getSession } from "@/cache/getSession";
import { UserProvider } from "@/context/UserContext";

export const metadata = {
  title: "Tech Blogs | Insights on Software, Security & Emerging Technologies",
  description:
    "Explore easy-to-understand tech blogs covering software development, cybersecurity, cryptocurrency, cloud computing, and emerging technologies.",

  openGraph: {
    title: "Tech Blog | Technology Insights & Practical Guides",
    description:
      "Explore tech blogs with clear explanations on programming, security, cryptocurrency, and modern software technologies.",
    type: "website",
    url: "/blogs",
    siteName: "Tech Blogs",
  },
};

const layout = async ({ children }) => {
  const user = await getSession();
  return <UserProvider user={user}>{children}</UserProvider>;
};

export default layout;
