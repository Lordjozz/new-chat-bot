import countries from '../data/countries.json'

const GetCountryFromISO = (code) => {
  return countries.find(_ => _.country.toLowerCase() === code.toLowerCase())
}

export default GetCountryFromISO