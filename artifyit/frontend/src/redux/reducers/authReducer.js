import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, SIGNUP_SUCCESS, SIGNUP_FAIL } from '../actions/types';

const initialState = {
  accessToken: localStorage.getItem('accessToken'), // Check localStorage for token
  refreshToken: localStorage.getItem('refreshToken'), // Check localStorage for refresh token
  isAuthenticated: !!localStorage.getItem('accessToken'), // Check if logged in
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.payload.access, // Storing access token
        refreshToken: action.payload.refresh, // Storing refresh token
        error: null,
      };
    case LOGIN_FAIL:
    case SIGNUP_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        error: action.payload.error || 'Login/Signup failed',
      };
    case LOGOUT:
      // Clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return {
        ...initialState,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default authReducer;
