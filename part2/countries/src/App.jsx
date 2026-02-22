import { useState, useEffect } from 'react'

import axios from 'axios'

import Heading from './components/Heading'
import CountriesList from './components/CountriesList'
import CountryDetails from './components/CountryDetails'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const handleShow = (country) => {
    setSelectedCountry(country)
  }

  let countriesToShow = filteredCountries
  if (selectedCountry) {
    countriesToShow = [selectedCountry]
  }

  let content
  if (!search) {
    content = <p>Please enter a country name</p>
  } else if (countriesToShow.length > 10) {
    content = <p>Too many matches, specify another filter</p>
  } else if (countriesToShow.length > 1) {
    content = <CountriesList countries={countriesToShow} onShow={handleShow} />
  } else if (countriesToShow.length === 1) {
    content = <CountryDetails country={countriesToShow[0]} />
  } else {
    content = <p>No countries found</p>
  }

  return (
    <div>
      <Heading level={2}>Find countries</Heading>

      <input value={search} onChange={handleSearchChange} />

      {content}
    </div>
  )
}

export default App
