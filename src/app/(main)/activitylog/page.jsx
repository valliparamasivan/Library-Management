import ActivitylogSection from '@/components/sections/activitylog/ActivitylogSection';
import {getActivityList} from '@/app/api/server'

const ActivitylogPage = async({searchParams}) => {
  const params = await searchParams
  const response = await getActivityList(params)
  return <ActivitylogSection response={response} />
}

export default ActivitylogPage