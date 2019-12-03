// implement your API here

//imports
const express = require("express"); // express
const db = require("./data/db"); // db import from db directory.

const server = express();
server.use(cors());

server.use(express.json()); // <<< needed to parse json from the body

// SERVER CALLS START HERE...

server.get("/", (req, res) => {
  //test for server running...
  res.send({ msg: "server is running" });
});

server.get("/api/users", (req, res) => {
  //get all users from database...
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console
        .log("Sorry, users not found", err)
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

server.get("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  // const id = req.params.id;

  db.findById(id)
    .then(searchedUser => {
      if (searchedUser) {
        res.status(200).json({ searchedUser });
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(`User with ID: ${id} not found`, err);
      res.status(500).json([]);
    });
});

server.post("/api/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name && newUser.bio) {
    db.insert(newUser)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        console.log("error while posting newUser", err);
        res.status(500).json({
          error: "There was an error while saving the user to the database"
        });
      });
  } else {
    console.log("Please provide name and bio for the user.");
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;

  if (updatedUser.name && updatedUser.bio) {
    db.update(id, updatedUser)
      .then(userupdate => {
        if (userupdate) {
          res.status(201).json({ userupdate });
        } else {
          res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: "The user information could not be modified." });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(deletedUser => {
      if (deletedUser) {
        res.status(201).json({ deletedUser });
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The user could not be removed" });
    });
});

//PORT ASSIGNMENT
const port = 4000;

// RUN THE SERVER TO LISTEN FOR REQUESTS ON THIS SPECIFIED PORT...
server.listen(port, () => console.log(`Server is running on port ${port}`));
