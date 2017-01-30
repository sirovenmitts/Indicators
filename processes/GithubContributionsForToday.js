const request = require('request')
const cheerio = require('cheerio')
const moment = require('moment')
const debug = require('debug')('GithubContributionsForToday')

function isAcceptable(response) {
	return response.statusCode >= 200 && response.statusCode <= 299
}

module.exports = function (username, onContributionsCounted) {
	return function GithubContributionsForToday() {
		debug('Counting Github contributions for today')
		request('https://github.com/sirovenmitts', function (error, response, html) {
			if (error) return debug(error)
			if (!isAcceptable(response)) return debug('The response was not OK:', response.statusCode)

			const $ = cheerio.load(html)
			const today = moment().format('YYYY-MM-DD')
			const calendarElement = $(`[data-date="${today}"]`)
			const count = calendarElement.data('count')

			debug('Contributions today:', count)
			onContributionsCounted(count)
		})
	}
}