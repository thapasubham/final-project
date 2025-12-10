import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
} from "@mui/material";

import { editUser } from "../../api/user/editUser.ts";
import { userRole } from "../../api/user/userRole.ts";
import { Refresh } from "../../api/refresh/refresh.ts";
import { useAuth } from "../../auth/AuthContext.tsx";
import { sanitizeInput, validateCreate } from "../../validation/validateCreate.ts";
import { UserType } from "../../types/userType.ts";
import { Role } from "../../types/Role.ts";
import { userErrorType } from "../../validation/userFormError.types.ts";

export function EditUser() {
    const { id } = useParams();
    const { userStatus } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        id: Number(id),
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
        role: 0,
    });

    const [roles, setRoles] = useState<Role[]>([]);
    const [formError, setFormError] = useState<userErrorType>({
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
    });

    const [error, setError] = useState("");
    const [retry, setRetry] = useState(0);
    const maxRetry = 1;

    const refresh = async () => {
        setRetry(retry + 1);
        const result = await Refresh(userStatus);
        if (result) {
            setRetry(0);
            setError("");
            return true;
        } else {
            navigate("/login");
        }
    };

    const fetchUser = async () => {
        try {
            console.log(id);
            const response = await userRole(Number(id));
            console.log(response.data); 
            if (response.status === 200) {
                const { user, roles } = response.data;
                setForm({
                    id: Number(user.id),
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: user.role.id,
                });
                setRoles(roles);
                setError("");
            }
        } catch (e) {
            setError((e as Error).message);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === "role" ? Number(value) : value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRetry(0);
        setError("");

        const payload = sanitizeInput(form);
        const errors = validateCreate(payload);
        setFormError({ ...formError, ...errors });

        if (Object.values(errors).some((msg) => msg !== "")) return;

        try {
            const result = await editUser(payload);
            if (result.status === 200) {
                alert(result.message);
                navigate("/dashboard");
            } else if (result.status === 409) {
                setFormError({ ...formError, ...result.message });
            } else if (result.status === 401 && retry < maxRetry) {
                await refresh();
            }
        } catch (e) {
            setError((e as Error).message);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 450,
                mx: "auto",
                mt: 6,
                p: 4,
                boxShadow: 3,
                borderRadius: 2,
            }}
            component="form"
            onSubmit={handleSubmit}
        >
            <Typography variant="h5" mb={3} textAlign="center">
                Edit User Details
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Stack spacing={2}>
                <TextField
                    fullWidth
                    label="Firstname"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    error={!!formError.firstname}
                    helperText={formError.firstname}
                />

                <TextField
                    fullWidth
                    label="Lastname"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    error={!!formError.lastname}
                    helperText={formError.lastname}
                />

                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={!!formError.email}
                    helperText={formError.email}
                />

                <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    error={!!formError.phoneNumber}
                    helperText={formError.phoneNumber}
                />

                {userStatus === UserType.ADMIN && (
                    <FormControl fullWidth>
                       <InputLabel id="role-label">Role</InputLabel>

                        <Select
                            labelId="role-label"
                            id="role"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            required
                            label="Role"   // <-- THIS FIXES THE OVERLAP
                        >
                            <MenuItem value="" disabled>
                                Select role
                            </MenuItem>

                            {roles.map((role) => (
                                <MenuItem key={role.id} value={role.id}>
                                    {capitalizeFirst(role.name)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </Stack>
        </Box>
    );
}

function capitalizeFirst(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default EditUser;
