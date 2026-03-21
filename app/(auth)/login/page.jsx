import LoginPage from "@/components/Auth/LoginPage";
import ParamsSuspense from "@/components/Skeletons/ParamsSuspense";
import { Suspense } from "react";

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
  return (
    <Suspense fallback={<ParamsSuspense />}>
      <LoginPage />
    </Suspense>
  );
};

export default page;
