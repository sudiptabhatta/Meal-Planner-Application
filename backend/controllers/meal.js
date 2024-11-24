import axios from 'axios';

import User from "../models/user.js";

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_API_URL = process.env.SPOONACULAR_API_URL;

const searchMeal = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const { meal, diets } = req.query;
        
        // find the user by user_id in header
        const user = await User.findById(user_id);

        let final_diets = user.preferences;

        // check if any diet is given in query parameter
        if(diets) {
            // split the input diets string
            const splitted_diets = diets.split(',');

            // filter out diets which is not included in the user's preferences
            const filtered = splitted_diets.filter((diet) => {
                return !user.preferences.includes(diet);
            });

            // combine both user's prefereces and filtered diets
            final_diets = [...final_diets, ...filtered];
        }

        // pass the meal name and comma separated diets for searching using the spoonacular api
        const meals = await axios.get(`${SPOONACULAR_API_URL}/recipes/complexSearch/`, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                query: meal,
                diets: final_diets.toString(),
                addRecipeInformation: true // boolean flag to return diets array
            }
        });

        res.json(meals.data.results);

    } catch(error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { searchMeal };