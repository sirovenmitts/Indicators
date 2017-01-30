const nconf = require('nconf')

nconf.argv().env().file('./Indicatorfile')

const every = require('every.js')
const debug = require('debug')('Indicators')

const five = require('johnny-five')
const board = new five.Board({
	repl: false
})

board.on('ready', function () {
	//nconf.get('indicators').forEach(function(indicatorDescription) {
	//	const {indicator, schedule} = indicatorDescription
	//	const indicatorFn = require(`processes/${indicator}`)
	//	every(schedule, indicatorFn(ind))
	//})
	const GithubContributionsLED = new five.Led(3)

	const GithubContributionsForToday = require('./processes/GithubContributionsForToday')
	every('5 seconds', GithubContributionsForToday('sirovenmitts', function (count) {
		if (count) {
			GithubContributionsLED.off()
		} else {
			//GithubContributionsLED.on()
			GithubContributionsLED.fadeIn(1000)
		}
	}))
})

