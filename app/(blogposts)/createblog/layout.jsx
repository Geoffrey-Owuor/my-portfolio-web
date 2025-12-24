import { verifyRefreshToken } from "@/lib/Auth";
import { verifyAccessToken } from "@/lib/Auth";
import { redirect } from "next/navigation";
import { UserProvider } from "@/context/UserContext";

const layout = async ({ children }) => {
  // Try the fast access token check
  let user = await verifyAccessToken();

  // If access token has expired, check refresh token
  if (!user) {
    user = await verifyRefreshToken();
  }

  if (!user?.id) redirect("/login");
  return <UserProvider user={user}>{children}</UserProvider>;
};

export default layout;
