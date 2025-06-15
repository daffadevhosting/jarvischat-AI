import React from 'react';
import ReactDOM from 'react-dom/client';
import { APP_NAME } from "./utils/appname.js";
import { GlobalUIProvider } from "./context/GlobalUIContext";
import './index.css'
import "animate.css";
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalUIProvider>
      <App />
    </GlobalUIProvider>
  </React.StrictMode>
)
