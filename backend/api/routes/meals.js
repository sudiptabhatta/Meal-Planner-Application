import express from 'express';
import axios from 'axios';

import { Users } from '../../db/mocks.js';

const router = express.Router();

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_API_URL = process.env.SPOONACULAR_API_URL;

// GET /meals/search??meal=<name>&diets=<preferences>
router.get('/search', async (req, res) => {
    try {
        const user_id = Number(req.headers.user_id);
        const { meal, diets } = req.query;

        // verify there is a requesting user (user_id)
        if (!user_id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }
        
        // find the user by user_id in header
        const user = Users.find('_id', user_id);

        if(!user){
            return res.status(404).json({ error: "User not found." });
        }

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
});

export default router;
