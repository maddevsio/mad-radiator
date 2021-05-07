import * as fs from 'fs'

import { RadiatorConfig } from 'interfaces'
import { error } from 'logger'
import yargs from 'yargs'

import main from '../main'

async function index() {
  const { argv } = yargs(process.argv)
  const pathToConfig: string = argv.config as string

  if (!pathToConfig) {
    error('You need to provide a required parameter: --config')
    process.exit()
  }

  fs.readFile(pathToConfig, 'utf8', (err, data) => {
    if (err) {
      error(`Configuration file was not found in ${pathToConfig}!`)
      process.exit()
    }

    const radiatorConfig: RadiatorConfig = JSON.parse(data) as RadiatorConfig
    main(radiatorConfig)
  })
}

index()
