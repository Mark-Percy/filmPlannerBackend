/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require('firebase-functions/v2/https');
 * const {onDocumentWritten} = require('firebase-functions/v2/firestore');
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const {defineSecret} = require('firebase-functions/params');
const fetch = require('node-fetch');

const tmdb = defineSecret('tmdbkey');


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.getFilms = onRequest({ secrets: [tmdb] },(request, response) => {
	if(request.query.dateFrom) logger.info(request.query.dateFrom)
	else response.send('No Date Selected')
	const fromDate = new Date(request.query.dateFrom)
	const toDate = new Date(fromDate)
	toDate.setMonth(toDate.getMonth() + 1)
	logger.info(fromDate.toISOString().split('T')[0])
	logger.info(toDate.toISOString().split('T')[0])
	logger.info('Getting Films from tmdb from date');
	const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-UK&page=1&primary_release_date.gte=${fromDate.toISOString().split('T')[0]}&primary_release_date.lte=${toDate.toISOString().split('T')[0]}&sort_by=popularity.desc&with_release_type=3&region=GB`;
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: tmdb.value()
		}
	};
	
	fetch(url, options)
		.then(res => res.json())
		.then(json => {
			response.send(json);
		})
		.catch(err => console.error('error:' + err));
	// response.send(request.query.dateFrom);

});

