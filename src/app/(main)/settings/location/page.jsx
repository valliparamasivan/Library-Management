import LocationSection from '@/components/sections/settings/location/locationSection'
import {getSettingsLocationList} from '@/app/api/server'

const LocationPage = async({searchParams}) => {
  const params = await searchParams
  const response = await getSettingsLocationList(params)
  return <LocationSection response={response} />
}

export default LocationPage