import { Box, Button, Container, InputAdornment, Slider, TextField, Typography } from "@mui/material";
import PreviewList from "../fontPreview/PreviewList.tsx";
import { useEffect, useRef, useState } from "react";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import type { preview } from "../../types/previewTypes.ts";
import ColorPicker from "../colorPicker/colorPicker.tsx";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";


const initialPreview: preview =
{
    text: "You are currently previewing the texts",
    size: 14,
    color: "#000000",
    backgroundColor: "#FFFFFF"
}
function Page() {
    const [searchParam, setParam] = useSearchParams();
    const navigate = useNavigate();
    const hasMounted = useRef(false);



    const text = searchParam.get("text") || "";
    const color = searchParam.get("color") || "";
    const backgroundColor = searchParam.get("backgroundColor") || "";
    const size = Number(searchParam.get("size") || NaN);

    const param: preview = {
        text: text || initialPreview.text,
        size: !isNaN(size) ? size : initialPreview.size,
        color: color || initialPreview.color,
        backgroundColor: backgroundColor || initialPreview.backgroundColor
    };

    const [preview, setPreview] = useState<preview>(param);


    useEffect(() => {



        const newParams = {
            text: preview.text,
            color: preview.color,
            backgroundColor: preview.backgroundColor,
            size: preview.size.toString(),
        };


        console.log(param)
        const delay = setTimeout(() => {

            return setParam(newParams);


        }, 200)
        return () => clearTimeout(delay);
    }, [preview]);
    return (
        <>

            <Container sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center", justifyContent: "center" }} >

                <Box>
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
                    <Button variant="text" onClick={() => setPreview(initialPreview)}><RestartAltIcon />Reset all</Button>

                    <Container sx={{ display: "flex", justifyContent: "space-evenly", gap: 1, margin: 1 }} >
                        <ColorPicker color={preview.color}
                            onChange={(newColor) => setPreview({ ...preview, color: newColor })}
                            label="Text color"
                        />

                        <ColorPicker color={preview.backgroundColor}
                            onChange={(newColor) => setPreview({ ...preview, backgroundColor: newColor })}
                            label="Background color"
                        />

                    </Container>
                    <Container sx={{ display: "flex", flexDirection: "row", padding: 3, gap: 1 }}>
                        <Typography>Size:</Typography>

                        <TextField
                            size="small"
                            type="number"
                            variant="standard"
                            value={preview.size}
                            onChange={(e) =>
                                setPreview({ ...preview, size: Number(e.target.value) })
                            }
                            slotProps={{
                                htmlInput: { min: 8, max: 100, },
                                input: { endAdornment: (<InputAdornment position="end">px</InputAdornment>) }
                            }}
                            sx={{
                                textAlign: 'right',
                                width: 70,

                            }}
                        />


                        <Slider
                            min={8}
                            max={100}
                            size="small"
                            valueLabelDisplay="auto"

                            value={preview.size}
                            onChange={(_, value) => setPreview({ ...preview, size: value })} />



                    </Container >
                </Box>
                <PreviewList preview={preview}

                />
            </Container >

        </>

    );
}

export default Page;