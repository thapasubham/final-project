import { useEffect, useState } from "react";
import TableHeader from "./TableHeader.tsx";
import getUser from "../../api/user/getUser.ts";
import Userlist from "./UserRow.tsx";
import {UserFetch} from "../../types/user.ts";
import "./userList.css"
import { useAuth } from "../../auth/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import {USER_DOES_NOT_FOUND} from "../../constants/constant.ts";



function UserList({user, verified}: {user: string, verified: boolean}) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("Loading...");
    const [users, setUsers] = useState<UserFetch[]>([]);
    const { isLogged } = useAuth();
    const navigate = useNavigate();
    const limit =5;
    const [offset, setOffset] = useState(0);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [orderBy, setOrderBy] = useState("");
    const [searchBy, setSearchBy] = useState("firstname");



    useEffect(() => {
        if (!isLogged) {
            setError("You need to login");
            navigate("/login");
            return;
        }

       const getData= setTimeout( ()=>getUsers(), 200);
        return () => {clearTimeout(getData);};
        }, [isLogged, offset, filter, orderBy, search, user,verified]);

        const getUsers = async () => {

        try {

        const response = await getUser(search, searchBy,limit, offset, orderBy, filter,user, verified);

            if (response.data.length ===0) {
                setError(USER_DOES_NOT_FOUND);
                return;
            }
            if (response.data) {
                setUsers(()=>response.data);
                setLoading("");
                setError("");
            } else {
                setError("No User Found");
                setLoading("");

            }
        } catch (err) {
            setError((err as Error).message);

        }

    }

    const handlePrevious = () => {
        setOffset((prevState) => {
            return prevState <= 0 ? 0 : prevState - limit
        });

    }

    const handleNext = () => {
        setOffset(prevState => prevState + limit);
    }
    return (
        <div>
                <div className="user-list">
                <div className="list-filter">
                <input type="text" placeholder={searchBy} value={search}
                    onChange={(e) => setSearch(e.target.value)} />
                    <select defaultValue="firstname" value={searchBy} onChange={(e) =>{
                        setSearchBy(e.target.value)
                        setSearch("");
                    }}>
                        <option value="firstname">Firstname</option>
                        <option value="lastname">Lastname</option>
                        <option value="email" >Email</option>
                       <option value="phoneNumber">Phone No</option>
                    </select>
                </div>
                <div className="pagination">< button data-testid="previous-button" onClick={handlePrevious}>Previous</button>

                <button data-testid="next-button" onClick={handleNext} disabled={!!error} >Next</button>
            </div>
                </div>
            {error ? (
                <p data-testid="error" className="errorMessage">{error}</p>
            ) : (
                <>
                {loading ? (<p>{loading}</p>): (
                    <table className="user-table">
                        <TableHeader  setFilter={setFilter} setOrderBy={setOrderBy} />


                                <tbody>
                                    {(users.map((u) => (
                                        <Userlist userData={u} key={u.id} userType={user} />
                                    )))
                                    }
                                </tbody>

                    </table> )
                }
                </>

            )
            }

        </div >
    );
}

export default UserList;
