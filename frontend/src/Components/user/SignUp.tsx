import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import signUp from "../../api/user/signUp.ts";
import { useNavigate } from "react-router-dom";
import { validateCreate, sanitizeInput } from "../../validation/validateCreate.ts";
import { userErrorType } from "../../validation/userFormError.types.ts";
import { useNotification } from "../../notification/notificationContext.tsx";

export function SignUp() {
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const notify = useNotification()
    const [formError, setFormError] = useState<userErrorType>({
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
        password: ""
    });

    async function register(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const payload = sanitizeInput(form);
        const validationErrors = validateCreate(payload);

        setFormError({ ...formError, ...validationErrors });

        const hasErrors = Object.values(validationErrors).some(
            (msg) => msg !== ""
        );

        if (hasErrors) return;

        try {
            const result = await signUp(payload);

            if (result.status === 201) {
                notify(result.message, "success");
                navigate("/login");
            } else if (result.status === 409 || result.status === 400) {
                setFormError({ ...formError, ...result.message });
            }
        } catch (err) {
            setError((err as Error).message);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

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
        >
            <Typography variant="h5" mb={2}>
                Sign Up
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={register}>

                {/* FIRSTNAME */}
                <TextField
                    fullWidth
                    label="Firstname"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    error={!!formError.firstname}
                    helperText={formError.firstname}
                    sx={{ mb: 2 }}
                />

                {/* LASTNAME */}
                <TextField
                    fullWidth
                    label="Lastname"
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
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={!!formError.email}
                    helperText={formError.email}
                    sx={{ mb: 2 }}
                />

                {/* PHONE */}
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

                {/* PASSWORD */}
                <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    error={!!formError.password}

                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* CONFIRM PASSWORD */}
                <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    error={!!formError.password}
                    helperText={formError.password}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />

                {/* SUBMIT */}
                <Button
                    fullWidth
                    type="submit"
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

export default SignUp;
