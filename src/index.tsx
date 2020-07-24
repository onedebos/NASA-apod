import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import photoSliceReducer from "./features/photo/PhotoSlice";

const store = configureStore({
  reducer: {
    photo: photoSliceReducer,
    // obj: ojSlice.reducer
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
