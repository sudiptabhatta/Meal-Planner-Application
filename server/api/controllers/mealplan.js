import Mealplan from '../models/mealplan.js';

const MAX_MEALS = 3;

const addMealplan = async (req, res) => {
    try {
        const { user_id } = req.verified; 
        const { week, mealId, name, diets, image } = req.body;

        // Check if meal plan exists by user id and week
        let mealplan = await Mealplan.findOne({ user_id, week });

        // add a meal to the existing plan if mealplan exists
        if(mealplan) {

            // check if the meal plan already has 3 meals
            if(mealplan.meals.length >= MAX_MEALS) {
                return res.status(400).json({ error: 'Meal plan already contains 3 meals' });
            }

            // Add the new meal to the existing meal plan
            mealplan.meals.push({ mealId, name, diets, image });

        } else {
            // create a new meal plan with the meal
            mealplan = new Mealplan({
                user_id: user_id,
                week: week,
                meals: [{ mealId, name, diets, image }]
            });
        }

        await mealplan.save();

        res.json(mealplan);

    } catch(error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deleteMealplan = async (req, res) => {
    try {
        const { user_id } = req.verified; 
        const { id } = req.params;

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