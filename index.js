'use strict'
const chalk = require('chalk')
const got = require('got')
const inquirer = require('inquirer')

const FIREBASE_DB_URL = 'https://english-accents-map.firebaseio.com/'
const HTTP_REQUEST_OPTIONS = {
  json: true
}

function getCountries () {
  return got(`${FIREBASE_DB_URL}countries.json`, HTTP_REQUEST_OPTIONS)
    .then(response => response.body)
}

function promptSelectCountry (countries) {
  const choices = Object.keys(countries)
    .map(key => Object.assign(countries[key], {
      value: key,
      name: `${countries[key].flag}  ${countries[key].name}`
    }))
    .filter(country => country.published)
    .sort((a, b) => a.order < b.order ? -1 : 1)

  return inquirer.prompt([{
    type: 'list',
    name: 'key',
    message: 'Select country:',
    choices
  }])
}

function getAccents (selectedCountryKey) {
  const q = `orderBy="country"&equalTo="${selectedCountryKey}"`
  return got(`${FIREBASE_DB_URL}accents.json?${q}`, HTTP_REQUEST_OPTIONS)
    .then(response => response.body)
}

function promptSelectAccent (accents) {
  const choices = Object.keys(accents)
    .map(key => Object.assign(accents[key], {value: accents[key].videos}))
    .sort((a, b) => a.name < b.name ? -1 : 1)

  return inquirer.prompt([{
    type: 'list',
    name: 'videos',
    message: 'Select accent:',
    choices
  }])
}

function showAccentVideos (videoIds) {
  console.log(chalk.yellow('Check out these videos:'))
  videoIds.forEach(id => console.log(`https://youtu.be/${id}`))
}

function init (search) {
  console.log(chalk.yellow('English Accents CLI '))

  getCountries()
    .then(countries => promptSelectCountry(countries))
    .then(selectedCountry => getAccents(selectedCountry.key))
    .then(accents => promptSelectAccent(accents))
    .then(selectedAccent => showAccentVideos(selectedAccent.videos))
    .catch(err => console.log(err))
}

module.exports = init
