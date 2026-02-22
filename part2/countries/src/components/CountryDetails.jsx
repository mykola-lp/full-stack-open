import Heading from './Heading'
import Weather from './Weather'

const CountryDetails = ({ country }) => {
  return (
    <div>
      <Heading level={2}>{country.name.common}</Heading>

      <p>Capital: {country.capital?.[0]}</p>
      <p>Area: {country.area}</p>

      <Heading level={3}>Languages</Heading>

      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt}
        width="250"
      />

      <Weather capital={country.capital?.[0]} />
    </div>
  )
}

export default CountryDetails
