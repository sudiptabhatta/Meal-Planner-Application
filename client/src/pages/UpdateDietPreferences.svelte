<script>
    import axios from "axios";

    let { currentPreferences } = $props();

    let preferences = $state([]);

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

    const handleSavePreferences = async () => {
        try {
            // get guest info from local storage
            const guest = JSON.parse(localStorage.getItem('guest'));

            // make the API call to update diet preferences
            const response = await axios.put(`http://localhost:8080/users/${guest._id}`, { preferences }, {
                headers: {
                    Authorization: guest.header_token // attach token for authorization
                }
            });

            currentPreferences = response.data.preferences;

            // Dispatch an event with updated preferences
            window.dispatchEvent(new CustomEvent('preferencesUpdated', {
                detail: { preferences: response.data.preferences } // include updated preferences in the detail property
            }));

            // Close the modal
            const modal = document.getElementById('updateDietPrefModal');
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            bootstrapModal.hide();
        } catch(error) {
            console.error(error);
        }
    };
    
</script>

<!-- Modal -->
<div class="modal fade" id="updateDietPrefModal" tabindex="-1" aria-labelledby="updateDietPrefModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Update Diet Preferences</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="form-group mb-3">
                <label for="preferences" class="form-label">Select Diet Preferences</label>
                <select id="preferences" class="form-select" bind:value={preferences} multiple>
                    {#each DIETS as diet}
                        {#if currentPreferences.includes(diet)}
                            <option value={diet} selected>{diet}</option>
                        {:else}
                            <option value={diet}>{diet}</option>
                        {/if}
                    {/each}
                </select>
            </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-save" onclick={handleSavePreferences}>Save changes</button>
        </div>
      </div>
    </div>
</div>

<style>
    .modal-content {
        background-color: #1d2531;
    }

    select {
        background: #0f1621;
        border: none; 
        padding: 0.5rem;
        border-radius: 4px;
        font-family: inherit; 
        font-size: 1rem;
        outline: none; 
        box-shadow: none; 
        appearance: none; 
    }

    .form-select:focus {
        outline: none;
        box-shadow: 0 0 0.3125rem #394961;
    }

    select option {
        background-color: #0f1621;
        color: #a0a0a0;
    }

    .modal-header {
        border-color: #0f1621;
    }

    .modal-footer {
        border-color: #0f1621;
    }

    .btn-save {
        background-color: #d9ac5e;
    }

    select[multiple] option:checked {
        background: #0080ff linear-gradient(0deg, #0080ff 0%, #0080ff 100%);
        color: #fff;
    }
</style>
