import React from 'react';
import './App.css';
import { CURRENCY_HTML_CODES } from './currencies';
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      selectedCountry: undefined,
      selectedCont: '',
      allCountriesInfo: null,
    };
  }
  componentDidMount() {
    const allCountriesInfo = {};
    ['names', 'continent', 'iso3', 'capital', 'currency', 'phone'].forEach(
      (prop) => {
        fetch(`/api/${prop}`)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            Object.entries(data).forEach(([key, value]) => {
              if (allCountriesInfo[key]) {
                allCountriesInfo[key][prop] = value;
              } else {
                allCountriesInfo[key] = { [prop]: value };
              }
            });
            if (prop === 'phone') {
              this.setState({
                allCountriesInfo,
                loading: false,
              });
            }
          });
      }
    );
  }

  handleContinentChange(e) {
    this.setState({
      selectedCont: e.target.value,
      selectedCountry: '',
    });
  }

  renderMainPage() {
    const { selectedCountry, selectedCont, allCountriesInfo } = this.state;
    return (
      <div>
        <label htmlFor='continet'>Select a Continent </label>
        <select
          id='continent'
          onChange={(e) => {
            this.handleContinentChange(e);
          }}
          value={selectedCont}
        >
          <option value=''>(All)</option>
          <option value='AF'>Africa</option>
          <option value='AS'>Asia</option>
          <option value='EU'>Europe</option>
          <option value='NA'>North America</option>
          <option value='OC'>Oceania</option>
          <option value='SA'>South America</option>
        </select>
        <br></br>
        <label htmlFor='country'>Select a country </label>
        <select
          id='country'
          value={selectedCountry}
          onChange={(e) => this.handleCountryChange(e)}
        >
          {Object.keys(allCountriesInfo).map((key) => {
            return (
              <option key={key} value={key}>
                {allCountriesInfo[key].names}
              </option>
            );
          })}
        </select>
        {selectedCountry ? this.renderCountry() : this.renderCountries()}
      </div>
    );
  }

  renderCountry() {
    const { selectedCountry, allCountriesInfo } = this.state;
    if (!selectedCountry) {
      return null;
    }
    const countryInfo = allCountriesInfo[selectedCountry];
    const currencyCode = CURRENCY_HTML_CODES[countryInfo.currency];
    return (
      <div class='country-info'>
        <div>Full Name: {countryInfo.names}</div>
        <div>Continent: {countryInfo.continent}</div>
        <div>Three-letter ISO Code: {countryInfo.iso3}</div>
        <div>Capital Name: {countryInfo.capital}</div>
        <div>Phone Code: {countryInfo.phone}</div>
        <div>Three-letter Currency Code: {countryInfo.currency}</div>
        {currencyCode ? (
          <div>Currency Symbol: {this.transFlag(currencyCode)}</div>
        ) : null}
        <div>
          <div>Image of the country's flag: </div>
          <img
            alt={`${countryInfo.names}'s flag`}
            src={`https://www.countryflags.io/${selectedCountry}/flat/64.png`}
          ></img>
        </div>
        <a href={`https://en.wikipedia.org/wiki/${countryInfo.names}`}>
          Link to Wikipedia: {countryInfo.names}
        </a>
      </div>
    );
  }

  transFlag(currencyCode) {
    const numbers = currencyCode.replaceAll('&#', '').split(';');
    let output = '';
    numbers.forEach((num, index) => {
      if (index < numbers.length - 1) {
        output += String.fromCharCode(num);
      }
    });
    return output;
  }

  renderCountries() {
    const { selectedCont, allCountriesInfo } = this.state;
    return (
      <ul className='countries' onClick={(e) => this.handleSelectCountry(e)}>
        {!selectedCont
          ? Object.keys(allCountriesInfo).map((key) => (
              <li key={key} id={key} className='country-item'>
                {allCountriesInfo[key].names}
              </li>
            ))
          : Object.keys(allCountriesInfo).map((key) => {
              if (allCountriesInfo[key].continent === selectedCont) {
                return (
                  <li key={key} id={key} className='country-item'>
                    {allCountriesInfo[key].names}
                  </li>
                );
              }
              return null;
            })}
      </ul>
    );
  }

  handleSelectCountry(e) {
    this.setState({ selectedCountry: e.target.id });
  }

  handleCountryChange(e) {
    this.setState({ selectedCountry: e.target.value });
  }

  render() {
    const { loading, allCountriesInfo } = this.state;
    return (
      <div className='App'>
        <h1> Country Data </h1>
        {loading && !allCountriesInfo ? 'loading' : this.renderMainPage()}
      </div>
    );
  }
}

export default App;
