#!/usr/bin/env node
'use strict'
const meow = require('meow')
const accents = require('.')

meow(`
  Usage
    $ english-accents
`)

accents()
