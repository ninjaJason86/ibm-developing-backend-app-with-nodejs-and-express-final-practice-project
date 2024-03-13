const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const routes = require('./router/friends.js')

let users = []

function doesExist(username) {
  const userWithSameName = users.find((user) => user.username === username);

  return !!userWithSameName
}

function authenticatedUser(username, password) {
  const userWithSameNameAndPassword = users.find((user) => user.username === username && user.password === password);

  return !!userWithSameNameAndPassword;
}

const app = express();

app.use(session({ secret: "fingerprint", resave: true, saveUninitialized: true }));

app.use(express.json());

app.use("/friends", function auth(request, response, next) {
  if (!request.session["authorization"]) {
    return response.status(403).json({ message: "User not logged in" })
  }

  const token = request.session["authorization"]['accessToken'];
  jwt.verify(token, "access", (error, user) => {
    if (error) {
      return response.status(403).json({ message: "User not authenticated" })
    }

    request["user"] = user;
    next();
  });
});

app.post("/login", (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(404).json({ message: "Error logging in" });
  }

  if (!authenticatedUser(username, password)) {
    return response.status(208).json({ message: "Invalid Login. Check username and password" });
  }

  let accessToken = jwt.sign(
    {
      data: password
    },
    'access',
    { expiresIn: 60 * 60 }
  );

  request.session["authorization"] = {
    accessToken,
    username,
  }
  return response.status(200).send("User successfully logged in");
});

app.post("/register", (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(404).json({ message: "Unable to register user." });
  }

  if (doesExist(username)) {
    return response.status(404).json({ message: "User already exists!" });
  }

  users.push({ "username": username, "password": password });
  return response.status(200).json({ message: "User successfully registered. Now you can login" });
});


const PORT = 5000;

app.use("/friends", routes);

app.listen(PORT, () => console.log("Server is running"));
