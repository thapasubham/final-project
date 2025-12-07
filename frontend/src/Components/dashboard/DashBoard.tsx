import UserList from "./userList.tsx";
import { useState } from "react";
import './dashboard.css'
import { useAuth } from "../../auth/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "@mui/material";

const tabs = {
    userTab: "user-tab",
    adminTab: "admin-tab",
    unverifiedTab: "unverified-tab",
}

function DashBoard() {
    const [user, setUser] = useState("users");
    const { permission } = useAuth();
    const [activeTab, setActiveTab] = useState(tabs.userTab);
    const navigate = useNavigate()
    const showAdminOptions = permission.includes("admin:delete");
    const canCreate = permission.includes("admin:view");
    const [verified, setVerified] = useState(true);
    return (
        <div>
            <div className="dashboard">
                <Container>
                    <Button className={activeTab === tabs.userTab ? 'active-button' : ''} onClick={() => {
                        setUser("users");
                        setVerified(true);
                        setActiveTab(tabs.userTab);
                    }}
                        disabled={activeTab === tabs.userTab}
                    >User List</Button>

                    {showAdminOptions && (
                        <>
                            <Button className={activeTab === tabs.adminTab ? 'active-button' : ''} onClick={() => {
                                setUser("admin");
                                setVerified(true);
                                setActiveTab(tabs.adminTab);
                            }}
                                disabled={activeTab === tabs.adminTab}
                            >Admin List</Button>
                            <Button className={activeTab === tabs.unverifiedTab ? 'active-button' : ''} onClick={() => {
                                setUser("users");
                                setVerified(false);
                                setActiveTab(tabs.unverifiedTab);
                            }}
                                disabled={activeTab === tabs.unverifiedTab}
                            >Unverified User</Button>

                        </>
                    )}
                    {canCreate && <Button onClick={() => navigate("/create")}>Create User</Button>}
                </Container>
            </div>

            <UserList user={user} verified={verified} />
        </div>
    );
}

export default DashBoard;
