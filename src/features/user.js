import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        id: '',
        name: '',
        isLoggedIn: false,
        userType: ''
    }
};

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        loginUser: (state, action) => {
            state.value = {
                id: action.payload.id,
                name: action.payload.name,
                isLoggedIn: true,
                userType: action.payload.userType,
            };
        },
        logoutUser: (state, action) => {
            state.value = initialState.value;
        }
    },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;