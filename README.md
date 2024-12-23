### Project Structure

* Includes a `package.json`:

* Includes a `.env` file:
 - Store Spoonacular API key

* Includes an `app.js` file:
  - Entry point of the app. Configure Express server and routes.

* Includes an `api/` directory:
  - Inside there is a `routes/` folder containing:
      - `users.js`
      - `mealplans.js`
      - `meals.js`
      - 
* Includes a `db/` directory:
  - Inside there are:
    - `mocks.js`: Simulating the database with mock data for Users and MealPlans.
    - `connection.js` (future connection to a mongo database)

  
### Mock Data Setup for Meal Planner App

**Functionality**
* Use the `mock.js` file which includes methods needed for managing Users and MealPlans which allows for simulating database functionality.

**Data:**
* DO NOT remove `_id: 1` from User or Meal Plans.  Instead add at least one user object with required fields and add at least one meal plan object with the required fields. 

### API Endpoints
Design and implement the following endpoints in your Node.js Application.  These endpoints must follow REST principles, including proper use of HTTP methods, resource naming, status codes and appropriate URL structures for path and query parameters.

**Users**
* Register a new user account
  - Requires a unique username and password
  - Optionally allows specifying dietary preferences
* Login a user 
  - Validates that the username and password match
* Retrieve user information by id
  - Returns user info (excluding password) and includes all associated meal plans for that user
* Update user preferences by id
  - Allows user to update only their dietary preferences
 

**Meal Plans**

* Add a new meal plan and/or add a meal to existing plan for a user
  - Allows user to create a new meal plan by specifying the week and meal object
  - Allows user to add a meal to plan using search results from the Spoonacular API (meal object) and specifying the week
  - Each meal plan can include a maximum of 3 meals per week
* Delete a specific meal plan by id
  - Removes a meal plan by using id
 

**Meals (Spoonacular API Integration)**

* Search for meals
  - Uses the Spoonacular API to find meals based on a search term and the user's preferences
