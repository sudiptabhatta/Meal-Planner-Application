import { compare, hash, signToken } from "../utils/auth.js";

import { validatePreferences } from "../utils/diet.js";

import User from "../models/user.js";

const registerUser = async (req, res) => {
    try {
      const { username, password, preferences } = req.body;
  
      // ensure both username and password are provided
      if (!username || !password) {
        return res.status(422).json({ error: "Must provide both username and password" });
      }
  
      // optional - validate dietary preferences
      const invalidPreferences = validatePreferences(preferences);
      if (invalidPreferences.length) {
          return res.status(400).json({ error: `Invalid dietary preferences: ${invalidPreferences}` });
      }
  
      const hashedPassword = await hash(password);
  
      // add user to the User collection
      const userEntry = await User.create({
          username,
          password: hashedPassword,
          preferences,
      });
  
      res.json({ _id: userEntry._id, username: userEntry.username, preferences: userEntry.preferences });
  
    } catch (error) {
          res.status(500).json({ error: error.toString() });
    }
};

const loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // ensure both username and password are provided
      if (!username || !password) {
          return res.status(422).json({ error: "Must provide both username and password" });
      }
  
      // find user by username and verify password
      const userEntry = await User.findOne({ username: username.toLowerCase() });
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
};

const getUserById = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const { id } = req.params; 
    
        // ensure the user id in header matches id provided in URL
        if (id !== user_id) {
          return res.status(403).json({ error: "Forbidden: You are not this user." });
        }

        const userWithMealPlan = await User.findById(id).select("-password").populate('mealplans');
    
        if (!userWithMealPlan) {
          return res.status(404).json({ error: "User not found" });
        }

        res.json(userWithMealPlan);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const updateDietPreference = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const { id } = req.params;

        const { preferences } = req.body;

        // ensure the user id in header matches id provided in URL
        if (user_id !== id) {
            return res.status(403).json({ error: "Forbidden: You are not this user." });
        }

        // use findByIdAndUpdate to find a user by its _id and update preferences
        const updatedUser = await User.findByIdAndUpdate(id, { preferences }, { new: true, select: '-password' });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }
        
        // optional - validate dietary preferences
        const invalidPreferences = validatePreferences(preferences);
        if (invalidPreferences.length) {
            return res.status(400).json({ error: `Invalid dietary preferences: ${invalidPreferences}` });
        }
 
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

export { registerUser, loginUser, getUserById, updateDietPreference };