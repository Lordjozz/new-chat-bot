const gc = require('geo-calculator')
const geos = require('../data/countries.json')

const GetUserCountry = (geo) => {
  const sorted = geos.sort((a, b) => {
    const r1 = [a.latitude, a.longitude]
    const r2 = [b.latitude, b.longitude]
    const ru = [geo.latitude, geo.longitude]
    const d1 = gc.distance(r1, ru)
    const d2 = gc.distance(r2, ru)
    // console.log(d1, d2, d1 > d2)
    return d1 - d2
  })
  // console.log('1', sorted[0])
  return sorted[0]
}

export default GetUserCountry