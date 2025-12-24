import LoginPage from "@/components/Auth/LoginPage";
import { requireSession } from "@/lib/Auth";
import { redirect } from "next/navigation";
const page = async () => {
  const user = await requireSession();

  if (user) redirect("/createblog");
  return <LoginPage />;
};

export default page;
