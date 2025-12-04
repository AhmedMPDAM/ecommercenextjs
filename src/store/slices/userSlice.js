import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, profilesAPI } from '../../lib/api';

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data?.data || {};
      if (token && user?.id != null) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userId', String(user.id));
      }
      return { accessToken: token, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await profilesAPI.getByUserId(userId);
      const profile = res.data?.data?.profile || null;
      return profile;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { email, password, firstName, lastName, phone, address } = payload;
      const response = await authAPI.register({ email, password });
      const { token, user } = response.data?.data || {};
      if (!(token && user?.id != null)) {
        throw new Error('Invalid register response');
      }
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userId', String(user.id));
      await profilesAPI.create({
        userId: user.id,
        firstName: firstName || '',
        lastName: lastName || '',
        email,
        phone: phone || '',
        address: address || '',
      });
      return { accessToken: token, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
    },

    setAuthFromStorage: (state) => {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');

      if (token && userId) {
        state.isAuthenticated = true;
        state.token = token;
      }
    },

    clearError: (state) => {
      state.error = null;
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
        state.isAuthenticated = true;
        state.token = action.payload.accessToken || null;
        state.user = action.payload.user || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.accessToken || null;
        state.user = action.payload.user || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setAuthFromStorage, clearError, } = userSlice.actions;

export default userSlice.reducer;