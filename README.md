# CS5220 Semester Project
### Semester Project: Meal Planner Application

In this semester, you will develop and build a Meal Planner Application where users can create meal plans by searching and adding meals from the Spoonacular API. The application will be developed using Node.js with Express.js, MongoDB with Mongoose.js and Svelte.js. The development will take place over three homework assignments, progressively building the full application functionality.

----

**Homework 1: Building a Node.js RESTful Server Application**
* Uses mock data for **Users** and **Meal Plans**.
* Build a Node.js Server Application.
* Implement RESTful routes to manage user and meal plan resources.
* Interact with the Spoonacular API to search for meals based on user preferences.

  
**Homework 2: Adding JWT to the Node.js Server Application and Connecting to MongoDB**
* Builds on top of Homework 1.
* Update Node.js Server Application to use Layer Architecture design pattern.
* Implement Mongoose schemas for **Users** and **Meal Plans** and store data in MongoDB
* Use JWT (JSON Web Tokens) for user authentication and authorization.

  
**Homework 3: Creating a Svelte.js Frontend for the Node.js Server Application**
* Builds on top of Homework 2.
* Create a user-friendly interface using **Svelte.js**.
* Connect Node.js Server application to front-end.
* Supports all Meal Plan Application functionality via browser.

----

### Application Data Models

You will work with two main data models: **Users** and **Meal Plans**. The application will also use data from the Spoonacular API for meals but will not store meal data directly in the Mongo database.

**Users**

**Fields:**

* `_id` (unique identifier):
  
  A unique identifier for each user.

* `username` (string):

   The username of the user. It must be unique and is stored in as case-insensitive.

* `password` (string):

  The password for the user account.

* `preferences` (array of strings):
  
  An array containing the user's dietary preferences based on Spoonacular API (ex: Keto, Vegan, Gluten-Free).

 

**Meal Plans**

**Fields:**

* `_id` (unique identifier):
  
  A unique identifier for each meal plan.

* `user_id` (reference to user _id):
  
  The id of the user who created the meal plan.

* `week` (number):

  Represents the week of the meal plan, starting from week 1 when the meal plan begins. This is not tied to a specific date but represents the sequence of weeks.

* `meals` (array of objects):
  
  An array containing meal information selected from the Spoonacular API. Each meal plan can include a maximum of **3 meals**.

  - `meal_id` (number):
    
    The unique id of the meal from the Spoonacular API.
  - `name` (string):
    
    The name of the meal from the API.
  - `diets` (array of string):
    
    The dietary array of the meal from the API.
  - `image` (string):
    
    A URL to the meal's image from the API.

----

**Interaction with Spoonacular API** - [Spoonacular API Documentation](https://spoonacular.com/food-api)

The Spoonacular API is used to search for recipes (meals) by keyword and taking into account the user's dietary preferences (ex: keto, vegan, gluten-free, etc). Users can select meals from the search results to add to their weekly Meal Plans with a limit of 3 meals per week.


 

**Recipe (Meal) Search**

Searching for recipes by keywords and filters based on dietary preferences.
* https://spoonacular.com/food-api/docs#Search-Recipes-Complex
  
**Diet Preferences**

List of supported diet preferences.
* https://spoonacular.com/food-api/docs#Diets
