const API_KEY = '';
const favoritesContainer = document.getElementById('favorites');

// Load favorites from localStorage
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function displayFavorites() {
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="bi bi-heart"></i>
                    <p class="mb-0">You haven't saved any favorites yet.</p>
                    <a href="index.html" class="btn btn-primary mt-3">Find Recipes</a>
                </div>
            </div>
        `;
        return;
    }

    favoritesContainer.innerHTML = favorites.map(recipe => `
        <div class="col-md-4">
            <div class="card h-100">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${recipe.title}</h5>
                    <div class="recipe-info">
                        <span>
                            <i class="bi bi-clock"></i> ${recipe.readyInMinutes} mins
                        </span>
                        <span>
                            <i class="bi bi-people"></i> ${recipe.servings} servings
                        </span>
                    </div>
                    <div class="mt-auto">
                        <button class="btn btn-primary mt-2" onclick="showRecipeDetails(${recipe.id})">
                            View Recipe
                        </button>
                        <button class="btn btn-outline-danger mt-2" onclick="removeFromFavorites(${recipe.id})">
                            <i class="bi bi-heart-fill"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

async function showRecipeDetails(id) {
    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
        );
        const recipe = await response.json();
        window.location.href = `index.html?recipe=${id}`;
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}

function removeFromFavorites(id) {
    favorites = favorites.filter(recipe => recipe.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

displayFavorites();
