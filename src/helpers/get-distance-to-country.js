import { getDistance } from 'geolib'

const GetDistanceToCountry = (from, to) => {
  return getDistance(from, to)
}

export default GetDistanceToCountry