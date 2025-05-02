// User authentication state
let isAuthenticated = false;
let currentUser = null;

// Check if user is already logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    if (user) {
        currentUser = JSON.parse(user);
        isAuthenticated = true;
        return true;
    }
    return false;
}

// Initialize forms and event listeners
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleRegisterPasswordBtn = document.getElementById('toggleRegisterPassword');

    // If user is already logged in, redirect to home page
    if (checkAuth()) {
        window.location.href = 'index.html';
    }

    // Toggle between login and register forms
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('d-none');
        registerForm.classList.remove('d-none');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('d-none');
        loginForm.classList.remove('d-none');
    });

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        const icon = togglePasswordBtn.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.replace('bi-eye', 'bi-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.replace('bi-eye-slash', 'bi-eye');
        }
    });

    toggleRegisterPasswordBtn.addEventListener('click', () => {
        const passwordInput = document.getElementById('registerPassword');
        const icon = toggleRegisterPasswordBtn.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.replace('bi-eye', 'bi-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.replace('bi-eye-slash', 'bi-eye');
        }
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store logged in user
            localStorage.setItem('user', JSON.stringify({
                name: user.name,
                email: user.email
            }));
            
            // Redirect to home page
            window.location.href = 'index.html';
        } else {
            alert('Invalid email or password');
        }
    });

    // Handle register form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if user already exists
        if (users.some(user => user.email === email)) {
            alert('Email already registered');
            return;
        }
        
        // Add new user
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login after registration
        localStorage.setItem('user', JSON.stringify({ name, email }));
        
        // Redirect to home page
        window.location.href = 'index.html';
    });
});

// Function to log out user
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}