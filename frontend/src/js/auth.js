// Authentication Module
class Auth {
    constructor() {
        this.token = localStorage.getItem('airlink_token');
        this.role = localStorage.getItem('airlink_role');
    }

    // Generate JWT token based on role
    generateToken(role) {
        // Simple token generation for demo (in production, this comes from server)
        const payload = {
            user_id: role === 'Admin' ? 1 : 2,
            role: role,
            email: `${role.toLowerCase()}@airlink.com`,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        };
        
        // Base64 encode (simplified JWT for demo)
        const header = btoa(JSON.stringify({alg: "HS256", typ: "JWT"}));
        const payloadStr = btoa(JSON.stringify(payload));
        const signature = btoa(`signature_${role}_${Date.now()}`);
        
        return `${header}.${payloadStr}.${signature}`;
    }

    // Login with role selection
    login(role) {
        if (!role) {
            throw new Error('Role is required');
        }

        this.token = this.generateToken(role);
        this.role = role;
        
        localStorage.setItem('airlink_token', this.token);
        localStorage.setItem('airlink_role', this.role);
        
        return true;
    }

    // Logout
    logout() {
        this.token = null;
        this.role = null;
        localStorage.removeItem('airlink_token');
        localStorage.removeItem('airlink_role');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }

    // Get auth headers for API calls
    getAuthHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
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