#!/usr/bin/env node
'use strict'
const meow = require('meow')
const accents = require('.')

const cli = meow(`
  Usage
    $ english-accents
`)

accents(cli.input[0])
