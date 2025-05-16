import axios from 'axios';
import { LOGIN_SUCCESS, LOGIN_FAIL, SIGNUP_SUCCESS, SIGNUP_FAIL, LOGOUT } from './types';

const API_BASE_URL = 'http://localhost:8000/api'; // Adjust your Django API URL

// Login action
export const login = (username, password) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/token/`, { username, password }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { access, refresh } = response.data;

    // Save tokens to localStorage
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);

    // Dispatch the success action
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { access, refresh },
    });
  } catch (error) {
    // Dispatch failure action
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response ? error.response.data : { message: 'Login failed' },
    });
  }
};

export const signup = (username, password, email) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup/`, 
      { username, password, email },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    // Dispatch success action
    dispatch({
      type: SIGNUP_SUCCESS,
    });

    // You can automatically log in the user after signup if tokens are provided
    // Example: dispatch the login action or save tokens if response contains them.
    if (response.data.access && response.data.refresh) {
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { access, refresh },
      });
    }

  } catch (error) {
    // Dispatch failure action
    dispatch({
      type: SIGNUP_FAIL,
      payload: error.response ? error.response.data : { message: 'Signup failed' },
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  dispatch({
    type: LOGOUT,
  });
};
