const request = require('request')
const cheerio = require('cheerio')
const moment = require('moment')
const debug = require('debug')('GithubContributionsForToday')

function isAcceptable(response) {
	return response.statusCode >= 200 && response.statusCode <= 299
}

module.exports = function ({username, pin, threshold = 1}, five) {
	if(!username) throw new Error('Missing username')
	if(!pin) throw new Error('Missing pin')

	const indicatorLight = new five.Led(pin)

	return function GithubContributionsForToday() {
		debug('Counting Github contributions for today')
		request(`https://github.com/${username}`, function (error, response, html) {
			if (error) return debug(error)
			if (!isAcceptable(response)) return debug('The response was not OK:', response.statusCode)

			const $ = cheerio.load(html)
			const today = moment().format('YYYY-MM-DD')
			const calendarElement = $(`[data-date="${today}"]`)
			const count = parseInt(calendarElement.data('count'))

			debug('Contributions for', username, 'on', today, ':', count)
			if(count < threshold) {
				debug('There were fewer than', threshold, 'contributions')
				indicatorLight.on()
			} else {
				indicatorLight.off()
			}
		})
	}
}