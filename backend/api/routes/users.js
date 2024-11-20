import express from "express";

import { MealPlans, Users } from "../../db/mocks.js";
import { validatePreferences } from "../util/diet.js";

const router = express.Router();


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

    // optional - validate dietary preferences
    const invalidPreferences = validatePreferences(preferences);
    if (invalidPreferences.length) {
        return res.status(400).json({ error: `Invalid dietary preferences: ${invalidPreferences}` });
    }

    const user = Users.add({
        username: username.toLowerCase(),
        password,
        preferences,
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

        res.json({ _id: user._id, username: user.username, preferences: user.preferences, mealplans });
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
        
        // optional - validate dietary preferences
        const invalidPreferences = validatePreferences(preferences);
        if (invalidPreferences.length) {
            return res.status(400).json({ error: `Invalid dietary preferences: ${invalidPreferences}` });
        }
 
        const updatedUser = Users.update(user._id, preferences);
        res.status(200).json({_id: updatedUser._id, username: updatedUser.username, preferences: updatedUser.preferences  });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;
