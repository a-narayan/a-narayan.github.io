import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    team: [],
    alumni: [],
    scholarshipsAndAwards: [],
};

export const teamSlice = createSlice({
    name: "team",
    initialState: initialState,
    reducers: {
        updateTeam: (state, action) => {
            state.team = action.payload;
        },
        updateAlumni: (state, action) => {
            state.alumni = action.payload;
        },
        updateScholarshipsAndAwards: (state, action) => {
            state.scholarshipsAndAwards = action.payload;
        },
    },
});

export const { updateTeam, updateAlumni, updateScholarshipsAndAwards } = teamSlice.actions;
export default teamSlice.reducer;