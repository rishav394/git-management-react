import express from "express";
const git = require("simple-git")();

const app = express();

let approvedHash: string[] = [];

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.get("/log", (_req, res) => {
  git.log((_err: any, log: any) => {
    res.status(200).json(log);
  });
});

app.get("/approvedHash", (_req, res) => {
  res.json(approvedHash);
});

app.post("/approve/:hash", (req, res) => {
  const hash = req.params.hash;
  if (!approvedHash.includes(hash)) {
    approvedHash.push(hash);
  }
  res.json(approvedHash);
});

app.get("/diff", (_req, res) => {
  git.diff([], (_err: any, diff: any) => {
    res.send(diff);
  });
});

app.post("/commit", (req, res) => {
  git
    .add("./*")
    .commit(
      [req.body.title, req.body.body],
      (err: any, x: { summary: { changes: number } }) => {
        if (err) res.sendStatus(400);
        if (x.summary.changes != 0) res.send(x);
        else res.status(400).send("Nothing to commit");
      }
    );
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
