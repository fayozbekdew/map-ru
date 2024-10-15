import ReactDOM from "react-dom";
import App from "./App.jsx";
import "./index.css";
import React from "react";
import { BrowserRouter } from 'react-router-dom'
import MapProvider from "./contex/contex";

ReactDOM.render(
  <BrowserRouter>
    <MapProvider>
    <App />
    </MapProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
