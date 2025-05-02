const API_KEY = '1515b2c7e398475d84806373d8c3a5e4';
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const recipesContainer = document.getElementById('recipes');
const loadingSpinner = document.getElementById('loading');
const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
const favoriteButton = document.getElementById('favoriteButton');
const addToPlannerButton = document.getElementById('addToPlannerButton');
const userMenuButton = document.getElementById('userMenuButton');

let currentRecipe = null;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Check authentication
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Update user menu
function updateUserMenu() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('userEmail').textContent = user.email;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    updateUserMenu();
});

searchButton.addEventListener('click', searchRecipes);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchRecipes();
    }
});

// Check for recipe ID in URL parameters
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get('recipe');
if (recipeId) {
    showRecipeDetails(recipeId);
}

async function searchRecipes() {
    const query = searchInput.value.trim();
    if (!query) return;

    showLoading(true);
    recipesContainer.innerHTML = '';

    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}&addRecipeInformation=true&number=9`
        );
        const data = await response.json();
        displayRecipes(data.results);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipesContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger">
                    Failed to fetch recipes. Please try again later.
                </div>
            </div>`;
    } finally {
        showLoading(false);
    }
}

function displayRecipes(recipes) {
    if (!recipes.length) {
        recipesContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    No recipes found. Try a different search term.
                </div>
            </div>`;
        return;
    }

    recipesContainer.innerHTML = recipes.map(recipe => `
        <div class="col-md-4">
            <div class="card h-100">
                ${isFavorite(recipe.id) ? '<div class="favorite-badge"><i class="bi bi-heart-fill text-danger"></i></div>' : ''}
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
                    <button class="btn btn-primary mt-3" onclick="showRecipeDetails(${recipe.id})">
                        View Recipe
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function showRecipeDetails(id) {
    if (!checkAuth()) return;

    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
        );
        const recipe = await response.json();
        currentRecipe = recipe;

        const modalTitle = document.querySelector('#recipeModal .modal-title');
        const modalBody = document.querySelector('#recipeModal .modal-body');

        modalTitle.textContent = recipe.title;
        modalBody.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipe-details">
                <div class="mb-4">
                    <h6 class="fw-bold">Preparation Time:</h6>
                    <p>${recipe.readyInMinutes} minutes</p>
                    <h6 class="fw-bold">Servings:</h6>
                    <p>${recipe.servings}</p>
                </div>
                <div class="mb-4">
                    <h6 class="fw-bold">Ingredients:</h6>
                    <ul>
                        ${recipe.extendedIngredients.map(ingredient => 
                            `<li>${ingredient.original}</li>`
                        ).join('')}
                    </ul>
                </div>
                <div>
                    <h6 class="fw-bold">Instructions:</h6>
                    <ol>
                        ${recipe.analyzedInstructions[0]?.steps.map(step => 
                            `<li class="mb-2">${step.step}</li>`
                        ).join('') || 'No instructions available.'}
                    </ol>
                </div>
            </div>
        `;

        updateFavoriteButton();
        recipeModal.show();
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}

function showLoading(show) {
    loadingSpinner.classList.toggle('d-none', !show);
}

function isFavorite(recipeId) {
    return favorites.some(recipe => recipe.id === recipeId);
}

function updateFavoriteButton() {
    if (!currentRecipe) return;
    
    const isFav = isFavorite(currentRecipe.id);
    favoriteButton.innerHTML = `
        <i class="bi bi-heart${isFav ? '-fill' : ''}"></i>
        ${isFav ? 'Remove from Favorites' : 'Add to Favorites'}
    `;
}

favoriteButton.addEventListener('click', () => {
    if (!currentRecipe || !checkAuth()) return;

    const index = favorites.findIndex(recipe => recipe.id === currentRecipe.id);
    if (index === -1) {
        favorites.push({
            id: currentRecipe.id,
            title: currentRecipe.title,
            image: currentRecipe.image,
            readyInMinutes: currentRecipe.readyInMinutes,
            servings: currentRecipe.servings
        });
    } else {
        favorites.splice(index, 1);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton();
});

addToPlannerButton.addEventListener('click', () => {
    if (!currentRecipe || !checkAuth()) return;
    window.location.href = `meal-planner.html?recipe=${currentRecipe.id}`;
});

document.getElementById("ingredientSearchButton").addEventListener("click", function () {
    const ingredients = document.getElementById("ingredientInput").value.trim();

    if (!ingredients) {
        alert("Please enter at least one ingredient.");
        return;
    }

    fetchRecipesByIngredients(ingredients);
});

function fetchRecipesByIngredients(ingredients) {
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=6&apiKey=${API_KEY}`;

    document.getElementById("loading").classList.remove("d-none"); // Show loading spinner

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("loading").classList.add("d-none"); // Hide loading spinner
            displayRecipes(data);
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
            alert("Failed to fetch recipes. Please try again.");
            document.getElementById("loading").classList.add("d-none");
        });
}




// Logout function
document.getElementById('logoutButton')?.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

// Initialize Bootstrap tooltips
document.addEventListener('DOMContentLoaded', function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});