const { Radiator } = require('../lib')
const config = require('./example.config.json')

const radiator = new Radiator(config)
radiator.run()
