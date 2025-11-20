/**
 * Authentication Module - Handles user authentication and token management
 * Implements secure login with input validation and XSS protection
 */
class Auth {
    constructor() {
        this.token = this.getSecureItem('airlink_token');
        this.role = this.getSecureItem('airlink_role');
        this.username = this.getSecureItem('airlink_username');
        this.loginAttempts = 0;
        this.maxAttempts = 5;
    }

    // Secure localStorage getter with validation
    getSecureItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? this.sanitizeString(item) : null;
        } catch (error) {
            console.warn('Failed to retrieve secure item:', key);
            return null;
        }
    }

    // Input sanitization to prevent XSS
    sanitizeString(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[<>"'&]/g, function(match) {
            const escapeMap = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return escapeMap[match];
        });
    }

    // Validate input fields
    validateLoginInput(username, password, role) {
        const errors = [];
        
        if (!username || username.trim().length === 0) {
            errors.push('Username is required');
        } else if (username.length > 50) {
            errors.push('Username too long');
        }
        
        if (!password || password.length < 6) {
            errors.push('Password must be at least 6 characters');
        } else if (password.length > 100) {
            errors.push('Password too long');
        }
        
        if (!role || !['Admin', 'Operator'].includes(role)) {
            errors.push('Please select a valid role');
        }
        
        return errors;
    }

    // Login with username, password, and role validation against MySQL
    async login(username, password, role) {
        // Check rate limiting
        if (this.loginAttempts >= this.maxAttempts) {
            throw new Error('Too many login attempts. Please wait before trying again.');
        }

        // Validate input
        const validationErrors = this.validateLoginInput(username, password, role);
        if (validationErrors.length > 0) {
            throw new Error(validationErrors[0]);
        }

        // Sanitize inputs
        const sanitizedUsername = this.sanitizeString(username.trim());
        const sanitizedRole = this.sanitizeString(role);

        try {
            this.loginAttempts++;
            
            // Call backend login API with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ 
                    username: sanitizedUsername, 
                    password: password, // Don't sanitize password as it may contain special chars
                    role: sanitizedRole 
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Network error' }));
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.success || !data.token) {
                throw new Error('Invalid server response');
            }

            // Reset login attempts on success
            this.loginAttempts = 0;

            // Store sanitized data
            this.token = data.token;
            this.role = this.sanitizeString(data.role);
            this.username = this.sanitizeString(data.username);
            
            // Secure storage
            try {
                localStorage.setItem('airlink_token', this.token);
                localStorage.setItem('airlink_role', this.role);
                localStorage.setItem('airlink_username', this.username);
            } catch (storageError) {
                console.warn('Failed to store authentication data');
                throw new Error('Failed to save login session');
            }
            
            return true;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Login request timed out. Please try again.');
            }
            
            // Log error without exposing sensitive information
            console.warn('Login attempt failed:', error.message);
            
            // Generic error message for security
            if (error.message.includes('credentials')) {
                throw new Error('Invalid username, password, or role');
            }
            
            throw error;
        }
    }

    // Secure logout with cleanup
    async logout() {
        try {
            // Call backend logout endpoint
            if (this.token) {
                await fetch('http://localhost:3000/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                }).catch(() => {}); // Ignore errors for logout
            }
        } catch (error) {
            console.warn('Logout request failed:', error.message);
        } finally {
            // Clear all authentication data
            this.token = null;
            this.role = null;
            this.username = null;
            this.loginAttempts = 0;
            
            // Clear localStorage
            try {
                localStorage.removeItem('airlink_token');
                localStorage.removeItem('airlink_role');
                localStorage.removeItem('airlink_username');
            } catch (error) {
                console.warn('Failed to clear storage:', error.message);
            }
        }
    }

    // Check if user is authenticated with token validation
    isAuthenticated() {
        if (!this.token) return false;
        
        try {
            // Basic JWT structure validation
            const parts = this.token.split('.');
            if (parts.length !== 3) return false;
            
            // Check if token is expired (basic check)
            const payload = JSON.parse(atob(parts[1]));
            const now = Math.floor(Date.now() / 1000);
            
            if (payload.exp && payload.exp < now) {
                this.logout();
                return false;
            }
            
            return true;
        } catch (error) {
            console.warn('Token validation failed:', error.message);
            this.logout();
            return false;
        }
    }

    // Get secure auth headers for API calls
    getAuthHeaders() {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }
        
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        };
    }

    // Get current username
    getUsername() {
        return this.username;
    }

    // Check if user has admin role
    isAdmin() {
        return this.role === 'Admin';
    }

    // Get current role
    getRole() {
        return this.role;
    }
}

// Export auth instance
const auth = new Auth();