import NavBar from "@/components/Home/NavBar";
import Footer from "@/components/Home/Footer";
import { UserProvider } from "@/context/UserContext";
import { requireSession } from "@/lib/Auth";

const layout = async ({ children }) => {
  const user = await requireSession();
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
