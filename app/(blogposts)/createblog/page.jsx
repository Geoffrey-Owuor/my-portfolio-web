import NavBar from "@/components/Home/NavBar";
import Footer from "@/components/Home/Footer";
import BlogPost from "@/components/blog/BlogPost";

const page = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <BlogPost />
      </main>
      <Footer />
    </div>
  );
};

export default page;
