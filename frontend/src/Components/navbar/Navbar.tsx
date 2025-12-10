import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.tsx";

function NavBar() {
    const { isLogged, userID } = useAuth();

    return (
        <AppBar position="sticky" sx={{
            zIndex: 13000,
            widows: "50vw",
            borderRadius: 2,

        }}>
            <Toolbar>

                {/* Left section (logo or home link) */}
                <Button
                    component={Link}
                    to="/"
                    color="inherit"
                    sx={{ mr: 2 }}
                    data-testid="link_home"
                >
                    Home
                </Button>

                <Button
                    component={Link}
                    to="/about"
                    color="inherit"
                    data-testid="link_about"
                >
                    About
                </Button>

                {/* Push remaining items to the right */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Auth-dependent links */}
                {isLogged ? (
                    <>
                        <Button
                            component={Link}
                            to="/dashboard"
                            color="inherit"
                            data-testid="link_dashboard"
                        >
                            Dashboard
                        </Button>

                        <Button
                            component={Link}
                            to={`/profile/${userID}`}
                            color="inherit"
                        >
                            Profile
                        </Button>

                        <Button
                            component={Link}
                            to="/logout"
                            color="inherit"
                            data-testid="link_profile"
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            component={Link}
                            to="/login"
                            color="inherit"
                            data-testid="link_login"
                        >
                            Login
                        </Button>

                        <Button
                            component={Link}
                            to="/signup"
                            color="inherit"
                            data-testid="link_signup"
                        >
                            Sign Up
                        </Button>
                    </>
                )}

            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
