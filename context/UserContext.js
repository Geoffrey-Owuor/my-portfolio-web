"use client";
import { createContext, useContext } from "react";

//Create the context
const UserContext = createContext(null);

export const UserProvider = ({ children, user }) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

//Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUser must be used within a UserProvider");

  return context;
};
