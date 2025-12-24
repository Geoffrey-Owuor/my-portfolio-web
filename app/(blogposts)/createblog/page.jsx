"use client";
import { useUser } from "@/context/UserContext";

const page = () => {
  const user = useUser();
  return (
    <div>
      Welcome {user.name} <p>This is the create blog page</p>
    </div>
  );
};

export default page;
