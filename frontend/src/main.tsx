import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { StrictMode } from "react";
import "./index.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(

    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={App} />
            </Routes>
        </BrowserRouter>

    </StrictMode>



)
