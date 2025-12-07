import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "../Components/about/About";
import Home from "../Components/home";
import { SignUp, Login, Logout, EditUser } from "../Components/user/index"
import PageNotFound from "../Components/PageNotFound.tsx";
import DashBoard from "../Components/dashboard/DashBoard.tsx";
import { Profile } from "../Components/user/Profile.tsx";
import CreateUser from "../Components/user/CreateUser.tsx";
import { DeleteUser } from "../Components/user";
import NavBar from "../Components/navbar/Navbar.tsx";
import PaymentAdd from "../Components/checkout/checkoutForm.tsx";
import App from "../App.tsx";
export function Router() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" Component={App} />
                <Route path="/payment" Component={PaymentAdd} />
                <Route path='/about' Component={About} />
                <Route path='/login' Component={Login} />
                <Route path='/dashboard' Component={DashBoard} />
                <Route path='/logout' Component={Logout} />
                <Route path='/signup' Component={SignUp} />
                <Route path='*' Component={PageNotFound} />
                <Route path='/create' Component={CreateUser} />
                <Route path='/editUser/:id/:userType' Component={EditUser} />
                <Route path='/delete/:id/:userType' Component={DeleteUser} />
                <Route path='/profile/:id/:userType' Component={Profile} />

            </Routes>
        </BrowserRouter>
    )
}