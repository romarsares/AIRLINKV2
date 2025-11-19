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
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            const loginBtn = document.getElementById('loginBtn');
            
            // Clear previous errors
            this.clearFieldErrors();
            loginError.classList.remove('show');
            
            // Client-side validation
            if (!this.validateLoginForm(username, password, role)) {
                return;
            }

            // Disable login button during request
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';

            try {
                // Attempt login with MySQL validation
                await auth.login(username, password, role);
                
                // Success - show dashboard
                this.showDashboard();
                loginError.classList.remove('show');
                
                // Reset form
                loginForm.reset();
                
            } catch (error) {
                this.showLoginError(error.message || 'Login failed. Please try again.');
            } finally {
                // Re-enable login button
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
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

    // Validate login form fields
    validateLoginForm(username, password, role) {
        let isValid = true;
        
        if (!username || username.trim().length === 0) {
            this.showFieldError('usernameError', 'Username is required');
            isValid = false;
        } else if (username.length > 50) {
            this.showFieldError('usernameError', 'Username is too long');
            isValid = false;
        }
        
        if (!password || password.length < 6) {
            this.showFieldError('passwordError', 'Password must be at least 6 characters');
            isValid = false;
        } else if (password.length > 100) {
            this.showFieldError('passwordError', 'Password is too long');
            isValid = false;
        }
        
        if (!role || !['Admin', 'Operator'].includes(role)) {
            this.showFieldError('roleError', 'Please select a valid role');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Show field-specific error
    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(fieldId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    // Clear all field errors
    clearFieldErrors() {
        const errorElements = document.querySelectorAll('.field-error');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    // Show login error with XSS protection
    showLoginError(message) {
        const loginError = document.getElementById('loginError');
        // Sanitize message to prevent XSS
        const sanitizedMessage = message.replace(/[<>"'&]/g, function(match) {
            const escapeMap = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return escapeMap[match];
        });
        loginError.textContent = sanitizedMessage;
        loginError.classList.add('show');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});