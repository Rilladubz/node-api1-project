// implement your API here

//imports
const express = require("express"); // express
const db = require("./data/db"); // db import from db directory.

const server = express();

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

// server.get("/api/users/:id", (req, res) => {
//   const id = parseInt(req.params.id);

// //   if (id) {
//     db.findById(id)
//     if(searchedUser.id){
//         .then(searchedUser => {
//             res.status(200).json({ searchedUser })
//           })
//           .catch(err => {
//             console.log(`User with ID: ${id} not found`, err);
//             res.status(500).json([]);
//           })
//     }

// //   } else if (id === null) {
//     res
//       .status(404)
//       .json({ message: "The user with the specified ID does not exist." });
// //   }
// });

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
    // respond with HTTP status code 400 (Bad Request).
    // return the following JSON response: { errorMessage:
    //"Please provide name and bio for the user." }.
    console.log("Please provide name and bio for the user.");
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
    //   .end();
  }
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  db.update(id, updatedUser)
    .then(userupdate => {
      res.status(201).json({ userupdate });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: `${err}` });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(deletedUser => {
      res.status(201).json({ deletedUser });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: `${err}` });
    });
});

//PORT ASSIGNMENT
const port = 4000;

// RUN THE SERVER TO LISTEN FOR REQUESTS ON THIS SPECIFIED PORT...
server.listen(port, () => console.log(`Server is running on port ${port}`));
