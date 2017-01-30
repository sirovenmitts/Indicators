const nconf = require('nconf')

nconf.argv().env().file('./Indicatorfile')

const every = require('every.js')
const debug = require('debug')('Indicators')

const five = require('johnny-five')
const board = new five.Board({
	repl: false
})

board.on('ready', function () {
	nconf.get('indicators').forEach(function(iDescriptor) {
		const {indicator, schedule} = iDescriptor
		const indicatorConstructor = require(`./indicators/${indicator}`)
		const indicatorFn = indicatorConstructor(iDescriptor, five)
		indicatorFn()
		every(schedule, indicatorFn)
	})
})

