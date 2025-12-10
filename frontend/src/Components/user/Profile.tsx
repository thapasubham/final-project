import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    Alert,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getUserByid } from "../../api/user/getUserByid.ts";
import { Refresh } from "../../api/refresh/refresh.ts";
import { useAuth } from "../../auth/AuthContext.tsx";
import { UserType } from "../../types/userType.ts";

export function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { userID, userStatus } = useAuth();

    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [allowEdit, setAllowEdit] = useState(false);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(false);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await getUserByid(Number(id));

            if (response.status === 200) {
                const data = response.data;

                setUser(data);
                setRole(data.role);
                setAllowEdit(
                    userStatus === UserType.ADMIN || Number(userID) === data.id
                );

                setError("");
            } else if (response.status === 401 && !retry) {
                // Attempt token refresh
                const result = await Refresh(userStatus);
                if (result) {
                    setRetry(true);
                } else {
                    navigate("/login");
                }
            } else {
                setError(response.data?.message || "Failed to load user.");
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [retry, id]);

    return (
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>
            <Typography variant="h5" mb={3} align="center" fontWeight={600}>
                Profile
            </Typography>

            {loading && (
                <Box textAlign="center" mb={2}>
                    <CircularProgress />
                </Box>
            )}

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!loading && !error && user && (
                <Card elevation={3}>
                    <CardContent>
                        {/* Name + Edit Button */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <Typography variant="body1">
                                <strong>Name:</strong> {user.firstname} {user.lastname}
                            </Typography>

                            {allowEdit && (
                                <Button
                                    component={Link}
                                    to={`/editUser/${user.id}`}
                                    variant="contained"
                                    size="small"
                                >
                                    Edit
                                </Button>
                            )}
                        </Box>

                        {/* Email */}
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Email:</strong> {user.email}
                        </Typography>

                        {/* Phone */}
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Phone:</strong> {user.phoneNumber}
                        </Typography>

                        {/* Role */}
                        <Typography variant="body1">
                            <strong>Role:</strong> {role?.name === "default" ? "User" : role?.name || "Unknown"}
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}

export default Profile;
