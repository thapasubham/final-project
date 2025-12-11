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
import RoleProtectedRoute from "../Components/protectedRoute.tsx";
import Unauthorized from "../Components/unauthorizes.tsx";
export function Router() {
    return (
        <BrowserRouter>
            <NavBar />
            <Suspense fallback={<div>Loading...</div>}>

                <Routes>

                    <Route path="/" element={<App />} />
                    <Route path="/payment" element={<PaymentAdd />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/dashboard'
                        element={<RoleProtectedRoute allowedRoles={["admin"]}>
                            <DashBoard />
                        </RoleProtectedRoute>} />
                    <Route path='/logout' element={<Logout />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='*' element={<PageNotFound />} />
                    <Route path='/editUser/:id' element={<EditUser />} />
                    <Route path='/delete/:id' element={<DeleteUser />} />
                    <Route path='/profile/:id' element={<Profile />} />
                    <Route path='/unauthorized' element={<Unauthorized />} />

                </Routes>
            </Suspense>

        </BrowserRouter>
    )
}