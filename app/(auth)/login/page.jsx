import LoginPage from "@/components/Auth/LoginPage";
import { OG_IMAGE } from "@/utils/metadata";

export const metadata = {
  title: "Login Page",
  description: "Blog space login page",

  openGraph: {
    title: "Login Page",
    description: "Blog space login page",
    type: "website",
    url: "/login",
    siteName: "Login Page",
    images: OG_IMAGE,
  },
};

const page = async () => {
  return <LoginPage />;
};

export default page;
