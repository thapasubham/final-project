import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.tsx";

export default function NavBar() {
    const { isLogged, userID, userStatus } = useAuth();

    // Shared button style for glass + hover effect
    const buttonStyle = {
        color: "black",
        mx: 1,
        px: 2,
        borderRadius: 2,
        border: "1px solid rgba(255,255,255,0)",
        transition: "0.1s ease",
        "&:hover": {
            transform: "scale(1.01)",
            border: "1px solid rgba(255,255,255,0.5)",
            background: "rgba(50,150,255,0.1)",
            backdropFilter: "blur(4px) ",

        },
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                zIndex: 13000,
                width: "100%",
                borderBottomRightRadius: 8,
                borderBottomLeftRadius: 8,
                background: "linear-gradient(90deg, rgba(0,255,250,0.2) 0%, rgba(80,0,252,0.1) 100%)",
                backdropFilter: "blur(4px) ",
                // WebkitBackdropFilter: "blur(12px) brightness(110%)",

                border: "1px solid rgba(255, 255, 255, 0.25)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
        >
            <Toolbar>
                {/* Left navigation */}
                <Button component={Link} to="/" sx={buttonStyle}>
                    Home
                </Button>
                <Button component={Link} to="/about" sx={buttonStyle}>
                    About
                </Button>

                <Box sx={{ flexGrow: 1 }} />

                {isLogged ? (
                    <>

                        {userStatus == "admin" && <Button component={Link} to="/dashboard" sx={buttonStyle}>
                            Dashboard
                        </Button>
                        }
                        <Button component={Link} to={`/profile/${userID}`} sx={buttonStyle}>
                            Profile
                        </Button>
                        <Button component={Link} to="/logout" sx={buttonStyle}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button component={Link} to="/login" sx={buttonStyle}>
                            Login
                        </Button>
                        <Button component={Link} to="/signup" sx={buttonStyle}>
                            Sign Up
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}
