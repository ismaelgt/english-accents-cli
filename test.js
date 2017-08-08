import test from 'ava'
import execa from 'execa'

const packageJson = require('./package.json')

const cli = (args, opts) => execa('./cli.js', args, opts)

test('CLI shows package version', async t => {
  const thing = await cli(['--version'])
  t.is(thing.stdout, packageJson.version)
})
