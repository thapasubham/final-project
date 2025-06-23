import {Box, Button, Container, Slider, TextField, Typography} from "@mui/material";
import PreviewList from "../fontPreview/PreviewList.tsx";
import {useState} from "react";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import type {preview} from "../../types/previewTypes.ts";
import ColorPicker from "../colorPicker/colorPicker.tsx";


const initialPreview: preview =
    {
        text: "You are currently previewing the texts",
        size: 14,
        color: "#000000",
        backgroundColor: "#FFFFFF"
    }
function Page() {
    const [preview, setPreview] = useState<preview>(initialPreview);

    return (
        <>
        <Container maxWidth="sm" >

            <Container sx={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
                multiline={true}
                value={preview.text}
                onChange={(e) =>
                    setPreview({ ...preview, text: e.target.value })
                }
                maxRows={4}
                minRows={4}
                variant="outlined"
                label="Enter preview text"
                slotProps={{ htmlInput: { maxLength: 80 } }}
            />
                <Button variant="text" onClick={()=>setPreview(initialPreview)}><RestartAltIcon/>Reset all</Button>
            </Container>

              <ColorPicker  color={preview.color}
                            onChange={(newColor) => setPreview({...preview, color: newColor})}
                            label="Text color"
              />

            <ColorPicker  color={preview.backgroundColor}
                          onChange={(newColor) => setPreview({...preview, backgroundColor: newColor})}
                          label="Background color"
            />


            <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{preview.size}px</Typography>
                <Slider
                min={8}
                max={50}
                size="small"
                defaultValue={70}
                aria-label="Small"
                valueLabelDisplay="auto"
                value={preview.size}
                onChange={(_, value) =>setPreview({ ...preview, size: value })} />

        </Box>

        </Container>
        <PreviewList preview={preview}
        />


</>

    );
}

export default Page;