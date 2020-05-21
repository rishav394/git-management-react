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

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/log", (req, res) => {
  git.log((err, log) => {
    res.render("log", { log: log, admin: false, approve: approvedHash });
  });
});

app.get("/logadmin", (req, res) => {
  git.log((err, log) => {
    res.render("log", { log: log, admin: true, approve: approvedHash });
  });
});

app.get("/approve/:hash", (req, res) => {
  const hash = req.params.hash;
  console.log(hash);

  approvedHash.push(hash);
  res.redirect("/logadmin");
});

app.get("/diff", (req, res) => {
  git.diff([], (err, diff) => {
    res.render("diff", { diff: diff });
  });
});

app.post("/commit", (req, res) => {
  git.add("./*").commit([req.body.title, req.body.body], (err, x) => {
    if (err) res.send(err);
    if (x.summary.changes != 0) res.send(x);
    else res.send("Nothing to commit");
  });
});

app.listen(1000, () => {
  console.log("Listening");
});
