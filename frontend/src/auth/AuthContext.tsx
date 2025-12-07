import React, { useContext, useState } from "react";

export type AuthContextTypes = {
    isLogged: boolean;
    userStatus: string;
    permission: string[];
    userID: number;
    setIsLogged: (isLogged: boolean) => void;
    setUserStatus: (userStatus: string) => void;
    setUserPermission: (permission: string[]) => void;
    setUserID: (id: number) => void;
};

const AuthContext = React.createContext<AuthContextTypes | null>(null);



function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLogged, setIsLogged] = useState(() => {
        const stored = localStorage.getItem("isLogged");
        return stored === "true";
    });
    const [userStatus, setUserStatus] = useState(()=>{
            const currentUser = localStorage.getItem("userStatus");
            return currentUser ? currentUser : "" ;
        }
        )
    const [permission, setUserPermission] = useState<string[]>(() => {
        const stored = localStorage.getItem("permission");
        return stored ? JSON.parse(stored) : [];
    });
    const [userID, setUserID] = useState(()=>{
        const stored = localStorage.getItem("userID");
        return stored ? Number(stored): -1;
    }) ;
    return (
        <AuthContext.Provider value={{ isLogged, setIsLogged, userStatus, setUserStatus, permission, setUserPermission, userID, setUserID }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthProvider;

