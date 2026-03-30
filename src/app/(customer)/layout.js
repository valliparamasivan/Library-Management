"use client";

import { useSession } from "next-auth/react";
import CustomerHeader from "@/components/layouts/customer/CustomerHeader";

const CustomerLayout = ({ children }) => {
  const { data: session, status } = useSession();
  
  const isAuthenticated = status === "authenticated" && session?.user?.role === "User";
  
  const variant = isAuthenticated ? 'logged-in' : 'logged-out';
  
  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader variant={variant} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
