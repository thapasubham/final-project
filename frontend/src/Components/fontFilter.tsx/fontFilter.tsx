import { Search, ArrowForward } from "@mui/icons-material";
import { ToggleButtonGroup, ToggleButton, Box, TextField, InputAdornment, Button } from "@mui/material";

function FontFilter(){
    return (
        <>
         <ToggleButtonGroup
                color="secondary"
                value={language}
                exclusive
                onChange={handleChange}
                aria-label="Language"
                sx={{
                    gap: 1,
                    '& .MuiToggleButton-root': {
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        fontWeight: 500,
                        textTransform: 'capitalize',
                        border: '1px solid #ccc',
                    },
                }}
            >
                <ToggleButton value="english">English</ToggleButton>
                <ToggleButton value="nepali">Nepali</ToggleButton>
                <ToggleButton value="chinese">Chinese</ToggleButton>
            </ToggleButtonGroup>
            <Box>

                <TextField type="text" placeholder="Search fonts"
                    variant="standard"
                    size="small"
                    value={search}
                    onChange={handleText}
                    slotProps={{
                        input: {
                            startAdornment: (<InputAdornment position="start">
                                <Search sx={{ fontSize: 20 }} />
                            </InputAdornment>)
                        }
                    }}
                    sx={{ borderRadius: 5 }}
                />
                <Button
                    variant="text"
                    onClick={() => setOrderby((prev) => (prev === "ASC" ? "DESC" : "ASC"))}
                    size="small"
                >
                    {order_by === "ASC" ? (<>A<ArrowForward fontSize="small" />Z</>) : (<>Z<ArrowForward fontSize="small" />A</>)}
                </Button>
            </Box>
        </>
    )
}