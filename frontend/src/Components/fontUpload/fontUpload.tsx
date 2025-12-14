import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    CircularProgress,
    Typography,
    Alert,
    InputAdornment,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../../utils/config";
import { Refresh } from "../../api/refresh/refresh";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../notification/notificationContext";
import { fontUpload } from "../../api/upload/fontUpload";
import { useAuth } from "../../auth/AuthContext";
import { capitalizeFirst } from "../../utils/utils";

interface Language {
    id: number;
    name: string;
}

export default function FontUploadForm() {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLangs, setSelectedLangs] = useState<number[]>([]);
    const [fontName, setFontName] = useState("");
    const [price, setPrice] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const { userID } = useAuth();
    const navigate = useNavigate();
    const notify = useNotification();
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/lang`);
                setLanguages(res.data);
            } catch (err) {
                console.error("Failed to fetch languages:", err);
            }
        };
        fetchLanguages();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return setError("Please select a font file.");
        if (!price || isNaN(Number(price))) return setError("Please enter a valid price.");

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("name", fontName);
        formData.append("price", price);
        formData.append("font-file", file);
        formData.append("createdBy", userID.toString());
        selectedLangs.forEach(langId => formData.append("lang_id[]", langId.toString()));

        try {
            let res;
            try {
                res = await fontUpload(formData);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    const refreshed = await Refresh();
                    if (!refreshed) {
                        notify("Session expired. Please log in again.", "warning");
                        navigate("/login");
                        return;
                    }
                    res = await fontUpload(formData);
                } else {
                    throw err;
                }
            }

            notify("Font uploaded successfully!", "success");
            // navigate("/"); // or wherever you want to redirect
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Upload failed");
            notify(err.message || "Upload failed", "error");
        } finally {
            setLoading(false);
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
                background: "linear-gradient(270deg, rgba(255,150,255,0.04) 0%, rgba(100,255,255,0.1) 100%)",
            }}
        >
            <Typography variant="h5" mb={2}>
                Upload Font
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Font Name"
                    value={fontName}
                    onChange={(e) => setFontName(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    label="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />

                <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
                    Select Font File
                    <input
                        type="file"
                        accept=".woff,.woff2,.ttf"
                        hidden
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                </Button>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Languages</InputLabel>
                    <Select
                        multiple
                        value={selectedLangs}
                        onChange={(e) => setSelectedLangs(e.target.value as number[])}
                        label="Languages"
                    >
                        {languages.map(lang => (
                            <MenuItem key={lang.id} value={lang.id}>
                                {capitalizeFirst(lang.name)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: "none",
                        background: "linear-gradient(90deg, rgba(0,0,250,0.3) 0%, rgba(0,0,255,0.5) 100%)",
                        fontWeight: 600,
                        fontSize: "1rem",
                    }}
                >
                    {loading ? <CircularProgress size={24} /> : "Upload Font"}
                </Button>
            </form>
        </Box>
    );
}

