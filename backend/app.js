import express from "express";
import "dotenv/config";

import mockDB from "./db/connection.js";

import users from "./api/routes/users.js";

// Initialize the Express app
const app = express();

const PORT = 8080;

app.use(express.json());

// handle all requests to /users route with users router
app.use("/users", users);

app.listen(PORT, async () => {
  // simulate connectioning to a database before starting the server
  await mockDB.connect();

  // log the server's URL and port to the console
  console.log(`Server in running on http://localhost:${PORT}`);
});
