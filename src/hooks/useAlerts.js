import { useDispatch } from "react-redux";
// import { setAlert } from "../features/alert";
import { setMessageDialog } from "../features/messageDialog";

export function useAlerts(type) {
    const dispatch = useDispatch();

    if (type === 'alert') {
        // return (alertText, alertSeverity) => {
        //     dispatch(setAlert({
        //         isOpen: true,
        //         alertText: alertText,
        //         alertDuration: 2000,
        //         alertSeverity: alertSeverity,
        //     }));
        // };
    } else if (type === 'dialog') {
        return (title, text, negativeButtonText, positiveButtonText, positiveButtonOnClick = () => {}) => {
            console.log(text);
            dispatch(setMessageDialog({
                isOpen: true,
                messageTitle: title,
                messageText: text,
                negativeButtonText: negativeButtonText,
                // positiveButtonText: positiveButtonText,
                // positiveButtonOnClick: positiveButtonOnClick,
            }));
        };
    } else {
        return (title, text, negativeButtonText) => {
            console.log(text);
            dispatch(setMessageDialog({
                isOpen: true,
                messageTitle: title,
                messageText: text,
                negativeButtonText: negativeButtonText,
                // positiveButtonText: 'positiveButtonText',
                // positiveButtonOnClick: () => { },
            }));
        };
    }
}