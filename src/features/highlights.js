import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
};

export const highlightsSlice = createSlice({
    name: "highlights",
    initialState: initialState,
    reducers: {
        updateHighlights: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { updateHighlights } = highlightsSlice.actions;
export default highlightsSlice.reducer;