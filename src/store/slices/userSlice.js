import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, profilesAPI } from '../../lib/api';

// Async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      const { accessToken, user } = response.data || {};
      if (accessToken && user?.id != null) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userId', String(user.id));
      }
      return { accessToken, user };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      // Prefer profile resource; create one if missing
      const res = await profilesAPI.getMine(userId);
      const items = Array.isArray(res.data) ? res.data : [];
      return items[0] || null;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch profile');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (payload, { rejectWithValue }) => {
    try {
      // payload: { email, password, ...profileFields }
      const { email, password, firstName, lastName, phone, address } = payload;
      const { data } = await authAPI.register({ email, password });
      const { accessToken, user } = data || {};
      if (!(accessToken && user?.id != null)) {
        throw new Error('Invalid register response');
      }
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userId', String(user.id));
      // bootstrap a profile row
      await profilesAPI.create({
        userId: user.id,
        firstName: firstName || '',
        lastName: lastName || '',
        email,
        phone: phone || '',
        address: address || '',
      });
      return { accessToken, user };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Registration failed');
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
      // Login user
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
      // Register user
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
      // Fetch user profile
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

export const { 
  logout, 
  setAuthFromStorage, 
  clearError, 
} = userSlice.actions;

export default userSlice.reducer;