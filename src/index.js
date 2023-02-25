import './css/styles.css';
import debounce from 'lodash.debounce';
import fetchData from './api/fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(e) {
  e.preventDefault();

  let countryName = e.target.value.trim();

  if (countryName.length === 0) {
    Notiflix.Notify.info('Please choose your country.');
    resetInput(countryList);
    resetInput(countryInfo);
    return;
  }

  fetchData(countryName)
    .then(response => {
      if (response.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (response.length >= 2 && response.length <= 10) {
        resetInput(countryList);
        createMarkupCountryList(response);
        resetInput(countryInfo);
      } else if (response.length === 1) {
        resetInput(countryInfo);
        createMarkupCountryInfo(response);
        resetInput(countryList);
      }
    })
    .catch(() => {
    resetInput(countryList);
    resetInput(countryInfo);
    Notiflix.Notify.failure('Oops, there is no country with that name');
    }
    );
}

function createMarkupCountryInfo(array) {
  const markup = array.map(
    ({ name, capital, population, flags, languages }) =>
      `<div class="country-info">
      <img class="country__img" src="${flags.svg}" alt="flag" width="120px" height="60px"/>
      <p class="country__name"> ${name.official}</p>
    </div> 
    <ul class="country__info">
      <li class="country__item">Capital: <span class="country-list-span">${capital}</span></li>
      <li class="country__item">Population: <span class="country-list-span">${population}</span></li>
      <li class="country__item">Languages: <span class="country-list-span">${Object.values(languages).join(', ')}</span></li>
    </ul>`
  ).join("")
  
  return countryInfo.insertAdjacentHTML('beforeend', markup);
}



function createMarkupCountryList(array) {
  const markup = array.map(
    country => 
    `<li class="country-list__item">
        <img src="${country.flags.svg}" alt="flag" width="60px" height="40px" />
        <p class="country-list__text"> ${country.name.official}</p>
    </li>`
  )
      .join("");
    return countryList.insertAdjacentHTML('beforeend', markup)
}

function resetInput(el) {
  el.innerHTML = '';
}
