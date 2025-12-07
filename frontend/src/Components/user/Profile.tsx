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
    const { id, userType } = useParams();
    const { userID, userStatus } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        id: 0,
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
    });

    const [role, setRole] = useState({ name: "" });

    const [loading, setLoading] = useState(false);
    const [allowEdit, setAllowEdit] = useState(false);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(false);

    const fetchUser = async () => {
        setLoading(true);

        try {
            const response = await getUserByid(Number(id), userType);

            if (response.status === 200) {
                const data = response.data;

                setUser((prev) => ({ ...prev, ...data }));
                setRole((prev) => ({ ...prev, ...data.role }));

                if (userStatus === UserType.ADMIN || userID === data.id) {
                    setAllowEdit(true);
                }

                setError("");
                setLoading(false);
            }

            if (response.status === 401 && !retry) {
                const result = await Refresh(userStatus);

                if (result) {
                    setRetry(true);
                    setError("");
                } else {
                    navigate("/login");
                }
            } else {
                const message = response.data.message;
                setLoading(false);
                setError(message);
            }
        } catch (e) {
            setError((e as Error).message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [retry, id, userType]);

    return (
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>

            <Typography variant="h5" mb={2} align="center">
                Profile
            </Typography>

            {loading && (
                <Box textAlign="center">
                    <CircularProgress />
                </Box>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && (
                <Card elevation={3}>
                    <CardContent>

                        {/* NAME + EDIT BUTTON */}
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
                                    to={`/editUser/${user.id}/${userType}`}
                                    variant="contained"
                                    size="small"
                                >
                                    Edit
                                </Button>
                            )}
                        </Box>

                        {/* EMAIL */}
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Email:</strong> {user.email}
                        </Typography>

                        {/* PHONE */}
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Phone:</strong> {user.phoneNumber}
                        </Typography>

                        {/* ROLE */}
                        <Typography variant="body1">
                            <strong>Role:</strong> {role?.name || "Unknown"}
                        </Typography>

                    </CardContent>
                </Card>
            )}
        </Box>
    );
}

export default Profile;
