const express = require('express');
const git = require('simple-git')();

const app = express();

app.set('view engine', 'ejs');

app.get('/log', (req, res) => {
	git.log((err, log) => {
		res.render('log', { log: JSON.stringify(log, null, 4) });
	});
});

app.get('/diff', (req, res) => {
	git.diff((err, diff) => {
		console.log(diff);
		res.render('diff', { diff: diff });
	});
});

app.listen(3000, () => {
	console.log('Listening');
});
