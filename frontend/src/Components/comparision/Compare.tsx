import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, TextField, Paper } from "@mui/material";
import { drawFullText } from "../../utils/fontComparision";
import LanguageList from "../langugeList/langugeList.tsx";

export default function FontComparisonPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { font: any; previewText: string };
    if (!state) {
        return (
            <Box p={4}>
                <Typography>No font selected.</Typography>
                <Button variant="contained" onClick={() => navigate(-1)}>Go Back</Button>
            </Box>
        );
    }

    const { font, previewText } = state;
    const [text, setText] = useState(previewText || "");
    const [languageOpen, setLanguageOpen] = useState(false);

    const fontCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const fallbackCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const fontSize = 30;
    const canvasWidth = 600;
    const canvasHeight = 200;

    useEffect(() => {
        const fontFace = new FontFace(font.name, `url(${font.fileUrl || font.fileName}) format('woff2')`, { display: 'swap' });
        fontFace.load().then((loadedFace) => {
            document.fonts.add(loadedFace);
            drawAllCanvases();
        }).catch(() => {
            drawAllCanvases();
        });

        function drawAllCanvases() {
            const fontCtx = fontCanvasRef.current?.getContext("2d");
            const fallbackCtx = fallbackCanvasRef.current?.getContext("2d");

            if (!fontCtx || !fallbackCtx) return;

            // Draw full text
            drawFullText(fontCtx, text, `${fontSize}px '${font.name}', sans-serif`, 'black');
            drawFullText(fallbackCtx, text, `${fontSize}px sans-serif`, 'black');


        }

    }, [font, text]);

    return (
        <Box p={4}>
            <Button variant="contained" onClick={() => navigate(-1)}>Back</Button>
            <Typography variant="h5" mt={2} mb={2}>Font Comparison: {font.name}</Typography>
            <Box>
                <TextField
                    multiline
                    fullWidth
                    value={text}
                    onChange={(e) => {
                        const value = e.target.value;
                        setText(value);

                        setLanguageOpen(value.length === 0);
                    }}
                    onFocus={() => setLanguageOpen(true)}
                    onBlur={() => setTimeout(() => setLanguageOpen(false), 50)}
                    maxRows={6}
                    minRows={5}
                    variant="outlined"
                    label="Enter text to preview"
                />

            </Box>
            {languageOpen && (
                <Paper
                    sx={{
                        overflow: "auto",
                        maxHeight: 150,
                        position: "sticky"
                    }}>
                    <LanguageList userText={text}
                        onSelect={(selectedText) => {
                            setText(selectedText);

                        }} />
                </Paper>)}
            <Typography
                variant="body1"
                sx={{
                    mt: 1,
                    color: 'text.secondary',
                    fontWeight: 'medium',


                }}
            >
                {`${text.length}/100 characters`}</Typography>

            <Box
                p={4}
                sx={{
                    display: "flex",       // flex container
                    flexDirection: "row",  // horizontal stacking
                    gap: 4,               // space between items
                    flexWrap: "wrap",      // wrap to next row if not enough space
                    overflow: "auto"
                }}
            >
                <ComparisonBlock label="Custom Font">
                    <canvas ref={fontCanvasRef} width={canvasWidth} height={canvasHeight} style={{ border: "1px solid #ccc" }} />
                </ComparisonBlock>

                <ComparisonBlock label="Fallback Font">
                    <canvas ref={fallbackCanvasRef} width={canvasWidth} height={canvasHeight} style={{ border: "1px solid #ccc" }} />
                </ComparisonBlock>

            </Box>
        </Box >
    );
}

function ComparisonBlock({ label, children }: any) {
    return (
        <Box sx={{ flex: 1, }}>
            <Typography variant="subtitle2" mb={1}>{label}</Typography>
            {children}
        </Box>
    );
}
