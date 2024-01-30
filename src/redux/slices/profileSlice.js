import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import url from '../../apiDomain.json';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const me = createAsyncThunk('profile/me', async () => {
  const authToken = localStorage.getItem('authorization_token');

  if (!authToken) { return null; }

  const config = {
    method: 'get',
    url: `${url.apiDomain}/api/v1/users/my_profile`,
    headers: {
      Authorization: authToken,
    },
  };
  const response = await axios.request(config);
  if (response.status === 200) return response.data.data;
  return null;
});

const loginUser = createAsyncThunk('profile/login', async (credentials) => {
  const { login, password } = credentials;
  const data = JSON.stringify({
    user: {
      login,
      password,
    },
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${url.apiDomain}/auth/login`,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  };
  const response = await axios.request(config);
  if (response.status === 200) {
    const authToken = response.headers.authorization;
    localStorage.setItem('authorization_token', authToken);
    return response.data.data;
  }
  return null;
});

const signupUser = createAsyncThunk('profile/signup', async (userData) => {
  const {
    username, firstName, lastName, email, password, passwordConfirmation, city,
  } = userData;
  const data = JSON.stringify({
    user: {
      username,
      email,
      first_name: firstName,
      last_name: lastName,
      password,
      password_confirmation: passwordConfirmation,
      city,
    },
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${url.apiDomain}/auth/signup`,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  };
  const response = await axios.request(config);
  const authToken = response.headers.authorization;
  localStorage.setItem('authorization_token', authToken); return response.data.data;
});

const logoutUser = createAsyncThunk('profile/logout', async () => {
  const authToken = localStorage.getItem('authorization_token');
  await axios.delete(`${url.apiDomain}/auth/logout`, {
    headers: {
      Authorization: authToken,
    },
  });
  return null;
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfileMsg: (state) => {
      state.loading = initialState.loading;
      state.error = initialState.error;
    },
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
      })
      .addCase(me.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(me.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(me.rejected, (state) => {
        state.loading = false;
        state.error = null;
        state.user = null;
      });
  },
});

export const { resetProfileMsg } = profileSlice.actions;
export default profileSlice.reducer;
export {
  loginUser, signupUser, logoutUser, me,
};
