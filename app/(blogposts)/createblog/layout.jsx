import { requireSession } from "@/lib/Auth";
import { redirect } from "next/navigation";
import { UserProvider } from "@/context/UserContext";

const layout = async ({ children }) => {
  const user = await requireSession();

  if (!user) redirect("/login");
  return <UserProvider user={user}>{children}</UserProvider>;
};

export default layout;
