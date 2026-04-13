import FinesSection from "@/components/sections/fines/FinesSection";
import { getFineList } from "@/app/api/server";

const FinesPage = async ({ searchParams }) => {
  const params = await searchParams;
  const response = await getFineList(params);
  return <FinesSection response={response} />;
};

export default FinesPage;
