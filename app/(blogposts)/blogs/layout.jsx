import NavBar from "@/components/Home/NavBar";
import Footer from "@/components/Home/Footer";

const layout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default layout;
