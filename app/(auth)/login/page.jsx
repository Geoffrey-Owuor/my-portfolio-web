import LoginPage from "@/components/Auth/LoginPage";
import { redirect } from "next/navigation";
import { getSession } from "@/cache/getSession";
import NavBar from "@/components/Home/NavBar";
import Footer from "@/components/Home/Footer";

export const metadata = {
  title: "Login Page | Jeff's Portfolio",
  description: "Login to create a blog",

  openGraph: {
    title: "Login Page | Jeff's Portfolio",
    description: "Login Page",
    type: "website",
    authors: ["Geoffrey Owuor"],
  },
};

const page = async () => {
  const user = await getSession();
  if (user) redirect("/createblog");
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <LoginPage />
      </main>
      <Footer />
    </div>
  );
};

export default page;
