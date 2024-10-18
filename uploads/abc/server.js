const express = require("express");
const session = require("express-session");
const app = express();

const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "oihgfcgvhjopl[lkoihgfcx",
  })
);

app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.send("yoa are authenticated");
  } else {
    res.status(401).json({
      error: "you are not authenticaed",
    });
  }
});

app.post("/login", (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  if (username == "aryan" && password === "123") {
    req.session.user = {
      username: "aryan",
      password: "123",
    };
    res.status(200).send("authticated");
  } else {
    res.status(400).send("invalid password or username");
  }
});

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
