import express from "express";
import cors from 'cors';
import "dotenv/config";

import mongodb from "./api/db/connection.js";
import users from "./api/routes/user.js";
import meals from './api/routes/meal.js';
import mealplans from './api/routes/mealplan.js';

// Initialize the Express app
const app = express();

const PORT = 8080;

const options = { exposedHeader: ['Authorization'] };
app.use(cors(options));

app.use(express.json());

// handle all requests to /users route with users router
app.use("/users", users);

// handle all requests to /meals route with meals router
app.use("/meals", meals);

// handle all requests to mealplans/ route with mealplans router
app.use("/mealplans", mealplans);

app.listen(PORT, async () => {
  // simulate connectioning to a database before starting the server
  await mongodb.connect();

  // log the server's URL and port to the console
  console.log(`Server in running on http://localhost:${PORT}`);
});
