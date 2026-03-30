import EmployeeDetailsSection from "@/components/sections/settings/employees/EmployeeDetailsSection";

const EmployeeDetailsPage = async ({ params }) => {
  const { id } = await params;
  return <EmployeeDetailsSection id={id} />;
};

export default EmployeeDetailsPage;
