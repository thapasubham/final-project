import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Unauthorized() {
    return (
        <Box
            sx={{
                color: "black",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                textAlign: "center",
            }}
        >
            <Typography variant="h3" fontWeight="bold">
                403
            </Typography>

            <Typography variant="h5">
                You are not authorized to access this page.
            </Typography>

            <Button
                variant="contained"
                component={Link}
                to="/"
                sx={{ mt: 2 }}
            >
                Go Home
            </Button>
        </Box>
    );
}
