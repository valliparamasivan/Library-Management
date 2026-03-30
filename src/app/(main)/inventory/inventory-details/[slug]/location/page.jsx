import LocationSection from '@/components/sections/inventory/inventory-details/location/locationSection'

const LocationPage = ({ params }) => {
  return <LocationSection slug={params.slug} />
}

export default LocationPage