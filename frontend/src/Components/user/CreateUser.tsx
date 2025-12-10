import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Checkbox,
    FormControlLabel,
    Alert,
} from "@mui/material";

import { UserType } from "../../types/userType.ts";
import { Role } from "../../types/Role.ts";
import { getRoles } from "../../api/role/getRole.ts";
import { userErrorType } from "../../validation/userFormError.types.ts";
import { validateCreate, sanitizeInput } from "../../validation/validateCreate.ts";
import signUp from "../../api/user/signUp.ts";
import { Refresh } from "../../api/refresh/refresh.ts";
import { useAuth } from "../../auth/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

function CreateUser() {
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
        role: 1,
        isverified: true,
    });

    const [formError, setFormErrors] = useState<userErrorType>({
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
    });

    const { userStatus } = useAuth();
    const [retry, setRetry] = useState(0);
    const [roles, setRoles] = useState<Role[]>([]);
    const [user, setUser] = useState(UserType.USER);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const maxRetry = 1;

    // Fetch roles
    const fetchRoles = async () => {
        const result = await getRoles();
        try {
            if (result.data.length === 0) {
                setError("No roles found");
            } else {
                setRoles(result.data);
            }
        } catch (e: any) {
            setError(e.message);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    function handleChange(e: any) {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: name === "role" ? Number(value) : value,
        });
    }

    const refresh = async () => {
        setRetry(retry + 1);
        const result = await Refresh(userStatus);

        if (result) {
            setRetry(0);
            setError("");
            return true;
        }

        navigate("/login");
    };

    const handleRegister = async (e: any) => {
        e.preventDefault();

        const payload = sanitizeInput(form);
        const errors = validateCreate(form);
        setFormErrors(errors);

        const hasErrors = Object.values(errors).some((msg) => msg !== "");

        if (hasErrors) return;

        try {

            const result = await signUp(payload, user);
            setError("");

            if (result.status === 201) {
                alert(result.message);
            }

            if (result.status === 400 || result.status === 409) {
                setFormErrors({ ...formError, ...result.message });
            }

            if (result.status === 401 && retry < maxRetry) {
                await refresh();
            }
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 500,
                mx: "auto",
                mt: 6,
                p: 4,
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <Typography variant="h5" mb={2}>
                Create {user}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleRegister}>

                {/* FIRST NAME */}
                <TextField
                    fullWidth
                    label="First Name"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    error={!!formError.firstname}
                    helperText={formError.firstname}
                    sx={{ mb: 2 }}
                />

                {/* LAST NAME */}
                <TextField
                    fullWidth
                    label="Last Name"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    error={!!formError.lastname}
                    helperText={formError.lastname}
                    sx={{ mb: 2 }}
                />

                {/* EMAIL */}
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={!!formError.email}
                    helperText={formError.email}
                    sx={{ mb: 2 }}
                />

                {/* PHONE NUMBER */}
                <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    error={!!formError.phoneNumber}
                    helperText={formError.phoneNumber}
                    sx={{ mb: 2 }}
                />

                {/* ROLE SELECT */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Role</InputLabel>

                    <Select
                        name="role"
                        value={form.role}
                        label="Role"
                        onChange={handleChange}
                    >
                        {roles.map((r) => (
                            <MenuItem key={r.id} value={r.id}>
                                {r.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* ADMIN CHECKBOX */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={user === UserType.ADMIN}
                            onChange={(e) => {
                                setUser(
                                    e.target.checked
                                        ? UserType.ADMIN
                                        : UserType.USER
                                );
                            }}
                        />
                    }
                    label="Create Admin"
                    sx={{ mb: 3 }}
                />

                {/* SUBMIT BUTTON */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    data-testid="submitButton"
                >
                    Submit
                </Button>
            </form>
        </Box>
    );
}

export default CreateUser;
