import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    workSessions: [],
    sessionId: "",
    isTracking: false,
    currentTime: 0,
}

const employeesSlice = createSlice({
    name: "timeTracker",
    initialState,
    reducers: {
        startSuccessful(state, action) {
            state.sessionId = action.payload.id
        },
        stopSuccessful(state, action) {
            state.workSessions.unshift(action.payload)
        },
        getWorkSessionsSuccessful(state, action) {
            state.workSessions = action.payload
        },
        getLastWorkSessionSuccessful(state, action) {
            if (!action.payload) return
            state.sessionId = action.payload.id;
            state.currentTime = Math.floor((Date.now() - action.payload.startTime) / 1000);
            state.isTracking = true;
        },
        deleteWorkSessionSuccessful(state, action) {
            state.workSessions = state.workSessions.filter(workSession => workSession.id !== action.payload)
        },
        setTime(state, action) {
            state.currentTime = action.payload;
        },
        setIsTracking(state, action) {
            state.isTracking = action.payload
        },
    },
})

export const {
    startSuccessful,
    stopSuccessful,
    getWorkSessionsSuccessful,
    getLastWorkSessionSuccessful,
    deleteWorkSessionSuccessful,
    setIsTracking,
    setTime
} = employeesSlice.actions;

export default employeesSlice.reducer;
