import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTrips, createTrip } from "../../api/trips";
import { getErrorMessage } from "../../utils/getErrorMessage";

// ========== TYPES ==========

interface Trip {
    id: string
    user_id: string
    departure_city: string
    is_public: boolean
    cities: string[]
    days: number
    people: number
    budget: number
    likes: number
    created_at: string
    updated_at: string
}

interface TripsState{
    trips: Trip[]
    fetchStatus: 'loading' | 'success' | 'error'
    createStatus: 'idle' | 'loading' | 'success' | 'error'
}

const initialState: TripsState = {
    trips: [],
    fetchStatus: 'loading',
    createStatus: 'idle'
}

// ========== THUNKS ==========

export const getTripsThunk = createAsyncThunk(
    'trips/getTrips',
    async (_, { rejectWithValue }) => {
        try{
            return await getTrips();
        } catch (err: unknown) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const createTripThunk = createAsyncThunk<
    Trip,
    {
        departure_city: string;
        cities: string[];
        days: number;
        people: number;
        budget: number;
    },
    { rejectValue: string }
>(
    'trips/createTrip',
    async({ departure_city, cities, days, people, budget }, { rejectWithValue }) => {
        try{
            return await createTrip(
                departure_city,
                cities,
                days,
                people,
                budget
            );
        } catch (err: unknown) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// ========== SLICE ==========

const tripsSlice = createSlice({
    name: 'trips',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTripsThunk.pending, (state) => {
                state.fetchStatus = 'loading';
            })
            .addCase(getTripsThunk.fulfilled, (state, action) => {
                state.fetchStatus = 'success';
                state.trips = action.payload;
            })
            .addCase(getTripsThunk.rejected, (state) => {
                state.fetchStatus = 'error';
            })
            .addCase(createTripThunk.pending, (state) => {
                state.createStatus = 'loading';
            })
            .addCase(createTripThunk.fulfilled, (state, action) => {
                state.createStatus = 'success';
                state.trips.push(action.payload);
            })
            .addCase(createTripThunk.rejected, (state) => {
                state.createStatus = 'error';
            })
    },
});

export default tripsSlice.reducer