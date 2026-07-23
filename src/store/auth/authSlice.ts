import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { User } from "../../utils/userInterface";
import { signUp, signIn, signOut, getMe, forgotPassword, resetPassword, deleteAccount } from "../../api/auth";

// ========== TYPES ==========

interface AuthState{
    user: User | null
    isAuthenticated: boolean
    status: 'idle' | 'loading' | 'success' | 'error'
    authCheckError: string | null
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    status: 'idle',
    authCheckError: null
}

// ========== THUNKS ==========

export const signUpThunk = createAsyncThunk<
  void,
  { email: string; password: string },
  { rejectValue: string }
>(
    'auth/signUp',
    async ({ email, password }, {rejectWithValue}) => {
        try{
            await signUp(email, password)
        } catch (err: unknown) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
)

export const signInThunk = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>(
    'auth/signIn',
    async ({ email, password }, {rejectWithValue}) => {
        try{
            await signIn(email, password)
            const user = await getMe()
            return user
        } catch (err: unknown) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
)

export const signOutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        try{
            await signOut()
        } catch (err: unknown) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
)

export const deleteAccountThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
    'auth/deleteAccount',
    async (_, { rejectWithValue }) => {
        try {
            await deleteAccount()
        } catch (err: unknown) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
)

export const forgotPasswordThunk = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>(
    'auth/forgotPassword',
    async ({ email }, { rejectWithValue }) => {
        try{
            await forgotPassword(email)  
        } catch (err: unknown) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
)

export const resetPasswordThunk = createAsyncThunk<
  void,
  { password: string; accessToken: string },
  { rejectValue: string }
>(
    'auth/resetPassword',
    async ({ password, accessToken }, { rejectWithValue }) => {
        try{
            await resetPassword(password, accessToken)
        } catch (err: unknown) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
)

// ========== SLICE ==========

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        sessionRestored(
            state,
            action: PayloadAction<{
                user: User | null
                error: string | null
            }>
        ) {
            state.user = action.payload.user;
            state.isAuthenticated = !!action.payload.user;
            state.authCheckError = action.payload.error;
        }
    },
    extraReducers: (builder) => {
        builder
            // SIGN UP
            .addCase(signUpThunk.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(signUpThunk.fulfilled, (state) => {
                state.status = 'success'
            })
            .addCase(signUpThunk.rejected, (state) => {
                state.status = 'error'
            })

            // SIGN IN
            .addCase(signInThunk.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(signInThunk.fulfilled, (state, action) => {
                state.user = action.payload
                state.isAuthenticated = true
                state.status = 'success'
            })
            .addCase(signInThunk.rejected, (state) => {
                state.status = 'error'
            })

            // SIGN OUT
            .addCase(signOutThunk.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(signOutThunk.fulfilled, (state) => {
                state.user = null
                state.isAuthenticated = false
                state.status = 'idle'
            })
            .addCase(signOutThunk.rejected, (state) => {
                state.status = 'error'
            })

            // DELETE ACCOUNT
            .addCase(deleteAccountThunk.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(deleteAccountThunk.fulfilled, (state) => {
                state.user = null
                state.isAuthenticated = false
                state.status = 'idle'
            })
            .addCase(deleteAccountThunk.rejected, (state) => {
                state.status = 'error'
            })

            // FORGOT PASSWORD
            .addCase(forgotPasswordThunk.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(forgotPasswordThunk.fulfilled, (state) => {
                state.status = 'success'
            })
            .addCase(forgotPasswordThunk.rejected, (state) => {
                state.status = 'error'
            })

            // RESET PASSWORD
            .addCase(resetPasswordThunk.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(resetPasswordThunk.fulfilled, (state) => {
                state.status = 'success'
            })
            .addCase(resetPasswordThunk.rejected, (state) => {
                state.status = 'error'
            })
    },
})

export const { sessionRestored } = authSlice.actions;

export default authSlice.reducer