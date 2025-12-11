import { Container, Box, Typography } from "@mui/material";

function About() {
    const year = new Date().getUTCFullYear();

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 6 }}>
                <Typography color= "gray" variant="h3" component="h1" gutterBottom>
                    About Us
                </Typography>
            <Box color="text.primary">
                <Typography variant="body1">
                    Welcome to <strong>FontHub</strong> — a curated marketplace of premium
                    typefaces crafted for designers, developers, and brands. Our mission is to
                    provide beautiful, functional, and high-quality fonts that elevate creative work.
                </Typography>

                <Typography variant="body1">
                    From clean minimal typography to expressive display fonts, every typeface in our
                    collection is designed with precision, versatility, and creativity in mind.
                </Typography>

                <Typography variant="body1">
                    Whether you’re building a brand identity, designing a website, or creating
                    digital artwork, we offer fonts that help your ideas stand out and communicate
                    with impact.
                </Typography>

                <Typography variant="caption" color="text.secondary">
                    © {year} FontHub. All rights reserved.
                </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default About;
