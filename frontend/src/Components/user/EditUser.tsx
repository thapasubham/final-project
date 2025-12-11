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
    CircularProgress,
    Container,
} from "@mui/material";

import { editUser } from "../../api/user/editUser.ts";
import { userRole } from "../../api/user/userRole.ts";
import { Refresh } from "../../api/refresh/refresh.ts";
import { useAuth } from "../../auth/AuthContext.tsx";
import { sanitizeInput, validateCreate } from "../../validation/validateCreate.ts";
import { UserType } from "../../types/userType.ts";
import { Role } from "../../types/Role.ts";
import { userErrorType } from "../../validation/userFormError.types.ts";
import { useNotification } from "../../notification/notificationContext.tsx";

export function EditUser() {
    const { id } = useParams();
    const { userStatus } = useAuth();
    const navigate = useNavigate();
    const notify = useNotification();

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch user and roles (no refresh needed)
    const fetchUserData = async () => {
        try {
            const response = await userRole(Number(id));
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
            } else {
                setError(response.data?.message || "Failed to fetch user data");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === "role" ? Number(value) : value });
    };

    // Submit with refresh retry
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        setError("");

        const payload = sanitizeInput(form);
        const errors = validateCreate(payload);
        setFormError({ ...formError, ...errors });
        if (Object.values(errors).some(msg => msg !== "")) {
            setLoading(false);
            return
        };

        let attempts = 0;
        const maxAttempts = 2;

        while (attempts < maxAttempts) {
            try {
                const result = await editUser(payload);

                if (result.status === 200) {
                    notify(result.message, "success");
                    navigate("/dashboard");
                    return;
                }

                if (result.status === 401) {
                    const refreshed = await Refresh(userStatus);
                    if (!refreshed) {
                        navigate("/login");
                        return;
                    }
                    attempts++;
                    continue;
                }

                if (result.status === 409) {
                    setFormError({ ...formError, ...result.message });
                    return;
                }

                setError(result.message || "Failed to update user");
                return;

            } catch (err: any) {
                setError(err.message);

                return;
            }
        }

        setLoading(false)
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
                <CircularProgress size={60} thickness={5} />
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Box
                sx={{
                    p: 4,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: "background.paper",
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
                                label="Role"
                            >
                                <MenuItem value="" disabled>
                                    Select role
                                </MenuItem>
                                {roles.map(role => (
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
        </Container>
    );
}

function capitalizeFirst(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default EditUser;
