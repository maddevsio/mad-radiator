const { Radiator } = require('../lib')
const config = require('./example.config.json')
const { View, parse } = require('vega')
const data = require('./data.json')

const build = async () => {
  const view = new View(parse(data)).renderer('none').initialize()
  // console.log(view.toCanvas)
  const canvas = await view.toCanvas()
  // const blob = canvas.toBlob()
  // console.log(blob)
}

build()
// var view = new vega
//   .View(vega.parse(stackedBarChartSpec))
//   .renderer('none')
//   .initialize();
//
// // generate static PNG file from chart
// view
//   .toCanvas()
//   .then(function (canvas) {
//     // process node-canvas instance for example, generate a PNG stream to write var
//     // stream = canvas.createPNGStream();
//     console.log('Writing PNG to file...')
//     fs.writeFile('stackedBarChart.png', canvas.toBuffer())
//   })
//   .catch(function (err) {
//     console.log("Error writing PNG to file:")
//     console.error(err)
//   });

// new Radiator(config)
