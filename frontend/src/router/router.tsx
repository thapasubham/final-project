import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "../Components/about/About";
import { SignUp, Login, Logout, EditUser } from "../Components/user/index"
import PageNotFound from "../Components/PageNotFound.tsx";
import DashBoard from "../Components/dashboard/DashBoard.tsx";
import { Profile } from "../Components/user/Profile.tsx";
import { DeleteUser } from "../Components/user";
import NavBar from "../Components/navbar/Navbar.tsx";
import PaymentAdd from "../Components/checkout/checkoutForm.tsx";
import App from "../App.tsx";
import { Suspense } from "react";
export function Router() {
    return (
        <BrowserRouter>
            <NavBar />
            <Suspense fallback={<div>Loading...</div>}>

                <Routes>

                    <Route path="/" Component={App} />
                    <Route path="/payment" Component={PaymentAdd} />
                    <Route path='/about' Component={About} />
                    <Route path='/login' Component={Login} />
                    <Route path='/dashboard' Component={DashBoard} />
                    <Route path='/logout' Component={Logout} />
                    <Route path='/signup' Component={SignUp} />
                    <Route path='*' Component={PageNotFound} />
                    <Route path='/editUser/:id' Component={EditUser} />
                    <Route path='/delete/:id' Component={DeleteUser} />
                    <Route path='/profile/:id' Component={Profile} />
                </Routes>
            </Suspense>

        </BrowserRouter>
    )
}