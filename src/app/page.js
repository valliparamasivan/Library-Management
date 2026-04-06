import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const Initial = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user?.role && session?.user?.role !== "User") {
    redirect("/dashboard");
  } else if (session?.user?.role === "User") {
    redirect("/customer-dashboard");
  } else {
    redirect("/sign-in");
  }
};

export default Initial;
