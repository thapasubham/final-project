import React, {useEffect,  useState} from "react";
import { editUser } from "../../api/user/editUser.ts";
import {useNavigate, useParams } from "react-router-dom";
import {Refresh} from "../../api/refresh/refresh.ts";
import {useAuth} from "../../auth/AuthContext.tsx";
import {userErrorType} from "../../validation/userFormError.types.ts";
import { validateCreate, sanitizeInput} from "../../validation/validateCreate.ts";
import {userRole} from "../../api/user/userRole.ts";
import {Role} from "../../types/Role.ts";
import {UserType} from "../../types/userType.ts";
import {Button, InputLabel, MenuItem, NativeSelect, Select} from "@mui/material";

function EditUser() {
    const { id, userType } = useParams();
  const { userStatus } = useAuth()
    const [retry,setRetry]= useState(0)
    const [form, setForm] = useState(
        {
            id: Number(id),
            firstname: "",
            lastname: "",
            phoneNumber: "",
            email: "",
            role: 0
        });
  const [roles, setRole] = useState<Role[]>([])
  const maxRetry = 1;
    const [error, setError] = useState("");
    const [formError, setFormError] = useState<userErrorType>({
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
    });
    const navigate = useNavigate();

    const refresh =async () =>{

        setRetry(retry+1);
            const result = await  Refresh(userStatus);
            if (result) {
                setRetry(0);
                setError("");
                return true;
            } else  {
                navigate("/login");
            }
    }
    const fetchUser = async () => {

        try {
            const response = await userRole(form.id, userType as string);


            if (response.status===200) {
                const {user,roles} = response.data;


                setForm({
                    id: Number(user.id),
                    firstname: user.firstname,
                    lastname: user.lastname,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                    role: user.role.id
                });


                setRole(roles);
                setError("");
            }



        } catch (e) {
            setError(()=>(e as Error).message);
        }

    };

    useEffect(() => {
        fetchUser();

    }, []);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRetry(0);
        setError("");
        const payload = sanitizeInput(form)
        const errors = validateCreate(payload);
        setFormError({...formError, ...errors});
        const hasErrors = Object.values(errors).some((msg) => msg !== "");
        if(hasErrors) {

            return;
        }

        try {
            //calling the function that does api call
            const result = await editUser(payload, userType as string);


            if (result.status === 200) {
                alert(result.message);
                setError("");
                navigate("/dashboard");
            }
            else if (result.status === 409) {
                setFormError({...formError, ...result.message});
                return;
            }

            if(result.status===401 && retry<maxRetry) {
                await refresh();
            }
        }catch (e)
        {
            setError((e as Error).message);
        }

    }
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name==="role"? Number(value):value });

    }
    return (
        <>
            {error && (<p data-testid="error" className="errorMessage">{error}</p>)}
            <div className="user-form">
                <h3>Edit Details</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="edit-firstname">Firstname</label>
                    <input
                        data-testid="edit-firstname"
                        type="text"
                        name="firstname"
                        value={form.firstname}
                        onChange={handleChange}
                        required
                    />

                    {formError.firstname&& (<p className="formError">{formError.firstname}</p>)}
                    <label htmlFor="edit-lastname">Lastname</label>
                    <input
                        data-testid="edit-lastname"
                        type="text"
                        name="lastname"
                        value={form.lastname}
                        onChange={handleChange}
                        required
                    />
                    {formError.lastname&& (<p className="formError">{formError.lastname}</p>)}
                    <label htmlFor="edit-email">Email</label>
                    <input
                        data-testid="edit-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    {formError.email&& (<p className="formError">{formError.email}</p>)}

                    <label htmlFor="edit-phoneNumber">Phone no</label>
                    <input
                        data-testid="edit-phoneNumber"
                        type="text"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                    {formError.phoneNumber&& (<p className="formError">{formError.phoneNumber}</p>)}
                    {userStatus ===UserType.ADMIN &&  (
                        <><InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Role
                        </InputLabel><NativeSelect
                            size="small"

                            id="role" name="role" value={form.role} onChange={handleChange}>
                            <option value="" disabled>Select role</option>
                            {roles.map((role) => (
                                <option  key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </NativeSelect></>)}
                    <Button variant="contained" data-testid="submitButton">Submit</Button>
                </form>
            </div>
        </>
    )

}

export default EditUser;