<script>
    import axios from "axios";

    let {meals = [], searchResults = false} = $props();

    let week = $state({});

    const addToMealplan = async (meal) => {
      try {
        // get guest info from local storage
        const guest = JSON.parse(localStorage.getItem('guest'));

        const _ = await axios.post(`http://localhost:8080/mealplans`, 
        {
          week: week[meal.id],
          mealId: meal.id,
          name: meal.title,
          diets: meal.diets,
          image: meal.image
        }, 
        {
          headers: {
            Authorization: guest.header_token
          }
        });

        window.dispatchEvent(new CustomEvent('errorMessage', {
          detail: ''
        }));

      } catch(error) {
          let errorMessage = '';
          if(error.response && error.response.data) {
            errorMessage = error.response.data.error;
          } else {
            errorMessage = error.message || 'An unexpected error occurred.';
          } 
          
          window.dispatchEvent(new CustomEvent('errorMessage', {
              detail: errorMessage
          }));
      }
    }
</script>

{#each meals as meal}
    <div class="meal-card">
        <img class="meal-image" src={meal.image} alt={meal.name || meal.title} />
        <div class="meal-info">
            <p class="meal-name">{meal.name || meal.title}</p>
             <p>DIETS:</p>
             <div class="diet-list">
              {#if meal.diets.length === 0}
                <p>No diets found.</p>
              {:else}
                {#each meal.diets as diet}
                  <div class="meal-diet">{diet}</div>
                {/each}
              {/if}
             </div>
             <div class="week-dropdown">
              {#if searchResults }
                <label for="weekno">Week: </label>
                <input type="number" name="planweek" id="planweek" min="1" max="4" bind:value={week[meal.id]}>
                <button class="btn btn-secondary btn-sm" onclick={() => addToMealplan(meal)}>Add to Mealplan</button>
              {/if}
             </div>
        </div>
    </div>
{/each}

<style>
    .meal-card {
      background-color: #1d2531;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s ease-in-out;
      text-align: center;
    }
  
    .meal-card:hover {
      transform: scale(1.05);
    }
  
    .meal-image {
      width: 100%;
      height: 200px;
      border-radius: 8px;
      object-fit: cover;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  
    .meal-info {
      text-align: center;
    }
  
    .meal-name {
      font-family: "Montserrat", sans-serif;
      font-size: 1.25rem;
      margin: 0.5rem 0;
      font-weight: bold;
    }

    .diet-list {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }
  
    .meal-diet {
      padding: 0.3rem;
      background-color: #1d2531;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      color: #a8b9b7;
      font-size: 1rem;
    }

    .week-dropdown {
      margin-top: 20px; 
    }

    .week-dropdown input {
      background-color: #0c111a;
      border-color: #0c111a;
      color: #fff;
    }

    .week-dropdown button {
      border-radius: 5px;
      border: none;
      margin-bottom: 3px;
    }
  </style>