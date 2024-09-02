import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
};

export const newsSlice = createSlice({
    name: "news",
    initialState: initialState,
    reducers: {
        updateNews: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { updateNews } = newsSlice.actions;
export default newsSlice.reducer;