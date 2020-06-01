const express = require("express");
const git = require("simple-git")();

const app = express();

let approvedHash = [];

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.get("/log", (req, res) => {
  git.log((err, log) => {
    res.status(200).json(log);
  });
});

app.get("/approvedHash", (req, res) => {
  res.json(approvedHash);
});

app.post("/approve/:hash", (req, res) => {
  const hash = req.params.hash;
  approvedHash.push(hash);
  res.json(approvedHash);
});

app.get("/diff", (req, res) => {
  git.diff([], (err, diff) => {
    res.send(diff);
  });
});

app.post("/commit", (req, res) => {
  git.add("./*").commit([req.body.title, req.body.body], (err, x) => {
    if (err) res.sendStatus(400);
    if (x.summary.changes != 0) res.send(x);
    else res.status(400).send("Nothing to commit");
  });
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
