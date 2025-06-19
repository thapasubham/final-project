import {useEffect, useState } from "react";
import {Typography} from "@mui/material";
interface colorPickerProps {
    color: string,
    label: string,
    onChange: (color: string) => void,
}
function ColorPicker({color, label, onChange}: colorPickerProps) {
    const [colorValue, setColorValue] = useState(color);

    useEffect(() => {
        setColorValue(color);
    }, [color]);

    const handleChange =(e) =>{

        setColorValue(e.target.value);
        onChange(e.target.value);
    }
    return (
        <>
            <Typography variant="body2" color="textSecondary" component="div">
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
                    cursor: "pointer"
                }}
                aria-label="Select text color"
            />
            <Typography variant="body1" sx={{ ml: 1 }}>
                {colorValue.toUpperCase()}
            </Typography>
        </>
    )
}

export default ColorPicker ;