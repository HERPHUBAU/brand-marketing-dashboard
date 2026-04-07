// Authentication and Access Control Service
// For HERP HUB AU "The Collective" membership tier

class AuthService {
  constructor() {
    this.tokenKey = 'herphub_collective_token';
    this.userKey = 'herphub_user_data';
    this.apiBase = 'https://herphub.au/wp-json/herphub/v1';
  }

  // Check if user is authenticated and has "The Collective" access
  async checkCollectiveAccess() {
    try {
      const token = this.getStoredToken();
      if (!token) return { authorized: false, reason: 'No token found' };

      // For development, if we have a Meta token, assume it's valid
      // This bypasses WordPress backend and CORS issues
      if (import.meta.env.VITE_ENABLE_DEBUG === 'true' || token.startsWith('EA')) {
        console.log('DEBUG: Bypassing WordPress auth check for development');
        return { 
          authorized: true, 
          user: { name: 'HERP HUB User', membership_tier: 'the_collective' },
          expires_at: new Date(Date.now() + 3600000).toISOString()
        };
      }

      // Verify token with WordPress backend
      const response = await fetch(`${this.apiBase}/verify-collective-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        this.clearAuth();
        return { authorized: false, reason: 'Token verification failed' };
      }

      const data = await response.json();
      
      if (data.authorized && data.membership_tier === 'the_collective') {
        this.updateUserData(data.user_data);
        return { 
          authorized: true, 
          user: data.user_data,
          expires_at: data.expires_at 
        };
      } else {
        this.clearAuth();
        return { authorized: false, reason: 'Not a Collective member' };
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // For development, if we have a Meta token, allow access
      if (this.getStoredToken() && this.getStoredToken().startsWith('EA')) {
        return { 
          authorized: true, 
          user: { name: 'HERP HUB User', membership_tier: 'the_collective' },
          expires_at: new Date(Date.now() + 3600000).toISOString()
        };
      }
      return { authorized: false, reason: 'Authentication error' };
    }
  }

  // Store authentication token securely
  storeToken(token, expiresIn = 3600) {
    const expiresAt = Date.now() + (expiresIn * 1000);
    const tokenData = {
      token,
      expires_at: expiresAt,
      created_at: Date.now()
    };
    sessionStorage.setItem(this.tokenKey, JSON.stringify(tokenData));
  }

  // Manually set Meta access token for testing
  setMetaAccessToken(token) {
    sessionStorage.setItem('meta_access_token', token);
    console.log('Meta access token set manually');
  }

  // Retrieve stored token
  getStoredToken() {
    try {
      const authData = sessionStorage.getItem(this.tokenKey);
      if (!authData) return null;

      const parsed = JSON.parse(authData);
      
      // Check if token has expired
      if (Date.now() > parsed.expires_at) {
        this.clearAuth();
        return null;
      }

      return parsed.token;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  }

  // Update user data
  updateUserData(userData) {
    try {
      localStorage.setItem(this.userKey, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  }

  // Get user data
  getUserData() {
    try {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  }

  // Clear authentication data
  clearAuth() {
    sessionStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Initiate OAuth flow with Meta
  initiateMetaAuth() {
    const clientId = import.meta.env.VITE_META_APP_ID || '901866836185231'; // Fallback for testing
    console.log('DEBUG: Environment variables:', import.meta.env);
    console.log('DEBUG: Client ID:', clientId);
    
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/meta/callback');
    const scope = 'pages_read_engagement,pages_show_list,ads_read,business_management,pages_read_user_content';
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scope}&` +
      `response_type=code&` +
      `state=${this.generateState()}`;
    
    console.log('DEBUG: Auth URL:', authUrl);
    window.location.href = authUrl;
  }

  // Generate secure state parameter for OAuth
  generateState() {
    return btoa(Math.random().toString(36).substring(2, 15) + Date.now());
  }

  // Handle OAuth callback
  async handleMetaCallback(code, state) {
    try {
      // TEMPORARY: Force bypass WordPress backend for testing
      console.log('DEBUG: Processing OAuth callback with real token exchange');
      
      // Exchange authorization code for access token
      const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=901866836185231&client_secret=667b96ceb4fee29add49894cfba04141&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/meta/callback')}&code=${code}`, {
        method: 'POST'
      });
      
      if (!tokenResponse.ok) {
        throw new Error('Token exchange failed');
      }
      
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
      
      if (accessToken) {
        // Store the real Meta access token
        sessionStorage.setItem('meta_access_token', accessToken);
        console.log('DEBUG: Real Meta access token stored');
        
        // Store auth token for dashboard
        const mockToken = 'auth_token_' + Date.now();
        this.storeToken(mockToken, 3600);
        
        return { 
          success: true, 
          user: { name: 'HERP HUB User', membership_tier: 'the_collective' }
        };
      } else {
        throw new Error('No access token received');
      }

      console.log('DEBUG: VITE_ENABLE_DEBUG =', import.meta.env.VITE_ENABLE_DEBUG);
      
      if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
        console.log('DEBUG: Bypassing WordPress callback, simulating success');
        
        // Simulate successful token exchange
        const mockToken = 'mock_access_token_' + Date.now();
        this.storeToken(mockToken, 3600);
        
        // Store Meta access token for testing
        sessionStorage.setItem('meta_access_token', mockToken);
        
        return { 
          success: true, 
          user: { name: 'Test User', membership_tier: 'the_collective' }
        };
      }

      console.log('DEBUG: Calling WordPress backend...');
      const response = await fetch(`${this.apiBase}/meta-auth-callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, state })
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      
      if (data.success) {
        this.storeToken(data.access_token, data.expires_at);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Meta callback failed:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Get Meta access token for API calls
  getMetaToken() {
    return this.getStoredToken();
  }

  // Check if current session is valid
  isSessionValid() {
    const token = this.getStoredToken();
    return token !== null;
  }
}

export const authService = new AuthService();
