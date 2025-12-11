import { Box, Card, CardContent, Skeleton, Stack, Container, Divider } from "@mui/material";

export function ProfileSkeleton() {
    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Card elevation={4} sx={{ borderRadius: 4, overflow: "visible", mt: 8 }}>
                {/* Gradient header */}
                <Box
                    sx={{
                        height: 140,
                        background: "linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)",
                        borderRadius: "16px 16px 0 0",
                    }}
                />

                <CardContent sx={{ pt: 0 }}>
                    {/* Avatar */}
                    <Box display="flex" justifyContent="center" mt={-8} mb={2}>
                        <Skeleton
                            variant="circular"
                            width={120}
                            height={120}
                            animation="wave"
                        />
                    </Box>

                    <Stack spacing={2} alignItems="center">
                        {/* Name */}
                        <Skeleton variant="text" width="60%" height={40} animation="wave" />

                        {/* Role chip */}
                        <Skeleton variant="rectangular" width={100} height={30} animation="wave" sx={{ borderRadius: 1 }} />

                        <Divider flexItem sx={{ width: "100%", my: 2 }} />

                        {/* Contact info */}
                        <Stack spacing={2} width="100%">
                            <Skeleton variant="rectangular" width="100%" height={50} animation="wave" sx={{ borderRadius: 2 }} />
                            <Skeleton variant="rectangular" width="100%" height={50} animation="wave" sx={{ borderRadius: 2 }} />
                        </Stack>

                        {/* Edit button */}
                        <Skeleton variant="rectangular" width="100%" height={50} animation="wave" sx={{ borderRadius: 2, mt: 2 }} />
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}
