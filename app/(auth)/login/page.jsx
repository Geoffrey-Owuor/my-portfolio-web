import LoginPage from "@/components/Auth/LoginPage";
import { redirect } from "next/navigation";
import { getSession } from "@/cache/getSession";

export const metadata = {
  title: "Login Page",
  description: "Blog space login page",

  openGraph: {
    title: "Login Page",
    description: "Blog space login page",
    type: "website",
    url: "/login",
    siteName: "Login Page",
  },
};

const page = async () => {
  const user = await getSession();
  if (user) redirect("/createblog");
  return <LoginPage />;
};

export default page;
