import express from 'express';

import { MealPlans, Users } from '../../db/mocks.js';
import { verifyUser } from '../middleware/authorization.js';

const router = express.Router();

router.use(verifyUser);

const MAX_MEALS = 3;

// POST /mealplans
router.post('/', async (req, res) => {
    try {
        const { user_id } = req.verified; 
        const { week, mealId, name, diets, image } = req.body;

        // verify there is a requesting user (user_id)
         if (!user_id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        // ensure user exists
        const user = Users.find('_id', user_id);
        if(!user) {
            return res.status(404).json({ error: "User not found." }); 
        }

        // Check if meal plan exists by user id and week
        const mealplan = MealPlans.find(user_id, week);

        // add a meal to the existing plan if mealplan exists
        if(mealplan) {

            // check if the meal plan already has 3 meals
            if(mealplan.meals.length >= MAX_MEALS) {
                return res.status(400).json({ error: 'Meal plan already contains 3 meals' });
            }

            const addMealToMealplan = MealPlans.add({ user_id, week, meal: { mealId, name, diets, image } }, mealplan._id);
            res.json(addMealToMealplan);
        } else {
            // create a new meal plan with the meal
            const addNewMealplanWithMeal = MealPlans.add({
                user_id,
                week,
                meal: { mealId, name, diets, image }
            });

            res.json(addNewMealplanWithMeal);
        }

    } catch(error) {
        res.status(500).json({ error: error.toString() });
    }
});


// DELETE /mealplans/:id
router.delete('/:id', async (req, res) => {
    try {
        const { user_id } = req.verified; 
        const id = Number(req.params.id);

        // verify there is a requesting user (user_id)
        if (!user_id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        // find all meal plans of a user
        const mealplans = MealPlans.findAll(user_id);

        // find the meal plan provided in the URL by id from all created mealplans
        const mealplan = mealplans.find((mealplan) => {
            return mealplan._id === id; 
        });

        // responds with an error if meal plan is not found.
        if(!mealplan) {
            return res.status(404).json({ error: 'Meal plan not found.' });
        }
        
        // delete the mealplan by id 
        const mealplanId = MealPlans.delete(mealplan._id);

        res.json({ _id: mealplanId, delete: 'success' });
    } catch(error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;
