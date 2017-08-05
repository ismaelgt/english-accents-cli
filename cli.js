#!/usr/bin/env node
'use strict'
const chalk = require('chalk')
const got = require('got')
const inquirer = require('inquirer')
const _ = require('lodash')

const FIREBASE_DB_URL = 'https://english-accents-map.firebaseio.com/'
const HTTP_REQUEST_OPTIONS = {
  json: true
}

function getCountries () {
  return got(`${FIREBASE_DB_URL}countries.json`, HTTP_REQUEST_OPTIONS)
    .then(response => response.body)
}

function promptSelectCountry (countries) {
  return inquirer.prompt([{
    type: 'list',
    name: 'key',
    message: 'Select country:',
    choices: _.map(countries, (value, key) => ({name: value.name, value: key}))
  }])
}

function getAccents (selectedCountryKey) {
  const q = `orderBy="country"&equalTo="${selectedCountryKey}"`
  return got(`${FIREBASE_DB_URL}accents.json?${q}`, HTTP_REQUEST_OPTIONS)
    .then(response => response.body)
}

function promptSelectAccent (accents) {
  return inquirer.prompt([{
    type: 'list',
    name: 'videos',
    message: 'Select accent:',
    choices: _.map(accents, value => ({name: value.name, value: value.videos}))
  }])
}

function showAccentVideos (videoIds) {
  videoIds.forEach(id => console.log(`https://youtu.be/${id}`))
}

console.log(chalk.yellow('English Accents CLI'))

getCountries()
  .then(countries => promptSelectCountry(countries))
  .then(selectedCountry => getAccents(selectedCountry.key))
  .then(accents => promptSelectAccent(accents))
  .then(selectedAccent => showAccentVideos(selectedAccent.videos))
  .catch(err => console.log(err))
