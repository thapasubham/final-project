import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { StrictMode } from "react";
import "./index.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PaymentAdd from './Components/checkout/checkoutForm.tsx';

createRoot(document.getElementById('root')!).render(

    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={App} />
                <Route path="/payment" Component={PaymentAdd}/>
            </Routes>
        </BrowserRouter>

    </StrictMode>



)
