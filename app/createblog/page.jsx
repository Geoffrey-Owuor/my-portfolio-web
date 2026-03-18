import { getSession } from "@/cache/getSession";
import { redirect } from "next/navigation";
import BlogPost from "@/components/blog/BlogPost";

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

const page = async () => {
  const user = await getSession();
  if (!user) redirect("/login");
  const userObject = {
    name: user.name,
    id: user.id,
    email: user.email,
  };
  return <BlogPost user={userObject} />;
};

export default page;
