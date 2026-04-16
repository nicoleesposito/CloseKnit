// Don't edit this document for UI or components. refer to the App.jsx files in the src folder!
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // react router to navigate between pages.
import './index.css';
import App from './App.jsx';

if (localStorage.getItem('largerText') === 'true') {
  document.documentElement.classList.add('larger-text');
}

if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark-mode');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);