const express = require('express');
const git = require('simple-git')();

const app = express();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	}),
);

app.set('view engine', 'ejs');

app.get('/log', (req, res) => {
	git.log((err, log) => {
		res.render('log', { log: log });
	});
});

app.get('/diff', (req, res) => {
	git.diff([], (err, diff) => {
		res.render('diff', { diff: diff });
	});
});

app.post('/commit', (req, res) => {
	git.add('./*').commit([req.body.title, req.body.body], (err, x) => {
		console.log(err, x);

		if (!err) {
			res.sendStatus(200);
		} else res.status(500).send(err);
	});
});

app.listen(3000, () => {
	console.log('Listening');
});
