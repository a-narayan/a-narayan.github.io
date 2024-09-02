import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import newsReducer from './features/news';
import highlightsReducer from './features/highlights';
import teamReducer from './features/team';
import publicationsReducer from './features/publications';
import resourcesReducer from './features/resources';
import messageDialogReducer from './features/messageDialog';
import userReducer from './features/user';
import { Provider } from 'react-redux';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));

const rootReducer = combineReducers({
  news: newsReducer,
  highlights: highlightsReducer,
  team: teamReducer,
  publications: publicationsReducer,
  resources: resourcesReducer,
  messageDialog: messageDialogReducer,
  user: userReducer,
})

const store = configureStore({
  reducer: rootReducer
});


root.render(
  <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <App />
    </LocalizationProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
