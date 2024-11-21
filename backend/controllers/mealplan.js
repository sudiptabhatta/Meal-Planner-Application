import Mealplan from '../models/mealplan.js';

const MAX_MEALS = 3;

const addMealplan = async (req, res) => {
    try {
        const { user_id } = req.verified; 
        const { week, mealId, name, diets, image } = req.body;

        // verify there is a requesting user (user_id)
         if (!user_id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        // Check if meal plan exists by user id and week
        const existingMealplan = await Mealplan.findOne({ user_id, week });

        // add a meal to the existing plan if mealplan exists
        if(existingMealplan) {

            // check if the meal plan already has 3 meals
            if(existingMealplan.meals.length >= MAX_MEALS) {
                return res.status(400).json({ error: 'Meal plan already contains 3 meals' });
            }

            // Add the new meal to the existing meal plan
            existingMealplan.meals.push({ mealId, name, diets, image });

            await existingMealplan.save();

            res.json(existingMealplan);
        } else {
            // create a new meal plan with the meal
            const newMealplan = new Mealplan({
                user_id: user_id,
                week: week,
                meals: [{ mealId, name, diets, image }]
            });

            await newMealplan.save();

            res.json(newMealplan);
        }

    } catch(error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deleteMealplan = async (req, res) => {
    try {
        const { user_id } = req.verified; 
        const { id } = req.params;

        // verify there is a requesting user (user_id)
        if (!user_id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        // Find the meal plan by user_id and _id
        const mealplan = await Mealplan.findOne({ user_id, _id: id });

        // responds with an error if meal plan is not found.
        if(!mealplan) {
            return res.status(404).json({ error: 'Meal plan not found.' });
        }
        
        // delete the mealplan
        await mealplan.deleteOne();

        res.json({ _id: id, delete: 'success' });
    } catch(error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { addMealplan, deleteMealplan };