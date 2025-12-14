import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Stack,
    Button,
    Pagination,
    Select,
    MenuItem,
    IconButton,
} from "@mui/material";
import { useNotification } from "../../notification/notificationContext";
import { getUserPurchases } from "../../api/payment/getUserPurchases";
import { Refresh } from "../../api/refresh/refresh";
import { Download } from "@mui/icons-material";
import { useAuth } from "../../auth/AuthContext";
import { API_URL } from "../../utils/config";
import { getCookie } from "../../api/apiHelpers";
import { downloadFont } from "../../api/download/download";

const PurchaseHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const notify = useNotification();
    const { userID } = useAuth();
    const [purchases, setPurchases] = useState<any[]>([]);
    const [meta, setMeta] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<"name" | "price" | "purchasedAt">(
        "purchasedAt"
    );
    const [order, setOrder] = useState<"ASC" | "DESC">("DESC");

    const fetchPurchases = async () => {
        if (!id) return;
        setLoading(true);

        try {
            let response = await getUserPurchases(
                Number(id),
                page,
                5,
                sortBy,
                order
            );

            if (response.status === 401) {
                const refreshed = await Refresh();
                if (!refreshed) {
                    notify("Session expired. Please log in again.", "warning");
                    navigate("/login");
                    return;
                }
                response = await getUserPurchases(
                    Number(id),
                    page,
                    5,
                    sortBy,
                    order
                );
            }

            if (response.status === 200) {
                setPurchases(response.data.data);
                setMeta(response.data.meta);
            } else {
                console.log(response.data);
                notify(response.data.message, "error");
            }
        } catch (err: any) {
            notify(err.message, "error");
        } finally {
            setLoading(false);
        }
    };
    const download = async (fontId: number) => {
        try {
            let response = await downloadFont(fontId, userID);

            if (response.status === 401) {
                const refreshed = await Refresh();
                if (!refreshed) {
                    notify("Session expired. Please log in again.", "warning");
                    navigate("/login");
                    return;
                }
            }
            else {
                response = await downloadFont(fontId, userID);
                if (!response.ok) throw new Error("Download failed");

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                const str = Math.random().toString(36).substring(2, 12);

                a.download = `font_${str}.woff2`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (err: any) {
            console.error(err.message);
            alert(err.message);
        }
    };
    useEffect(() => {
        fetchPurchases();
    }, [id, page, sortBy, order]);

    return (
        <Box maxWidth="600px" mx="auto" mt={8} mb={4}>
            <Typography variant="h4" fontWeight={700} mb={3} textAlign="center">
                Purchase History
            </Typography>

            {/* Sorting */}
            <Box display="flex" gap={2} mb={3}>
                <Select
                    fullWidth
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                >
                    <MenuItem value="purchasedAt">Purchase Date</MenuItem>
                    <MenuItem value="name">Font Name</MenuItem>
                    <MenuItem value="price">Price</MenuItem>
                </Select>

                <Select
                    value={order}
                    onChange={(e) => setOrder(e.target.value as any)}
                >
                    <MenuItem value="DESC">DESC</MenuItem>
                    <MenuItem value="ASC">ASC</MenuItem>
                </Select>
            </Box>

            {loading ? (
                <Box textAlign="center" py={4}>
                    <CircularProgress />
                </Box>
            ) : purchases.length === 0 ? (
                <Typography textAlign="center" color="text.secondary">
                    No purchases found.
                </Typography>
            ) : (
                <Stack spacing={2}>
                    {purchases.map((purchase) => (
                        <Card key={purchase.id} variant="outlined">
                            <CardContent>
                                <Typography fontWeight={600}>
                                    {purchase.font.name}
                                    {purchase.user.id == userID &&
                                        <IconButton onClick={() => download(purchase.font.id)}>
                                            <Download />
                                        </IconButton>}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ${purchase.font.price}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Purchased on{" "}
                                    {new Date(purchase.purchasedAt).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={meta.totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                    />
                </Box>
            )}

            <Box mt={4}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(`/profile/${id}`)}

                    sx={{
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 2,
                        background: "linear-gradient(90deg, rgba(0, 100, 255, 0.2) 0%, rgba(0,20, 255, 0.15) 100%)",
                    }}
                >
                    Back to Profile
                </Button>
            </Box>
        </Box>
    );
};

export default PurchaseHistory;
