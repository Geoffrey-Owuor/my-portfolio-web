import LoginPage from "@/components/Auth/LoginPage";
import { redirect } from "next/navigation";
import { getSession } from "@/cache/getSession";
import NavBar from "@/components/Home/NavBar";
import Footer from "@/components/Home/Footer";

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
