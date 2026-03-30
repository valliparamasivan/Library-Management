import EmployeeSection from '@/components/sections/settings/employees/employeeSection'
import { getEmployeeList, getAllRolesDropdown } from '@/app/api/server'

const EmployeePage = async ({ searchParams }) => {
  const params = await searchParams;
  const response = await getEmployeeList(params);
  const rolesResponse = await getAllRolesDropdown();
  return <EmployeeSection response={response} rolesResponse={rolesResponse} />
}

export default EmployeePage
