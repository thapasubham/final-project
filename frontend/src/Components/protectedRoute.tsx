import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import React from "react";

export default function RoleProtectedRoute({
    children,
    allowedRoles,
}: {
    children: React.ReactNode;
    allowedRoles: string[];
}) {
    const { isLogged, userStatus, } = useAuth();

    // Not logged in → redirect to login
    if (!isLogged) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but role is not allowed → redirect to unauthorized page
    if (!allowedRoles.includes(userStatus)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
