const express = require("express");
const fs = require("fs").promises;
const session = require("express-session");
const path = require("path");
const ejs = require("ejs");
const multer = require("multer");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "[]poihgfgioplkoijuyfd",
    name: "aryan",
  })
);
app.set("view engine", "ejs");

app.use("/getpages", express.static("./uploads"));

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const { username } = req.session.user;
    const userdir = `./uploads/${username}`;
    try {
      await fs.mkdir(userdir, { recursive: true });
      cb(null, userdir);
    } catch (err) {
      cb(err, userdir);
    }
    cb(null, userdir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

function authenticateUser(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("login.html");
  }
}

app.post("/uploadfile", authenticateUser, upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({
      err: "file not uploaded",
    });
  } else {
    res.status(201).json({
      success: "file uploaded successfully",
    });
  }
});

app.get("/dashboard", authenticateUser, (req, res) => {
  const { username } = req.session.user;
  res.render("dashboard", {
    username,
  });
});

app.post("/login", async (req, res) => {
  const users = JSON.parse(await fs.readFile("users.json"));
  const { username, password } = req.body;
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  req.session.user = user;

  res.status(200).json({ message: "Login successful" });
});

app.post("/signup", async (req, res) => {
  const users = JSON.parse(await fs.readFile("users.json"));
  const { username, password } = req.body;
  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  await fs.writeFile("users.json", JSON.stringify(users));
  res.status(201).json({ message: "User created successfully" });
});

app.get("/ping", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
