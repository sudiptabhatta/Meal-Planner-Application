<script>
    export let meals = [];
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
  </style>