import { Box, Button, Card, createTheme, CssBaseline, IconButton, ThemeProvider, Typography } from "@mui/material";
import type { preview } from "../../types/previewTypes.ts";
import { API_URL } from "../../utils/config.ts";
import { useEffect, useMemo, useState } from "react";
import { ContentCopyRounded, CopyAllOutlined } from "@mui/icons-material";

interface Font {
    id: number;
    name: string;
    fileName: string;
}

interface PreviewRowProps {
    previewText: string,
    preview: preview;
    img: Font;
    search: string;
    setMissingGlyphs: (missingGlyphs: boolean) => void;
    viewMode?: 'row' | 'grid'
    onClickRow: (font: Font) => void
}


function PreviewRow({ previewText, preview, img, setMissingGlyphs, viewMode, onClickRow, }: PreviewRowProps) {
    const fontName = img.name;
    const [renderText, setRender] = useState("");
    const [sampletext, setSampleText] = useState("")
    const fontUrl = `${API_URL}/static/${img.fileName}`;

    const theme = createTheme({
        components: {
            MuiCssBaseline: {
                styleOverrides: `
                            @font-face {
                                 font-family: '${fontName}';
                                src: url('${fontUrl}') format('truetype');
                                font-display: swap;
                            }
                        `
            }
        }
    });



    useEffect(() => {
        setTimeout(() => { setSampleText(previewText) }, 80)

    }, [previewText])
    useEffect(() => {

        setMissingGlyphs(false)
        const fontFace = new FontFace(fontName, `url(${fontUrl}) format('truetype')`);
        fontFace.load().then((loadedFace) => {
            document.fonts.add(loadedFace);
            const supportedText = isSupported(sampletext);
            const hasTofu = supportedText.includes('\u29E0');
            if (hasTofu) setMissingGlyphs(hasTofu);
            setRender(supportedText);

        });

    }, [sampletext, fontName]);


    const isSupported = (text: string,) => {
        const canvasSize = 50;
        const canvas = document.createElement("canvas");
        const refCanvas = document.createElement("canvas");
        canvas.width = refCanvas.width = canvas.height = refCanvas.height = canvasSize;

        const ctx = canvas.getContext("2d")!;
        const refCtx = refCanvas.getContext("2d")!;
        ctx.textBaseline = refCtx.textBaseline = "top";
        ctx.fillStyle = refCtx.fillStyle = "black";

        let result = "";

        for (const char of text) {
            if (char.trim() === "") {
                result += char;
                continue;
            }

            const isCJK = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(char);
            const isDevanagari = /[\u0900-\u097F]/.test(char);
            let fontSize = isCJK ? 5 : 40;

            ctx.font = `${fontSize}px '${fontName}', sans-serif`;
            refCtx.font = `${fontSize}px sans-serif`;

            ctx.clearRect(0, 0, canvasSize, canvasSize);
            refCtx.clearRect(0, 0, canvasSize, canvasSize);

            ctx.fillText(char, 0, 0);
            refCtx.fillText(char, 0, 0);



            let mismatch = false;
            if (isDevanagari) {
                const width = ctx.measureText(char).width;

                const refWidth = refCtx.measureText(char).width;
                if (width !== refWidth) {
                    mismatch = true;
                }
            } else {

                const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize).data;
                const refData = refCtx.getImageData(0, 0, canvasSize, canvasSize).data;
                for (let i = 0; i < imageData.length; i++) {
                    if (imageData[i] !== refData[i]) {
                        mismatch = true;
                        break;
                    }
                }
            }
            result += mismatch ? char : "\u29E0"; // ⧠
        }

        return result;
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Card

                sx={{
                    width: viewMode === 'grid' ? 'calc(50% - 8px)' : '100%',
                    boxShadow: 1,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'background.paper',

                }}>
                <Box sx={{ display: "flex", flexDirection: "row", borderBottom: '1px solid #eee', alignItems: "center", justifyContent: "left" }}>
                    <Typography
                        sx={{
                            fontFamily: fontName,
                            fontSize: 25,
                            px: 1,
                            color: "text.primary",
                            fontWeight: 500,
                        }}
                    >
                        {fontName}
                    </Typography>

                    <IconButton
                        onClick={() => onClickRow(img)}
                        size="small"
                        sx={{ p: 0.5, mt: "2px" }} // Fine-tuning spacing if needed
                    >
                        <ContentCopyRounded fontSize="small" />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        backgroundColor: preview.backgroundColor,

                        mt: 1,
                        minHeight: 80,
                        display: 'flex',
                        borderRadius: 2,

                        alignItems: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            p: 3,
                            fontSize: preview.size,
                            color: preview.color,
                            fontFamily: fontName,
                            lineHeight: 1.4,
                            wordBreak: 'break-word',
                            width: '100%'
                        }}
                    >
                        {renderText}
                    </Typography>
                </Box>
            </Card>
        </ThemeProvider >
    );
}

export default PreviewRow;