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

            <Box sx={{ border: 1, padding: 1, borderRadius: 2, gap: 3 }}>
                <Typography maxWidth={"auto"} color="textSecondary" component="div">
                    {label}
                </Typography>
                <input
                    type="color"
                    value={colorValue}
                    onChange={handleChange}
                    style={{
                        width: 60,
                        height: 40,
                        border: "none",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        padding: 5
                    }}
                    aria-label="Select text color"
                />
                <TextField value={colorValue} onChange={handleChange} />

            </Box>
        </>
    )
}

export default ColorPicker;