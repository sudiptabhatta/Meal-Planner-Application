const DIETS = [
  "gluten free",
  "ketogenic",
  "vegetarian",
  "lacto-vegetarian",
  "ovo-vegetarian",
  "vegan",
  "pescetarian",
  "paleo",
  "primal",
  "low fodmap",
  "whole30",
];

const validatePreferences = (preferences) => {
    // filters out the input dietary preferences array comparing with the diets on spoonacular api
    return preferences.filter((preference) => !DIETS.includes(preference.toLowerCase()));
};

export { validatePreferences };
