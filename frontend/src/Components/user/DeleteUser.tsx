import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { deleteUser } from "../../api/user/deleteUser";
import {getUserByid} from "../../api/user/getUserByid.ts";
import {userPayload} from "../../types/user.ts";
import {Refresh} from "../../api/refresh/refresh.ts";
import {USER_DELETED} from "../../constants/constant.ts";
import "./delete.css"
import {useAuth} from "../../auth/AuthContext.tsx";
function DeleteUser() {
   const {id, userType} = useParams();
    const nagivate = useNavigate();
    const {userStatus}  = useAuth()
    const [error, setError] = useState("");
    const [user, setUser] = useState<userPayload>({
    phoneNumber: "",
    email: "",
    id: 0,
    firstname:"",
    lastname: ""

});

    useEffect(() => {
fetchUser()
    }, []);

    const fetchUser =async () => {

        const response = await getUserByid(Number(id), userType as string);

        if (response.status === 200) {
            const userDate = response.data;
            setUser(prev => ({ ...prev, ...userDate }));
            setError("");

        }
        if (response.status === 401) {
            const result =await Refresh(userStatus as string);
            if (result){
                fetchUser()
            }
        }
    }
    const handleDelete = async () => {
        try {
            const result = await deleteUser( Number(id), userType as string);
            if (result.status === 204) {
                alert(USER_DELETED);
                nagivate("/dashboard")
            } else {
                alert(`${result.message}`);
            }
        } catch (e) {
            setError("Something went wrong");
        }
    };

    return (
        <div>
            <h3>Delete User</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>Are you sure you want to delete user : {user.firstname} {user.lastname} ?</p>
            <div className="delete-question">
                <button className="delete-confirm" onClick={handleDelete}>Confirm</button>
            <button id="cancelButton" onClick={()=>nagivate("/dashboard")}>Cancel</button>
            </div>
        </div>
    );
}

export default DeleteUser;
