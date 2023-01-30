import React from 'react';
import ReactDOM from 'react-dom/client';
import {  Router } from 'react-router-dom';
import App from './App/Layout/App';
import reportWebVitals from './reportWebVitals';
import { createBrowserHistory } from "history";
import { Provider } from 'react-redux';
import { store } from './App/store/configureStore';



export const history = createBrowserHistory();

const root = ReactDOM.createRoot(
  document.getElementById('ReStoreRoot') as HTMLElement
);

// The React.StrictMode needed to be INSIDE the browserRouter, otherwise, the links "work", but you have to click Refresh to 
// actually see the new page. 
root.render(
  // Router needed to go outside of StrictMode...
  <Router history={history}>
    <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
    </React.StrictMode>
  </Router>
);  
      
    

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
