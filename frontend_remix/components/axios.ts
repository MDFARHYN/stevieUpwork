import axios from 'axios';

// API URL configuration
const API_URL = 'http://localhost:8000/api';

// Utility function to set token in cookies
const setTokenInCookie = (tokenType: 'access_token' | 'refresh_token', token: string) => {
  document.cookie = `${tokenType}=${encodeURIComponent(token)}; path=/; samesite=lax`;
};

// Utility function to get token from cookies
const getTokenFromCookie = (tokenType: 'access_token' | 'refresh_token') => {
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find(row => row.startsWith(`${tokenType}=`));
  return tokenCookie ? decodeURIComponent(tokenCookie.split('=')[1]) : null;
};

// Public API for unauthenticated requests
export const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Private API for authenticated requests
export const privateApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Refresh token mechanism
const refreshTokens = async () => {
  try {
    const refreshToken = getTokenFromCookie('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(
      `${API_URL}/token/refresh/`, 
      { refresh: refreshToken },
      { withCredentials: true }
    );

    // Update tokens in cookies
    if (response.data.access) {
      setTokenInCookie('access_token', response.data.access);
    }
    if (response.data.refresh) {
      setTokenInCookie('refresh_token', response.data.refresh);
    }

    console.log('Token refresh successful', response.data);
    return response.data;
  } catch (error) {
    console.error('Token refresh failed', error);
    throw error;
  }
};

// Add an interceptor to attach the access token to each request
privateApi.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token expiration
privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only retry for 401 (Unauthorized) errors and haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh tokens
        await refreshTokens();
        
        // Retry the original request
        return privateApi(originalRequest);
      } catch (refreshError) {
        // Handle refresh failure
        console.error("Token refresh completely failed", refreshError);
        
        // Redirect to login or handle login failure
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);




// Login function with token setting
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/login/`,
      { email, password },
      { withCredentials: true }
    );

    // Set tokens from login response
    if (response.data.access) {
      setTokenInCookie('access_token', response.data.access);
    }
    if (response.data.refresh) {
      setTokenInCookie('refresh_token', response.data.refresh);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout function with token clearing
export const logout = async () => {
  try {
    const response = await privateApi.post('/logout/');
    
    // Clear tokens
    setTokenInCookie('access_token', '');
    setTokenInCookie('refresh_token', '');

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Example request methods
export const authenticatedGet = async (endpoint: string) => {
  try {
    const response = await privateApi.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const authenticatedPost = async (endpoint: string, data: any, config = {}) => {
  try {
    const response = await privateApi.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const authenticatedPut = async (endpoint: string, data: any, config = {}) => {
  try {
    const response = await privateApi.put(endpoint, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const authenticatedDelete = async (endpoint: string) => {
  try {
    const response = await privateApi.delete(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};