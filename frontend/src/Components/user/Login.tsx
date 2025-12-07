import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Checkbox,
    FormControlLabel,
    Alert,
    Card,
    CardContent,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import loginUser from "../../api/user/login.ts";
import { useNavigate } from "react-router-dom";
import { AxiosError, isAxiosError } from "axios";
import { LOGGED_IN_SUCCESS } from "../../constants/constant.ts";
import { setTokens } from "../../api/refresh/setTokens.ts";

function Login() {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState("users");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    function userInput(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const data = await loginUser(user);

            if (data.status === 200) {
                setTokens(data.message,);
                alert(LOGGED_IN_SUCCESS);

                setError("");
                navigate("/");
            } else {
                setError(data.message);
            }
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                const msg = (error as AxiosError).response?.data.message;
                setError(msg);
            } else {
                setError((error as Error).message);
            }
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                mx: "auto",
                mt: 8,
            }}
        >
            <Card elevation={4}>
                <CardContent>

                    <Typography variant="h5" mb={2} textAlign="center">
                        Login
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>

                        {/* EMAIL FIELD */}
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={user.email}
                            onChange={userInput}
                            sx={{ mb: 2 }}
                            required
                        />

                        {/* PASSWORD FIELD */}
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={user.password}
                            onChange={userInput}
                            sx={{ mb: 2 }}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* SUBMIT BUTTON */}
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                        >
                            Submit
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Login;
