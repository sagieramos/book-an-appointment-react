import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import url from '../../apiDomain.json';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const loginUser = createAsyncThunk('profile/login', async (credentials) => {
    const { login, password } = credentials;
    const data = JSON.stringify({
      "user": {
        "login": login,
        "password": password
      }
    });
  
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${url.apiDomain}/auth/login`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
  
    try {
      const response = await axios.request(config);
      const authToken = response.headers['authorization'];
      localStorage.setItem('authorization_token', authToken);
  
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.status.message || 'Login failed');
    }
  });


  const signupUser = createAsyncThunk('profile/signup', async (userData) => {
    const { username, firstName, lastName, email, password, passwordConfirmation, city } = userData;
  const data = JSON.stringify({
    "user": {
        "username": username,
        "email": email,
        "first_name": firstName,
        "last_name": lastName,
        "password": password,
        "password_confirmation": passwordConfirmation,
        "city": city
    }
  });  
  
const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${url.apiDomain}/auth/signup`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };  try {
    const response = await axios.request(config);
    const authToken = response.headers['authorization'];
    localStorage.setItem('authorization_token', authToken);    return response.data.data;
  } catch (error) {
    throw new Error(error.response.data.status.message || 'Signup failed');
  }
});

const logoutUser = createAsyncThunk('profile/logout', async () => {
    const authToken = localStorage.getItem('authorization_token');
    try {
      await axios.delete(`${url.apiDomain}/auth/logout`, {
        headers: {
          'Authorization': authToken,
        },
      });
      return null;
    } catch (error) {
      throw new Error(error.response.data.status.message || 'Logout failed');
    }
  });

  
  const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfile: () => initialState,
  },


  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetProfile } = profileSlice.actions; 
export default profileSlice.reducer;
export { loginUser, signupUser, logoutUser }; 