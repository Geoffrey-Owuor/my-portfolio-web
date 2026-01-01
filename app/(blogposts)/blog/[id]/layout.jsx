import { getSession } from "@/cache/getSession";
import { UserProvider } from "@/context/UserContext";

const layout = async ({ children }) => {
  const user = await getSession();
  return <UserProvider user={user}>{children}</UserProvider>;
};

export default layout;
