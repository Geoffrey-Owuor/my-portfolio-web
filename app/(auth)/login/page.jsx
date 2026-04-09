import LoginPage from "@/components/Auth/LoginPage";

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
  return <LoginPage />;
};

export default page;
