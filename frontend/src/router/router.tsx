import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import PurchaseHistory from "../Components/purchase/purchase.tsx";
import { useAuth } from "../auth/AuthContext.tsx";
import UploadFont from "../Components/fontUpload/fontUpload.tsx";
import RoleAdminPanel from "../roles/roles.tsx";
export function Router() {
    const { isLogged } = useAuth();

    return (
        <BrowserRouter>
            <NavBar />
            <Suspense fallback={<div>Loading...</div>}>

                <Routes>

                    <Route path="/" element={<App />} />
                    <Route path="/payment" element={<PaymentAdd />} />
                    <Route path='/about' element={<About />} />
                    <Route
                        path="/login"
                        element={!isLogged ? <Login /> : <Navigate to="/" replace />}
                    />
                    <Route path='/dashboard'
                        element={isLogged ? <RoleProtectedRoute allowedRoles={["admin:view"]}>
                            <DashBoard />
                        </RoleProtectedRoute> : <Navigate to="/login" />} />
                    <Route path='/logout' element={<Logout />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='*' element={<PageNotFound />} />
                    <Route path='/editUser/:id' element={<EditUser />} />
                    <Route path='/delete/:id' element={<DeleteUser />} />
                    <Route path='/profile/:id' element={isLogged ? <Profile /> : <Navigate to="/login" />} />
                    <Route path='/unauthorized' element={<Unauthorized />} />
                    <Route path='/payment-success' element={<>Hello</>} />
                    <Route
                        path="/user/:id/purchases"
                        element={<PurchaseHistory />}
                    />
                    <Route path='/designer/uploadFont'
                        element={isLogged ? <RoleProtectedRoute allowedRoles={["font:upload"]}>
                            <UploadFont />
                        </RoleProtectedRoute> : <Navigate to="/login" />} />
                    <Route path='/admin/role'
                        element={isLogged ? <RoleProtectedRoute allowedRoles={["admin:view"]}>
                            <RoleAdminPanel />
                        </RoleProtectedRoute> : <Navigate to="/login" />} />
                </Routes>

            </Suspense>

        </BrowserRouter>
    )
}