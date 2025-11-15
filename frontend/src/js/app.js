// Main Application
class App {
    constructor() {
        this.init();
    }

    init() {
        // Check authentication status
        if (auth.isAuthenticated()) {
            this.showDashboard();
        } else {
            this.showLogin();
        }

        this.setupLoginForm();
        this.setupLogout();
    }

    // Show login screen
    showLogin() {
        document.getElementById('loginScreen').classList.add('active');
        document.getElementById('dashboardScreen').classList.remove('active');
    }

    // Show dashboard screen
    showDashboard() {
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('dashboardScreen').classList.add('active');
        
        // Initialize dashboard
        dashboard.init();
    }

    // Setup login form
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const loginError = document.getElementById('loginError');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const role = document.getElementById('role').value;
            
            if (!role) {
                this.showLoginError('Please select a role');
                return;
            }

            try {
                // Attempt login
                auth.login(role);
                
                // Test API connection
                await api.health();
                
                // Success - show dashboard
                this.showDashboard();
                loginError.classList.remove('show');
                
            } catch (error) {
                this.showLoginError('Login failed: ' + error.message);
            }
        });
    }

    // Setup logout
    setupLogout() {
        document.getElementById('logoutBtn').addEventListener('click', () => {
            auth.logout();
            dashboard.destroy();
            this.showLogin();
            
            // Reset form
            document.getElementById('loginForm').reset();
        });
    }

    // Show login error
    showLoginError(message) {
        const loginError = document.getElementById('loginError');
        loginError.textContent = message;
        loginError.classList.add('show');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});