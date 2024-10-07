import express from "express";

import { MealPlans, Users } from "../../db/mocks.js";

const router = express.Router();

const DIETS = [
  "gluten free",
  "ketogenic",
  "vegetarian",
  "lacto-vegetarian",
  "ovo-vegetarian",
  "vegan",
  "pescetarian",
  "paleo",
  "primal",
  "low fodmap",
  "whole30",
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

    let dietary_preferences = [];

    // check if user provides dietary preferences and the preferences corresponds to the ones on spoonacular
    if (preferences && Array.isArray(preferences)) {
        const lowercase_preferences = preferences.map(v => v.toLowerCase());
      // filters out the input dietary preferences array comparing with the diets on spoonacular api
        dietary_preferences = lowercase_preferences.filter((diet) => {
            return DIETS.includes(diet);
        });
    }

    const user = Users.add({
        username: username.toLowerCase(),
        password,
        preferences: dietary_preferences,
    });

    res.json({ _id: user._id, username: user.username, preferences: user.preferences });

  } catch (error) {
        res.status(500).json({ error: error.toString() });
  }
});


// POST /users/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // ensure both username and password are provided
    if (!username || !password) {
        return res.status(422).json({ error: "Must provide both username and password" });
    }

    // find user by username and verify password
    const user = Users.find("username", username.toLowerCase());
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid username or password." });
    }

    res.json({ _id: user._id, username: user.username, preferences: user.preferences });
  } catch (error) {
        res.status(500).json({ error: error.toString() });
  }
});


// GET /users/:id
router.get("/:id", async (req, res) => {
    try {
        const user_id = Number(req.headers.user_id);
        const id = Number(req.params.id);

        // ensure the user id in header matches id provided in URL
        if (user_id !== id) {
            return res.status(403).json({ error: "Forbidden: You are not this user." });
        }

        // ensure user exists
        const user = Users.find("_id", id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // find mealplans of the user by id
        const mealplans = MealPlans.findAll(user._id);

        res.json({ _id: user._id, username: user.username, preferences: user.preferences, mealplans: mealplans });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});


// PUT /users/:id
router.put("/:id", async (req, res) => {
    try {
        const user_id = Number(req.headers.user_id);
        const id = Number(req.params.id);

        const { preferences } = req.body;

        // ensure the user id in header matches id provided in URL
        if (user_id !== id) {
            return res.status(403).json({ error: "Forbidden: You are not this user." });
        }

        // ensure user exists
        const user = Users.find("_id", id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        
        // check the data type for the input dietary preferences
        if(Array.isArray(preferences)) {
            const lowercase_preferences = preferences.map(v => v.toLowerCase());
            const dietary_preferences = lowercase_preferences.filter((diet) => {
                return DIETS.includes(diet);
            });

            const updatedUser = Users.update(user._id, dietary_preferences);

            res.json({ _id: updatedUser._id, username: updatedUser.username, preferences: updatedUser.preferences });
        } else {
            res.status(422).json({ error: "Dietary preferences is not an array." });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;
