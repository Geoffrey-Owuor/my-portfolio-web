"use client";
import { useUser } from "@/context/UserContext";
import LogoutButton from "@/components/Modules/LogoutButton";

const page = () => {
  const user = useUser();
  return (
    <div>
      Welcome {user.name} <p>This is the create blog page</p>
      <LogoutButton />
    </div>
  );
};

export default page;
