import express from "express";

import { verifyUser } from "../middleware/authorization.js";
import { getUserById, loginUser, registerUser, updateDietPreference } from "../controllers/user.js";

const router = express.Router();

// POST /users/register
router.post("/register", registerUser);


// POST /users/login
router.post("/login", loginUser);


// GET /users/:id
router.get("/:id", verifyUser, getUserById);


// PUT /users/:id
router.put("/:id", verifyUser, updateDietPreference);

export default router;
