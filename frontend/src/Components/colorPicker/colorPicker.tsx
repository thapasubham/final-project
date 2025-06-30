import { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
interface colorPickerProps {
    color: string,
    label: string,
    onChange: (color: string) => void,
}
function ColorPicker({ color, label, onChange }: colorPickerProps) {
    const [colorValue, setColorValue] = useState(color);

    useEffect(() => {
        setColorValue(color);
    }, [color]);

    const handleChange = (e) => {

        setColorValue(e.target.value);
        onChange(e.target.value);
    }
    return (
        <>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1, p: 1 }}>                <Typography
                variant="subtitle2"
                color="text.secondary"

            >
                {label}
            </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                        component="input"
                        type="color"
                        value={colorValue}
                        onChange={handleChange}
                        sx={{
                            width: 50,
                            height: 40,
                            border: "none",
                            borderRadius: 1,
                            cursor: "pointer",
                            padding: 0.5,
                            backgroundColor: 'background.paper',
                            '&:hover': {
                                boxShadow: 1
                            }
                        }}
                        aria-label={`Select ${label.toLowerCase()}`}
                    />
                    <TextField value={colorValue} onChange={handleChange} sx={{
                        p: 1,

                        '& input': {
                            padding: '8.5px 8.5px 8.5px 8.5px',
                            textTransform: 'uppercase'
                        }
                    }}

                    />
                </Box>
            </Box >
        </>
    )
}

export default ColorPicker;