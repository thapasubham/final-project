import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Alert,
    Card,
    CardContent,
    CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import loginUser from "../../api/user/login.ts";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { LOGGED_IN_SUCCESS } from "../../constants/constant.ts";
import { setTokens } from "../../api/refresh/setTokens.ts";
import { useAuth } from "../../auth/AuthContext.tsx";
import { useNotification } from "../../notification/notificationContext.tsx";

function Login() {
    const [user, setUser] = useState({ email: "", password: "" });
    const { isLogged, setIsLogged, setUserID, setUserStatus, setUserPermission } = useAuth();
    const notify = useNotification();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Helper for delay
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Navigate back if already logged in
    useEffect(() => {
        if (isLogged) {
            notify("Already logged in", "warning");
            delay(500).then(() => {
                if (window.history.length > 1) {
                    navigate(-1);
                } else {
                    navigate("/dashboard");
                }
            });
        }
    }, []);

    const userInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await loginUser(user);

            if (data.status === 200) {
                setTokens(data.message);
                setIsLogged(true);
                setUserID(data.message.id);
                setUserStatus(data.message.role);
                setUserPermission(data.message.permissions);

                notify(LOGGED_IN_SUCCESS, "success");
                setError("");

                // Wait 500ms for notification before navigating
                await delay(500);
                if (window.history.length > 1) {
                    navigate(-1);
                } else {
                    navigate("/dashboard");
                }

            } else {
                setError(data.message);
            }
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                setError(error.response.data.message);
            } else {
                setError((error as Error).message);
            }
        } finally {
            setLoading(false)
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
            <Card elevation={4}>
                <CardContent>
                    <Typography variant="h5" mb={2} textAlign="center">
                        Login
                    </Typography>

                    {isLogged && <Alert severity="warning" sx={{ mb: 2 }}>Already Logged In</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {isLogged ? <CircularProgress /> : (
                        <form onSubmit={handleSubmit}>
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
                                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button fullWidth variant="contained" type="submit" disabled={loading}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    textTransform: "none",
                                    background: "linear-gradient(90deg, rgba(0,0,250,0.3) 0%, rgba(0,0,255,0.5) 100%)",
                                    fontWeight: 600,
                                    fontSize: "1rem"
                                }}>
                                {loading ? <CircularProgress size={24} /> : "Submit"}
                            </Button>

                        </form>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

export default Login;
