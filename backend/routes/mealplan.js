import express from 'express';

import { verifyUser } from '../middleware/authorization.js';

import { addMealplan, deleteMealplan } from '../controllers/mealplan.js';

const router = express.Router();

router.use(verifyUser);

// POST /mealplans
router.post('/', addMealplan);


// DELETE /mealplans/:id
router.delete('/:id', deleteMealplan);

export default router;
