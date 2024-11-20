import express from "express";

import { MealPlans, Users } from "../../db/mocks.js";
import { validatePreferences } from "../util/diet.js";
import { compare, hash, signToken } from "../util/auth.js";
import { verifyUser } from "../middleware/authorization.js";

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

    const hashedPassword = await hash(password);

    const userEntry = Users.add({
        username: username.toLowerCase(),
        password: hashedPassword,
        preferences,
    });

    res.json({ _id: userEntry._id, username: userEntry.username, preferences: userEntry.preferences });

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
    const userEntry = Users.find("username", username.toLowerCase());
    if (!userEntry) {
        return res.status(401).json({ error: "Invalid username." });
    }

    const passwordEqual = await compare(password, userEntry.password);
    if (!passwordEqual) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    const token = signToken(userEntry.username, userEntry._id);

    res.json({ _id: userEntry._id, username: userEntry.username, preferences: userEntry.preferences, tokenType: 'Bearer', access_token: token });
  } catch (error) {
        res.status(500).json({ error: error.toString() });
  }
});


// GET /users/:id
router.get("/:id", verifyUser, async (req, res) => {
    try {
        const { user_id } = req.verified;
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
router.put("/:id", verifyUser, async (req, res) => {
    try {
        const { user_id } = req.verified;
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
