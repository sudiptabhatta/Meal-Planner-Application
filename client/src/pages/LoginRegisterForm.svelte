<script>
    import axios from "axios";
    import { navigate } from "svelte-routing";

    let username = $state('');
    let password = $state('');
    let preferences = $state([]);

    let formType = $state('login');
    let errorMessage = $state(''); // State to store dynamic error messages

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

    // configuration for login and registration forms
    const formConfig = {
        login: {
            title: 'Login',
            button_text: 'Login',
            toggle_text: 'No account? Register'
        },
        register: {
            title: 'Register',
            button_text: 'Register',
            toggle_text: 'Already have an account? Login'
        }
    }

    // toggle between login and register form types
    const formTypeToggle = () => {
        errorMessage = '';
        formType = formType === 'login' ? 'register' : 'login';
    };


    const handleSubmit = async () => {
        // set endpoint based on form type (login or register)
        const endpoint = `http://localhost:8080/users/${formType}`;
        try {
            // send form data to the server
            const response = await axios.post(endpoint, { username, password, preferences});

            // handle login success, save guest data to local storage
            if(formType === 'login' && response.data._id) {
                const { _id, tokenType, access_token } = response.data;

                // create guest object with _id and token type and access token
                const guest = { _id, header_token: `${tokenType} ${access_token}`};

                // store guest data in local storage
                localStorage.setItem('guest', JSON.stringify(guest));

                // dispatch event to notify other parts of the app about storage-updated
                window.dispatchEvent(new Event('storage-updated'));

                // navigate to the user's profile page after successful login
                navigate(`profile/${_id}`);
            }

            // handle register success and toggle to the login form
            if(formType === 'register' && response.data._id) {
                formTypeToggle();
            }

            errorMessage = '';
        } catch(error) {
            if(error.response && error.response.data){
                // handle errors from backend
                const errorMessageResponse = error.response.data.error || error.response.data.message;
                if (errorMessageResponse) {
                    if (errorMessageResponse.includes('duplicate key error')) {
                        errorMessage = 'Username already exists';
                    } else {
                        errorMessage = errorMessageResponse;
                    }
                } else {
                    errorMessage = 'An unexpected error occurred.';
                }
            } else {
                // Fallback for other types of errors (e.g., network errors)
                errorMessage = error.message || 'An unexpected error occurred.';
            }

        }
    }

    const closeErrorAlert = () => {
        errorMessage = '';
    };
</script>

<div class="form-container">
    {#if errorMessage}
        <div class="alert alert-danger" role="alert" style="width: 100%;">
            <span>{errorMessage}</span>
            <button type="button" class="btn-close" aria-label="Close" onclick={closeErrorAlert}></button>
        </div>
    {/if}
    <br>
    <h1>{formConfig[formType].title}</h1>

    <input type="text" bind:value={username} placeholder="username *" />
    <input type="password" bind:value={password} placeholder="password *" />
  
    {#if formType === 'register'}
        <div class="form-group mb-3">
            <label for="preferences" class="form-label">Select Diet Preferences (optional)</label>
            <select id="preferences" class="form-select" bind:value={preferences} multiple>
                {#each DIETS as diet}
                    <option value={diet}>{diet}</option>
                {/each}
            </select>
        </div>
    {/if}

    <button class="submit-btn" onclick={handleSubmit}>
        {formConfig[formType].button_text}
    </button>

    <div class="toggle-container">
        <label for="toggle" class="toggle-label">
            {formConfig[formType].toggle_text}
        </label>
        <button
            class="toggle-btn"
            role="switch"
            aria-label="Toggle between login and register"
            aria-checked={formType === 'login' ? false : true}
            class:active={formType === 'login'}
            onclick={formTypeToggle}
        ></button>
    </div>
</div>

<style>
    .form-container {
        background-color: #1d2531;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: 32rem;
        margin: 2.5rem auto;
        text-align: center;
    }

    .form-container h1 {
        text-transform: uppercase;
    }

    .form-container input {
        width: 100%;
        padding: 1rem;
        margin: 1rem 0;
        border: none;
        border-radius: 0.5rem;
        background: #0f1621;
        color: #a0a0a0;
    }

    .form-container input:focus {
        outline: none;
        box-shadow: 0 0 0.3125rem #394961;
    }

    .form-container .submit-btn {
        width: 100%;
        padding: 1rem;
        border: none;
        border-radius: 0.5rem;
        background: #f2c069;
        cursor: pointer;
        margin-bottom: 1rem;
    }

    .form-container .submit-btn:hover {
        background: #d9ac5e;
    }

    .toggle-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    .toggle-label {
        font-size: 1rem;
    }

    .toggle-btn {
        width: 3rem;
        height: 1.5rem;
        background-color: #555;
        border-radius: 1.875rem;
        position: relative;
        cursor: pointer;
        transition: background-color 0.3s;
        display: flex;
        align-items: center;
        padding: 0;
        outline: none;
        border: none;
    }

    .toggle-btn:before {
        content: '';
        position: absolute;
        top: 0.125rem;
        left: 0.125rem;
        width: 1.25rem;
        height: 1.25rem;
        background-color: #d6dbe4;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .toggle-btn.active {
        background-color: #d9ac5e;
    }

    .toggle-btn.active:before {
        transform: translateX(1.5rem);
    }

    .toggle-btn:focus {
        outline: none;
        box-shadow: none;
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

    .alert {
        margin-top: 2rem;
        width: 32rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
    }

</style>





