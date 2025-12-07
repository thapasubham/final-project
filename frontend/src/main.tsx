import { createRoot } from 'react-dom/client'
import { Router } from "./router/router.tsx"
import { StrictMode } from "react";
import "./index.css"
import AuthProvider from './auth/AuthContext.tsx';


createRoot(document.getElementById('root')!).render(

    <StrictMode>
        <AuthProvider>
            <Router />
        </AuthProvider>
    </StrictMode>



)
