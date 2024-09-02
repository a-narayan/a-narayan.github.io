import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
};

export const resourcesSlice = createSlice({
    name: "resources",
    initialState: initialState,
    reducers: {
        updateResources: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { updateResources } = resourcesSlice.actions;
export default resourcesSlice.reducer;
