import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        isOpen: false,
        messageTitle: '',
        messageText: '',
        negativeButtonText: '',
        positiveButtonText: '',
        positiveButtonOnClick: null,
        hasPositiveButton: false,
    }
};

export const messageDialogSlice = createSlice({
    name: "messageDialog",
    initialState: initialState,
    reducers: {
        setMessageDialog: (state, action) => {
            if (action.payload.positiveButtonOnClick !== undefined && action.payload.positiveButtonOnClick !== null && action.payload.positiveButtonText.length > 0) {
                state.value = { ...action.payload, hasPositiveButton: true };
            } else {
                state.value = {
                    isOpen: action.payload.isOpen,
                    messageTitle: action.payload.messageTitle,
                    messageText: action.payload.messageText,
                    negativeButtonText: action.payload.negativeButtonText,
                    positiveButtonText: '',
                    positiveButtonOnClick: null,
                    hasPositiveButton: false,
                }
            }
        },
        closeMessageDialog: (state, action) => {
            state.value = initialState.value;
        },
    },
});

export const { setMessageDialog, closeMessageDialog } = messageDialogSlice.actions;
export default messageDialogSlice.reducer;