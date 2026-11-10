import { redirect } from "next/navigation";
import { getSession } from "@/cache/getSession";
import ManageShell from "@/components/Manage/ManageShell";

// Always rendered per request: this page must never come from a cache.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage portfolio",
  robots: { index: false, follow: false },
};

const ManagePage = async () => {
  const session = await getSession();
  if (!session) redirect("/login");

  return <ManageShell user={{ name: session.name, email: session.email }} />;
};

export default ManagePage;
