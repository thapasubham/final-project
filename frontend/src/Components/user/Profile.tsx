import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Avatar,
    Chip,
    Stack,
    Divider,
    Container
} from "@mui/material";
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    Edit as EditIcon,
    AdminPanelSettings as AdminIcon,
    VerifiedUser as UserIcon
} from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getUserByid } from "../../api/user/getUserByid.ts";
import { Refresh } from "../../api/refresh/refresh.ts";
import { useAuth } from "../../auth/AuthContext.tsx";
import { UserType } from "../../types/userType.ts";
import { useNotification } from "../../notification/notificationContext.tsx";
import { ProfileSkeleton } from "../skeleton/profile.tsx";

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
    const notify = useNotification()

    const fetchUser = async () => {
        setLoading(true);
        setError("");
        try {
            let response = await getUserByid(Number(id));

            // If 401, try refreshing token
            if (response.status === 401) {
                const refreshed = await Refresh(userStatus); // should update token in storage/axios headers
                if (refreshed) {
                    response = await getUserByid(Number(id)); // retry
                } else {
                    navigate("/login");
                    return;
                }
            }

            if (response.status === 200) {
                const data = response.data;
                notify("User loaded successfully", "success");
                setUser(data);
                setRole(data.role);
                setAllowEdit(userStatus === UserType.ADMIN || Number(userID) === data.id);
            } else {
                notify(response.data?.message || "Failed to load user.", "error");
                setError(response.data?.message || "Failed to load user.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUser();
    }, [retry, id]);

    // Helper to get initials
    const getInitials = (first: string, last: string) => {
        return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
            {loading && (
                <Box textAlign="center" mb={2}>
                    <ProfileSkeleton />
                </Box>
            )}

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!loading && !error && user && (
                <Card
                    elevation={4}
                    sx={{
                        borderRadius: 4,
                        overflow: "visible", // Allow avatar to overflow
                        position: "relative",
                        mt: 8 // Space for the negative margin avatar
                    }}
                >
                    {/* Gradient Header */}
                    <Box
                        sx={{
                            height: 140,
                            background: "linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)",
                            borderRadius: "16px 16px 0 0",
                        }}
                    />

                    <CardContent sx={{ pt: 0, px: 3, pb: 4 }}>
                        {/* Avatar Wrapper */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: -8, // Pull avatar up
                                mb: 2
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    fontSize: "3rem",
                                    bgcolor: "primary.main",
                                    border: "4px solid white",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                }}
                            >
                                {getInitials(user.firstname, user.lastname)}
                            </Avatar>
                        </Box>

                        {/* User Info */}
                        <Stack spacing={2} alignItems="center">
                            <Box textAlign="center">
                                <Typography variant="h4" fontWeight={700} color="text.primary">
                                    {user.firstname} {user.lastname}
                                </Typography>
                                <Stack direction="row" spacing={1} justifyContent="center" mt={1}>
                                    <Chip
                                        icon={role?.name === "admin" ? <AdminIcon fontSize="small" /> : <UserIcon fontSize="small" />}
                                        label={role?.name === "user" ? "User" : role?.name || "Member"}
                                        color={role?.name === "admin" ? "error" : "primary"}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Stack>
                            </Box>

                            <Divider flexItem sx={{ width: "100%", my: 2 }} />

                            {/* Contact Details */}
                            <Box width="100%">
                                <Stack spacing={2}>
                                    <Box display="flex" alignItems="center" bgcolor="action.hover" p={1.5} borderRadius={2}>
                                        <EmailIcon color="action" sx={{ mr: 2 }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Email Address
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box display="flex" alignItems="center" bgcolor="action.hover" p={1.5} borderRadius={2}>
                                        <PhoneIcon color="action" sx={{ mr: 2 }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Phone Number
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {user.phoneNumber || "N/A"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Box>

                            {/* Actions */}
                            {allowEdit && (
                                <Box width="100%" mt={2}>
                                    <Button
                                        component={Link}
                                        to={`/editUser/${user.id}`}
                                        variant="contained"
                                        endIcon={<EditIcon />}
                                        fullWidth
                                        sx={{
                                            borderRadius: 2,
                                            py: 1.5,
                                            textTransform: "none",
                                            fontWeight: 600,
                                            fontSize: "1rem"
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                </Box>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}

export default Profile;
