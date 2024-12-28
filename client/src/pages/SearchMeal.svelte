<script>
  import axios from "axios";
  import MealCard from "../components/MealCard.svelte";

  let meal = $state(null);
  let diets = $state(null);

  let meals = $state([]);

  const searchMeal = async () => {
    try {
      // get guest info from local storage
      const guest = JSON.parse(localStorage.getItem("guest"));

      // Call the API with meal and diets
      const response = await axios.get(`http://localhost:8080/meals/search`, {
        params: {
          meal: meal,
          diets: diets, // Send diets as a comma-separated string
        },
        headers: {
          Authorization: guest.header_token,
        },
      });

      meals = response.data;
    } catch (error) {
      console.log(error);
    }
  };
</script>

<div class="container">
  <div class="search-container">
    <div class="inputs-row">
      <input type="text" class="form-control meal-input" placeholder="Enter meal name..." bind:value={meal} />

      <input type="text" class="form-control diets-input" placeholder="Enter diets (comma-separated)..." bind:value={diets} />
    </div>
    <button class="btn btn-primary search-button" onclick={searchMeal}>Search</button>
  </div>

  <div class="meal-list">
    <h5>Searched Meals</h5>
    <div class="meal-card-grid">
      {#if meals.length == 0}
          <p>No meals found. Try searching again.</p>
      {:else}
        <MealCard {meals} />
      {/if}
    </div>
  </div>
</div>

<style>
  .search-container {
    position: relative;
    top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 40px rgba(51, 51, 51, 0.1);
    padding: 20px;
    border-radius: 10px;
  }

  .inputs-row {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    width: 100%;
    justify-content: center;
  }

  .meal-input,
  .diets-input {
    height: 50px;
    padding: 10px;
    border: 1px solid #0c111a;
    border-radius: 5px;
    background-color: #1d2531;
    color: #a0a0a0;
  }

  ::placeholder {
    color: #a0a0a0;
  }

  .meal-input:focus,
  .diets-input:focus {
    outline: none;
    box-shadow: 0 0 0.3125rem #394961;
  }

  .search-button {
    width: 150px;
    height: 50px;
    background: blue;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 5px;
  }

  .search-button:hover {
    background: darkblue;
    cursor: pointer;
  }

  .search-button:active {
    transform: scale(0.98);
  }

  .meal-card-grid {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .meal-list {
    position: relative;
    top: 50px;
    padding: 20px;
  }

  .meal-list h5 {
    text-align: center;
    font-size: 1.5rem;
  }
</style>
