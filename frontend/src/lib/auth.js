/**
 * Authentication utilities for dashboard access
 */

import { apiRequest, API_ENDPOINTS, getApiUrl } from './api';

// Blog API URL configuration - Blog API runs on port 5000 (from integrated file)
export const BLOG_API_BASE_URL = 'http://localhost:5000/api/blog';

// Token and session keys (from integrated file)
export const TOKEN_KEY = 'atorix_auth_token';
export const SESSION_KEY = 'is_authenticated';

// Log API base URL for debugging (from integrated file)
if (typeof window !== 'undefined') {
  console.log('🔌 Using Blog API Base URL:', BLOG_API_BASE_URL);
}

/**
 * Debug function to log storage state (from integrated file)
 * @param {string} operation - The operation being performed
 */
function logStorageState(operation) {
  if (typeof window === 'undefined') return;
  
  console.group(`Auth Storage State (${operation})`);
  console.log('localStorage token exists:', !!localStorage.getItem(TOKEN_KEY));
  console.log('sessionStorage auth flag:', sessionStorage.getItem(SESSION_KEY));
  console.groupEnd();
}

/**
 * Check if credentials are valid by calling the API
 * @param {string} username - The username to check
 * @param {string} password - The password to check
 * @returns {Promise<{success: boolean, token?: string, user?: object, message?: string}>} - Authentication result
 */
export async function validateCredentials(username, password) {
  try {
    const apiUrl = getApiUrl(API_ENDPOINTS.LOGIN);
    console.log('Attempting to login to:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies/sessions
      body: JSON.stringify({ username, password }),
    });

    // Check if response is ok before parsing JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      return {
        success: false,
        message: 'Server returned invalid response. Please check if the backend server is running on port 5001.'
      };
    }

    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed');
    }

    if (data && data.success) {
      // Store the token in sessionStorage
      if (data.token) {
        setAuthToken(data.token, data.user);
      }
      
      return {
        success: true,
        token: data.token,
        user: data.user || { username }
      };
    }

    return {
      success: false,
      message: data?.message || 'Authentication failed. Please check your credentials.'
    };
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Authentication failed. Please try again.';
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      errorMessage = 'Cannot connect to the server. Please make sure the backend server is running on port 5001.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
}

/**
 * Store authentication token and user data in localStorage
 * @param {string} token - The JWT token
 * @param {object} user - The user data
 */
export function setAuthToken(token, user = null) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('atorix_auth_token', token);
    if (user) {
      localStorage.setItem('atorix_user', JSON.stringify(user));
    }
  }
  return token;
}

/**
 * Get the current user data
 * @returns {object|null} The user data or null if not authenticated
 */
export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('atorix_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

/**
 * Remove authentication token and user data from localStorage
 */
export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('atorix_auth_token');
    localStorage.removeItem('atorix_user');
    // Also clear any sessionStorage tokens for consistency
    sessionStorage.removeItem('atorix_auth_token');
    sessionStorage.removeItem('atorix_user');
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} - Whether the user is authenticated
 */
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  
  // Use the same logic as getAuthToken to check all storage locations
  const token = getAuthToken();
  return !!token;
}

/**
 * Login user
 * @param {string} username - The username
 * @param {string} password - The password
 * @param {boolean} isBlogLogin - Whether this is a blog panel login (default: false)
 * @returns {Promise<{success: boolean, message?: string, token?: string, user?: object}>} - Result object with success and message
 */
export async function login(username, password, isBlogLogin = false) {
  try {
    // If blog login, use the blog API
    if (isBlogLogin) {
      return await loginBlogAPI(username, password);
    }

    // Otherwise use the main admin API
    const result = await validateCredentials(username, password);

    if (result.success && result.token) {
      setAuthToken(result.token, result.user);
      return {
        success: true,
        token: result.token,
        user: result.user
      };
    }

    return {
      success: false,
      message: result.message || 'Invalid username or password'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during login'
    };
  }
}

/**
 * Logout user
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    // Call the logout API endpoint
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // Important for including cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout API error:', error);
    // Continue with client-side cleanup even if API call fails
  } finally {
    // Clear all client-side storage
    clearAuthToken();
  }
}

/**
 * Get authentication token (from integrated file)
 * @returns {string|null} The authentication token or null if not found
 */
export function getAuthToken() {
  if (typeof window === 'undefined') {
    console.log('getAuthToken: Not in browser environment');
    return null;
  }
  
  try {
    // Try localStorage first (used by blog login)
    let token = localStorage.getItem(TOKEN_KEY);
    
    // Fallback to sessionStorage (used by admin login)
    if (!token) {
      token = sessionStorage.getItem(TOKEN_KEY);
    }
    
    // Also check the main admin token key
    if (!token) {
      token = sessionStorage.getItem('atorix_auth_token');
    }
    
    if (!token) {
      console.log('No token found in any storage');
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Get authorization header with token (from integrated file)
 * @returns {Object} Authorization header object with Bearer token or empty object
 */
export function getAuthHeader() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ============================================================================
// Alternative implementations from integrated file (Blog API with localStorage)
// ============================================================================

/**
 * Alternative implementation: Store authentication token in localStorage
 * (from integrated file - uses localStorage instead of sessionStorage)
 * @param {string} token - The JWT token
 */
export function setAuthTokenLocalStorage(token) {
  if (typeof window === 'undefined') return;
  
  try {
    console.log('Setting auth token...');
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(SESSION_KEY, 'true');
    console.log('Auth token set successfully');
    logStorageState('after setAuthTokenLocalStorage');
  } catch (error) {
    console.error('Error saving auth token:', error);
    // Fallback to sessionStorage if localStorage fails
    try {
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(SESSION_KEY, 'true');
      console.warn('Fell back to sessionStorage for token storage');
    } catch (e) {
      console.error('Failed to store token in sessionStorage:', e);
    }
  }
}

/**
 * Alternative implementation: Remove authentication token from storage
 * (from integrated file - clears both localStorage and sessionStorage)
 */
export function clearAuthTokenLocalStorage() {
  if (typeof window === 'undefined') return;
  
  try {
    console.log('Clearing auth token...');
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_KEY); // Clean up any sessionStorage tokens
    console.log('Auth token cleared successfully');
    logStorageState('after clearAuthTokenLocalStorage');
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
}

/**
 * Alternative implementation: Check if user is authenticated
 * (from integrated file - uses getAuthToken with localStorage)
 * @returns {boolean} - Whether the user is authenticated
 */
export function isAuthenticatedLocalStorage() {
  const isAuth = !!getAuthToken();
  console.log(`isAuthenticatedLocalStorage: ${isAuth}`);
  return isAuth;
}

/**
 * Alternative implementation: Login user with Blog API
 * (from integrated file - uses Blog API endpoint)
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Promise<{success: boolean, message?: string, token?: string, user?: object}>} - Result object with success and message
 */
export async function loginBlogAPI(username, password) {
  console.log('Login attempt for user:', username);
  console.log('Blog API URL:', `${BLOG_API_BASE_URL}/login`);
  
  try {
    const response = await fetch(`${BLOG_API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include' // Important for cookies if using them
    });
    console.log('Login response status:', response.status);
    
    // Check if response is ok before parsing JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse login response:', parseError);
      return {
        success: false,
        message: 'Server returned invalid response. Please check if the blog server is running on port 5000.'
      };
    }
    
    if (!response.ok) {
      console.error('Login failed:', data.message || 'Unknown error');
      return {
        success: false,
        message: data.message || 'Login failed'
      };
    }
    
    if (data.token) {
      console.log('Login successful, setting auth token');
      setAuthTokenLocalStorage(data.token);
      
      // Store user data in localStorage
      if (data.user) {
        try {
          localStorage.setItem('userData', JSON.stringify({
            name: data.user.name || username,
            role: data.user.role || 'user',
            email: data.user.email || ''
          }));
        } catch (e) {
          console.error('Failed to store user data:', e);
        }
      }
      
      return { 
        success: true, 
        token: data.token,
        user: data.user || { 
          username,
          role: 'user' // Default role if not provided
        }
      };
    }
    
    console.error('No token in login response:', data);
    return {
      success: false,
      message: data.message || 'Invalid response from server'
    };
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to connect to the blog server.';
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
      errorMessage = `Cannot connect to blog server at ${BLOG_API_BASE_URL}. Please ensure the blog server is running on port 5000.`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      message: errorMessage
    };
  }
}

/**
 * Alternative implementation: Logout user
 * (from integrated file - redirects to login page)
 */
export function logoutBlogAPI() {
  clearAuthTokenLocalStorage();
  // Redirect to login page if in browser environment
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login';
  }
}
