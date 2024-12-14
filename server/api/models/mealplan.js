import mongoose from 'mongoose';

const MealplanSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    week: {
        type: Number,
        min: 1, // Ensure the week is at least 1
        required: true
    },
    meals: [{
        mealId: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        diets: {
            type: [String],
            required: true
        },
        image: {
            type: String,
            required: true
        }
    }]

});

const Mealplan = mongoose.model('Mealplan', MealplanSchema);

export default Mealplan;