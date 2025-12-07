import { useAuth } from "../../auth/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

function Logout() {
    const { setIsLogged } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        setIsLogged(false);
        localStorage.clear();
        document.cookie = "bearerToken=; max-age=0; path=/";
        navigate("/");
    };
useEffect(() => {
    handleLogout();
}, [])
    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default Logout;
