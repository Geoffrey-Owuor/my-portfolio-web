import { getSession } from "@/cache/getSession";
import { redirect } from "next/navigation";
import NavBar from "@/components/Home/NavBar";
import Footer from "@/components/Home/Footer";
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
    authors: ["Geoffrey Owuor"],
  },
};

const layout = async ({ children }) => {
  const user = await getSession();
  if (!user) redirect("/login");
  return (
    <UserProvider user={user}>
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </UserProvider>
  );
};

export default layout;
