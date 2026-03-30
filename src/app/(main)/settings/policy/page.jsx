import PolicySection from '@/components/sections/settings/policy/policySection'
import {getSettingsPolicyList} from '@/app/api/server'

const PolicyPage = async({searchParams}) => {
  const params = await searchParams
  const response = await getSettingsPolicyList(params)
  return <PolicySection response={response} />
}

export default PolicyPage