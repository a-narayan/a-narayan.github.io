import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
};

export const publicationsSlice = createSlice({
    name: "publications",
    initialState: initialState,
    reducers: {
        updatePublications: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { updatePublications } = publicationsSlice.actions;
export default publicationsSlice.reducer;