import NavBar from "@/components/Home/NavBar";
import Footer from "@/components/Home/Footer";
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
    url: "'blogs",
    siteName: "Tech Blogs",
  },
};

const layout = async ({ children }) => {
  const user = await getSession();
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
