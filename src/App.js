import React from "react";
import { BrowserRouter } from "react-router-dom";

import AppProviders from "./contexts";
import Routes from "./routing/routes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Routes />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
