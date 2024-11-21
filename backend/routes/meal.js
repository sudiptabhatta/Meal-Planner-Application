import express from 'express';

import { verifyUser } from '../middleware/authorization.js';
import { searchMeal } from '../controllers/meal.js';

const router = express.Router();

// GET /meals/search??meal=<name>&diets=<preferences>
router.get('/search', verifyUser, searchMeal);

export default router;
