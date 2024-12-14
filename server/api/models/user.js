import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true // ensure case-insensitive by storing in lowercase 
        },
        password: {
            type: String,
            required: true
        },
        preferences: {
            type: [String], // Array of strings for dietary preferences
            default: [] // Default to an empty array if no preferences are provided
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


// virtual field 'mealplans' on the UserSchema
// this will create a relationship between the User and Mealplan models
// it uses the user's '_id' as the local field and the 'user_id' in the Mealplan model as the foreign field
UserSchema.virtual('mealplans', {
    ref: 'Mealplan',
    localField: '_id',
    foreignField: 'user_id'
});

const User = mongoose.model('User', UserSchema);

export default User;