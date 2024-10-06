import express from "express";

import { Users } from "../../db/mocks.js";

const router = express.Router();

const DIETS = [
  "Gluten Free",
  "Ketogenic",
  "Vegetarian",
  "Lacto-Vegetarian",
  "Ovo-Vegetarian",
  "Vegan",
  "Pescetarian",
  "Paleo",
  "Primal",
  "Low FODMAP",
  "Whole30",
];

// POST /users/register
router.post("/register", async (req, res) => {
  try {
    const { username, password, preferences } = req.body;

    // ensure both username and password are provided
    if (!username || !password) {
      return res.status(422).json({ error: "Must provide both username and password" });
    }

    // check if username is already registered
    const isRegistered = Users.find("username", username.toLowerCase());
    if (isRegistered) {
      return res.status(409).json({ error: "Username is already registered." });
    }

    // check if user provides dietary preferences and the preferences corresponds to the ones on spoonacular
    if (preferences && Array.isArray(preferences)) {
        // filters out the input dietary preferences array comparing with the diets on spoonacular api 
        const dietary_preferences = preferences.filter((diet) => {
            return DIETS.includes(diet)
        });

        const user = Users.add({
            username: username.toLowerCase(),
            password,
            preferences: dietary_preferences 
        });

        res.json({ _id: user._id, username: user.username, preferences: user.preferences });
    } else {
        const user = Users.add({
            username: username.toLowerCase(),
            password,
            preferences: []
        });

        res.json({ _id: user._id, username: user.username, preferences: user.preferences });
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body; 

        // ensure both username and password are provided
        if (!username || !password) {
            return res.status(422).json({ error: "Must provide both username and password" });
        }

        // find user by username and verify password
        const user = Users.find('username', username.toLowerCase());
        if(!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        res.json({ _id: user._id, username: user.username, preferences: user.preferences });
    } catch(error) {
        res.status(500).json({ error: error.toString() });
    }
})

export default router;
