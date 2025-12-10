import {UserFetch} from "../../types/user.ts";
import {useAuth} from "../../auth/AuthContext.tsx";
import {UserType} from "../../types/userType.ts";
import {editUser} from "../../api/user/editUser.ts";
import {FAILED_TO_VERIFY, USER_DELETED, VERIFIED_SUCCESS} from "../../constants/constant.ts";
import {Refresh} from "../../api/refresh/refresh.ts";
import {Link} from "react-router-dom";
import deleteUnverified from "../../api/user/deleteUnverified.ts";
import {useState} from "react";




function User({ userData, userType }: { userData: UserFetch , userType:string}) {
    const {permission} = useAuth();
    const {userStatus} = useAuth();
    const [retry, setRetry] = useState(0);
    const maxRetry= 1;
    const deleteUser =async ()=>{

        const response = await deleteUnverified(userData.id);
        if(response.status === 204){
            alert(USER_DELETED);

        }

        const result = await refresh(response);

        if ( !result ){
            alert(FAILED_TO_VERIFY);
        }
        return;
            }
        const CTA = () => {
      return(
                <div className="actions">
                    <Link to={`/editUser/${userData.id}/${userType}`}>
                        <button className="edit-button">Edit</button>
                    </Link>

                    {permission.includes("admin:delete") && (
                            <Link to={`/delete/${userData.id}/${userType}`}><button className="delete-button">
                                Delete
                            </button>
                            </Link>)}

                </div>
            );
        }
        const refresh = async (response: any)=>{
        setRetry(retry+1);
        if(response.status!==401 || retry>maxRetry){
            return false;
        }
        const result = await Refresh(userStatus);

        if(result){
           await verifyUser();
            return result;
        }
        return false
    }
    const Verify=()=> {
        return (
            <div className="actions">
                <button onClick={verifyUser} className="verify-button">
                    Verify
                </button>

                {permission.includes("admin:delete") && (
                    <button onClick={deleteUser} className="delete-button">
                        Decline
                    </button>
                )}
            </div>
        );
    };
    const verifyUser = async()=>{
             const payload = userData    ;
             payload.isverified = true;
             const response = await editUser(payload,userType );
             if(response.status === 200){
                 alert(VERIFIED_SUCCESS);

             }

             const result = await refresh(response);

             if ( !result ){
                 alert(FAILED_TO_VERIFY);
             }
            return;
        }


    return (
        <tr>
            <td><Link to={`/profile/${userData.id}/`}>{userData.firstname}</Link></td>
            <td>{userData.lastname}</td>
            <td>{userData.email}</td>
            <td>{userData.phoneNumber}</td>
            {userStatus !== UserType.USER && (
                <td>
                    {!userData.isverified ? Verify() : CTA()}
                </td>
            )}


        </tr>
    );
}

export default User;