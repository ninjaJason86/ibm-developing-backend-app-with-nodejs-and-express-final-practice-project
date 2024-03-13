const express = require('express');

const router = express.Router();

let friends = {
  "johnsmith@gmail.com": { "firstName": "John", "lastName": "Doe", "DOB": "22-12-1990" },
  "annasmith@gmail.com": { "firstName": "Anna", "lastName": "smith", "DOB": "02-07-1983" },
  "peterjones@gmail.com": { "firstName": "Peter", "lastName": "Jones", "DOB": "21-03-1989" }
};


// GET request: Retrieve all friends
router.get("/", (request, response) => {
  response.status(200).send(JSON.stringify(friends, null, 4));
});

// GET by specific ID request: Retrieve a single friend with email ID
router.get("/:email", (request, response) => {
  const { email } = request.params;

  const user = friends[email];

  if (!user) {
    return response.status(404).send("User not found");
  }

  return response.status(200).send(user);
});


// POST request: Add a new friend
router.post("/", (request, response) => {
  // Update the code here
  response.send("Yet to be implemented")//This line is to be replaced with actual return value
});


// PUT request: Update the details of a friend with email id
router.put("/:email", (request, response) => {
  // Update the code here
  response.send("Yet to be implemented")//This line is to be replaced with actual return value
});


// DELETE request: Delete a friend by email id
router.delete("/:email", (request, response) => {
  // Update the code here
  response.send("Yet to be implemented")//This line is to be replaced with actual return value
});

module.exports = router;
