import { Box, Button, Card, Container, Divider, InputAdornment, Paper, Slider, TextField, Typography } from "@mui/material";
import PreviewList from "../fontPreview/PreviewList.tsx";
import { useEffect, useRef, useState } from "react";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import type { preview } from "../../types/previewTypes.ts";
import ColorPicker from "../colorPicker/colorPicker.tsx";
import { useSearchParams } from "react-router-dom";
import LanguageList from "../langugeList/langugeList.tsx";
import { Restore } from "@mui/icons-material";

const initialPreview: preview = {

    size: 14,
    color: "#000000",
    backgroundColor: "#FFFFFF"
}

function Page() {
    const [searchParam, setParam] = useSearchParams();
    const [reset, setReset] = useState(false);
    const text = searchParam.get("text") || "";
    const color = searchParam.get("color") || "";
    const backgroundColor = searchParam.get("bgColor") || "";
    const size = Number(searchParam.get("size") || NaN);
    const [languageText, setLanguage] = useState(false);
    const [previewText, setPreviewText] = useState(text || "");

    const param: preview = {
        size: !isNaN(size) ? size : initialPreview.size,
        color: color || initialPreview.color,
        backgroundColor: backgroundColor || initialPreview.backgroundColor
    };

    const [preview, setPreview] = useState<preview>(param);

    useEffect(() => {

        searchParam.set("text", previewText);
        searchParam.set("color", preview.color);
        searchParam.set("bgColor", preview.backgroundColor);
        searchParam.set("size", preview.size.toString());


        const delay = setTimeout(() => {
            setParam(searchParam);
        }, 200)
        return () => clearTimeout(delay);
    }, [preview, previewText]);

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            width: "100vw",
            height: "100vh",
            overflow: "hidden"
        }}>
            {/* Controls Panel - Fixed width */}
            <Paper sx={{
                p: 1,
                width: "20%",
                height: "100%",
                m: 0,
                borderRadius: 0,
                boxShadow: 3
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <TextField
                        multiline
                        fullWidth
                        onFocus={() => setLanguage(true)}
                        onBlur={() => {
                            setTimeout(() => {
                                setLanguage(false);
                            }, 150);
                        }}
                        value={previewText}
                        onChange={(e) => setPreviewText(e.target.value)}
                        maxRows={6}
                        minRows={5}
                        variant="outlined"
                        label="Enter text to preview"
                        slotProps={{ htmlInput: { maxLength: 100 } }}
                        sx={{ mb: 2, position: "sticky", top: 0 }}
                    />
                    {languageText && (
                        <Paper
                            sx={{
                                overflow: "auto",
                                maxHeight: 150,
                            }}>
                            <LanguageList userText={previewText}
                                onSelect={(selectedText) => {
                                    setPreviewText(selectedText);

                                }} />
                        </Paper>)}
                    <Typography
                        variant="body1"
                        sx={{
                            mt: 1,
                            color: 'text.secondary',
                            fontWeight: 'medium',


                        }}
                    > {`${previewText.length}/100 characters`}</Typography>

                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Button
                            variant="text"
                            onClick={() => {
                                setReset(true)
                                setPreview(initialPreview);
                                setPreviewText("")

                            }}
                            sx={{
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <RestartAltIcon sx={{ mr: 1 }} />
                            Reset all
                        </Button>
                        <Button onClick={() => setReset(true)}><Restore />Reset Filter</Button>
                    </Box>
                </Box><Divider />
                <Box sx={{ display: "flex", flexDirection: "column", p: 1, gap: 1 }}>
                    <ColorPicker
                        color={preview.color}
                        onChange={(newColor) => setPreview({ ...preview, color: newColor })}
                        label="Text color"
                    />
                    <ColorPicker
                        color={preview.backgroundColor}
                        onChange={(newColor) => setPreview({ ...preview, backgroundColor: newColor })}
                        label="Background color"
                    />
                </Box>
                <Divider />
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 1,
                    alignItems: "center", gap: 1
                }}>
                    <Typography variant="body1">Size:</Typography>
                    <TextField
                        size="small"
                        type="number"
                        variant="standard"
                        value={preview.size}
                        onChange={(e) => setPreview({ ...preview, size: Number(e.target.value) })}
                        slotProps={{
                            htmlInput: { min: 8, max: 100, },
                            input: { endAdornment: (<InputAdornment position="end">px</InputAdornment>) }
                        }}

                    />
                    <Slider
                        min={8}
                        max={100}
                        size="small"
                        valueLabelDisplay="auto"
                        value={preview.size}
                        onChange={(_, value) => setPreview({ ...preview, size: value as number })}
                        sx={{ width: "100%" }}
                    />
                </Box>

            </Paper >

            {/* Preview Area - Takes remaining space */}
            < Box sx={{
                width: "100vw",
                overflow: "auto",
            }
            }>
                <PreviewList previewText={previewText} preview={preview} reset={reset} setReset={setReset} />
            </Box >

        </Box >
    );
}

export default Page;