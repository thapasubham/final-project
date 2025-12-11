import { createRoot } from 'react-dom/client'
import { Router } from "./router/router.tsx"
import { StrictMode, Suspense } from "react";
import "./index.css"
import AuthProvider from './auth/AuthContext.tsx';
import { NotificationProvider } from './notification/notificationContext.tsx';


createRoot(document.getElementById('root')!).render(

    <StrictMode>
        <AuthProvider>
            <NotificationProvider>
                <Router />

            </NotificationProvider>
        </AuthProvider>
    </StrictMode>



)
