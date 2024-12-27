<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import MealCard from "../components/MealCard.svelte";
  import UpdateDietPreferences from "./UpdateDietPreferences.svelte"

   // props: id passed from route parameter
   let { id } = $props();

   // state to hold the fetched profile data
   let profile = $state(null);

   onMount(async () => {
        try {
            // get guest info from local storage
            const guest = JSON.parse(localStorage.getItem('guest'));

            // get profile with mealplan from the server with access token
            const response = await axios.get(`http://localhost:8080/users/${guest._id}`, {
                headers: {
                    Authorization: guest.header_token // attach token for authorization
                }
            });

            // assign profile to the response
            profile = response.data;
        } catch(error) {
            console.log(error);
        }
   });

   window.addEventListener("preferencesUpdated", (event) => {
      if (profile && event.detail.preferences) {
        profile.preferences = event.detail.preferences; // Update preferences with event details
      }
   });
</script>


<div class="profile-container">
    {#if !profile}
      <div>Loading User Profile...</div>
    {:else}
      <!-- Header Section -->
      <div class="header">
        <h1>Welcome, {profile.username}</h1>
        <br />
        <div class="update-diet-pref">
          <h5>DIET PREFERENCES:</h5> 
          <!-- Button trigger modal -->
          <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#updateDietPrefModal">Update</button>
        </div>
      </div>
  
      <!-- Diet Preferences Section -->
      <div class="diet-preferences">
        {#if profile.preferences.length === 0}
          <p>No Diet preference found.</p>
        {:else}
          {#each profile.preferences as preference}
            <div class="preference">{preference}</div>
          {/each}
        {/if}
      </div>
  
      <hr />
  
      <!-- Meal Plan Section -->
      <h3>Meal Plans</h3>
      <div class="mealplan-list">
        {#if profile.mealplans.length === 0}
          <p>No mealplan found.</p>
        {:else}
          {#each profile.mealplans as mealplan}
            <div class="week-meals">
              <h5>Week {mealplan.week}</h5>
              <div class="meals-grid">
                <MealCard meals={mealplan.meals} />
              </div>
            </div>
          {/each}
        {/if}
      </div>

      <UpdateDietPreferences currentPreferences={profile.preferences || []}/>
    {/if}
</div>

<style>

    /* Header Section */
    .header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
  
    /* Profile Container */
    .profile-container {
      margin: 2rem auto;
      padding: 2rem;
      text-align: left;
      max-width: 1000px;
    }
  
    h1 {
      font-family: "Montserrat", sans-serif;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
  
    h5 {
      font-family: "Montserrat", sans-serif;
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }
  
    h3 {
      text-align: center;
      margin-top: 2rem;
    }
  
    /* Diet Preferences */
    .diet-preferences {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }
  
    .preference {
      padding: 1rem;
      background-color: #485568;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      color: #fff;
    }
  
    /* Meal Plan List */
    .mealplan-list {
      margin-top: 2rem;
    }
  
    .week-meals {
      margin-bottom: 2rem;
    }
  
    .week-meals h5 {
      font-size: 1.5rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 1rem;
    }
  
    /* Meals Grid */
    .meals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .update-diet-pref {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn {
      text-decoration: none;
    }
  </style>