import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useAuth } from "./components/AuthProvider";
import Root from "./routes/root";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import BookDetails from "./components/BookDetails";
import Favorites from "./components/Favorites";

function RedirectHandler() {
    const { user } = useAuth();

    return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />;
}

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Root />
            </ProtectedRoute>
        ),
    },
    {
        path: "/login",
        element: (
            <ProtectedRoute>
                <Login />
            </ProtectedRoute>
        ),
    },
    {
        path: "/signup",
        element: (
            <ProtectedRoute>
                <Registration />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard",
        element: (
            <Dashboard />
        ),
    },
    {
        path: "/bookdetails/:id",
        element: (
            <BookDetails />
        ),
    },
    {
        path: "/favorites",
        element: (
            <Favorites />
        ),
    },
    {
        path: "*",
        element: <RedirectHandler />,
    },
]);

export default function Main() {
    return <RouterProvider router={router} />;
}
