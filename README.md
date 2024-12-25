### Part 1 - Login/Register with Svelte

**Login and Register Form**

Create a `LoginRegisterForm.svelte` component that allows users to log in or register.
  - Add a toggle option to switch between login and register modes.
  - Show clear error messages for invalid inputs or failed authentication.
    
**Register Functionality**
  - The user must provide required fields for `username` and `password`.
  - The `preferences` field is optional for the user.
  - The form should interact with the MealPlan Server to register the user .
  - After successful registration, show the user to the login form.
    
**Login Functionality**
  - Authenticate the user using the required `username` and `password` via the MealPlan Server.
  - After successful login, navigate the user to the `Profile.svelte` page.


    
### Part 2 - Profile Page and MealCard Component

**Profile Component**

Create a `Profile.svelte` component that dynamically gets the user by id along with their associated mealplans from the MealApp Server.
  - Display the `username` and `preferences`.
  - For each mealplan:
    - Display the `week`
    - Pass the `meals` (array of objects) as `props` to the `MealCard` Component.
      
**MealCard Component**

Create a `MealCard.svelte` to display the meals in a mealplan for the user.
  - Displays the data for each meal, including:
    - `name`
    - `diets`
    - `image`
 

    
### Part 3 - Server Updates and CORS Support

* CORS Support
  
  Update the server to enable CORS to support requests from the Svelte frontend.

* Previous Requirements
  
  Ensure the Mealplan App meets the requirements of Homework 1 and Homework 2:
  - Correct middleware, models, controllers and routes.
  - Correct any previous issues to ensure a fully functional API.
    
* Folder Structure

  Organize the MealPlan App files like the following:
```
/Meal-Planner-Application
├── /server
│   ├── /api
│   │   ├── /routes
│   │   │   ├── user.js
│   │   │   ├── mealplan.js
│   │   │   └── meal.js
│   │   ├── /controllers
│   │   │   ├── user.js
│   │   │   ├── mealplan.js
│   │   │   └── meal.js
│   │   ├── /models
│   │   │   ├── User.js
│   │   │   └── Mealplan.js
│   │   ├── /middleware
│   │   │   └── authorization.js
│   │   ├── /utils
│   │   │   └── auth.js
│   │   ├── /db
│   │   │   └── connection.js
│   └── app.js
│   └── .env

├── /client
│   ├── /src
│   │   ├── App.svelte
│   │   ├── main.js
│   │   ├── index.html
│   │   ├── /pages
│   │   │   ├── LoginRegisterForm.svelte
│   │   │   └── Profile.svelte
│   │   ├── /components
│   │   │   └── MealCard.svelte
```
