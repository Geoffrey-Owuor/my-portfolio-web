import LoginPage from "@/components/Auth/LoginPage";
import { redirect } from "next/navigation";
import { getSession } from "@/cache/getSession";

const page = async () => {
  const user = await getSession();
  if (user) redirect("/createblog");
  return <LoginPage />;
};

export default page;
