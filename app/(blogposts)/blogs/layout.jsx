import NavBar from "@/components/Home/NavBar";
import Footer from "@/components/Home/Footer";
import { getSession } from "@/cache/getSession";
import { UserProvider } from "@/context/UserContext";

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
