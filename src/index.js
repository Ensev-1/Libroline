import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Main from "./main";
import AuthProvider from "./components/AuthProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <Main />
        </AuthProvider>
    </React.StrictMode>
);
