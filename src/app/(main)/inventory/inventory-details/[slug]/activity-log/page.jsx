import ActivityLogSection from '@/components/sections/inventory/inventory-details/activity-log/activityLogSection'

const ActivityLogPage = ({ params }) => {
  return <ActivityLogSection slug={params.slug} />
}

export default ActivityLogPage