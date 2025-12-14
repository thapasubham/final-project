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
    const { isLogged, permission, } = useAuth();
    const isAllowed = allowedRoles.some(p => permission.includes(p));
    if (!isLogged) {
        return <Navigate to="/login" replace />;
    }

    if (!isAllowed) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
