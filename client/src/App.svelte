<script>
    import { Router, Route, Link, navigate } from "svelte-routing";
    import LoginRegisterForm from "./pages/LoginRegisterForm.svelte";
    import Profile from "./pages/Profile.svelte";
    import SearchMeal from "./pages/SearchMeal.svelte";

    const verifyLogin = () => {
        // retrieve guest from local storage or return null if not found
        const guest = JSON.parse(localStorage.getItem('guest'));
        return guest || null;
    }

    // initialize guest state based on current login status
    let guest = $state(verifyLogin());

    const logout = () => {
        // remove guest from local storage and reset guest variable
        localStorage.removeItem('guest');
        guest = null;

        // navigate to account page after logout
        navigate('/account');
    }

    // update guest state if storage-updated occurs
    window.addEventListener('storage-updated', () => {
        guest = verifyLogin();
    });
</script>

<div class="app-container">
    <Router>
        <nav class="navbar">
            <div class="navbar-app-name">
                <h1>Meal Planner App</h1>
            </div>

            <div class="navbar-actions">
                {#if guest}
                    <Link to="/profile/{guest._id}">
                        <span class="navbar-item">Profile</span>
                    </Link>
                    <Link to="/search">
                        <span class="navbar-item">Search</span>
                    </Link>
                    <button class="navbar-item logout-btn" onclick={logout}>Logout</button>
                {:else}
                    <Link to="/account">
                        <span class="navbar-item">Login</span>
                    </Link>
                {/if}
            </div>
        </nav>

        <div>
            <Route path="/account">
                <LoginRegisterForm />
            </Route>
            <Route>
                <SearchMeal />
            </Route>
            <Route path="/profile/:id" let:params>
                <Profile id={params.id} />
            </Route>
        </div>
    </Router>
</div>

<style>
  .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .navbar {
        background-color: #0c111a;
        padding: 1rem;
        border-bottom: 1px solid #00001a;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .navbar-app-name {
        display: flex;
        align-items: center;
    }

    .navbar h1 {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.8rem;
        font-weight: 300;
        margin: 0;
        color: #d6dbe4;
    }

    .navbar-actions {
        display: flex;
        align-items: center;
    }

    .navbar-item {
        margin-right: 1rem;
        color: #d6dbe4;
        text-transform: uppercase;
        font-size: 1rem;
        text-decoration: none;
    }

    .logout-btn {
        margin-left: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        background: #f2c069;
        color: #0c111a;
        border: none;
        cursor: pointer;
    }

    .logout-btn:hover {
        background-color: #a0a8b5;
    }
</style>