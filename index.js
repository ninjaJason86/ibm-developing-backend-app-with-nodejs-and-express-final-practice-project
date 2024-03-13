const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const routes = require('./router/friends.js')

let users = []

const doesExist = (username) => {
  let usersWithSameName = users.filter((user) => {
    return user.username === username
  });
  if (usersWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => {
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

const app = express();

app.use(session({ secret: "fingerprint", resave: true, saveUninitialized: true }));

app.use(express.json());

app.use("/friends", function auth(request, response, next) {
  if (request.session["authorization"]) {
    const token = request.session["authorization"]['accessToken'];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        request["user"] = user;
        next();
      }
      else {
        return response.status(403).json({ message: "User not authenticated" })
      }
    });
  } else {
    return response.status(403).json({ message: "User not logged in" })
  }
});

app.post("/login", (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    request.session["authorization"] = {
      accessToken, username
    }
    return response.status(200).send("User successfully logged in");
  } else {
    return response.status(208).json({ message: "Invalid Login. Check username and password" });
  }
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
