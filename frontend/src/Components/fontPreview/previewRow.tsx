import { Box, Card, createTheme, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import type { preview } from "../../types/previewTypes.ts";
import { API_URL } from "../../utils/config.ts";
import { useEffect, useMemo, useState } from "react";

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
    lang: string
    setMissingGlyphs: (missingGlyphs: boolean) => void;
    viewMode?: 'row' | 'grid'
    onClickRow: (font: Font) => void
}


function PreviewRow({ previewText, preview, img, lang, setMissingGlyphs, viewMode, onClickRow, search }: PreviewRowProps) {
    const fontName = img.name;
    const [renderText, setRender] = useState("");
    const fontUrl = `${API_URL}/static/${img.fileName}`;

    const theme = useMemo(() => {
        return createTheme({
            components: {
                MuiCssBaseline: {
                    styleOverrides: `
                        //     @font-face {
                        //          font-family: '${fontName}';
                        //         src: url('${fontUrl}') format('truetype');
                        //         font-display: swap;
                        //     }
                        // `
                }
            }
        });
    }, [fontName, fontUrl]);
    useEffect(() => {

        setMissingGlyphs(false)
        const fontFace = new FontFace(fontName, `url(${fontUrl}) format('truetype')`);
        fontFace.load().then((loadedFace) => {
            document.fonts.add(loadedFace);
            document.fonts.ready.then(() => {
                const supportedText = isSupported(previewText);
                setRender(supportedText);
                const hasTofu = supportedText.includes('\u29E0');
                if (hasTofu) setMissingGlyphs(hasTofu);

            });
        });
    }, [previewText, search]);


    const isSupported = (text: string) => {
        const canvasSize = 10;
        const canvas = document.createElement("canvas");
        const refCanvas = document.createElement("canvas");
        canvas.width = refCanvas.width = canvas.height = refCanvas.height = canvasSize;

        const ctx = canvas.getContext("2d")!;
        const refCtx = refCanvas.getContext("2d")!;



        ctx.textBaseline = refCtx.textBaseline = "top";
        ctx.fillStyle = refCtx.fillStyle = "black";

        let result = "";
        for (const char of text) {
            const isCJK = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(char);
            let fontSize = 10;
            if (isCJK) {
                fontSize = 5;
            }
            if (char.trim() === "") {
                result += char;
                continue;
            }

            ctx.font = `${fontSize}px '${fontName}'`;
            refCtx.font = `${fontSize}px sans-serif`;
            ctx.clearRect(0, 0, canvasSize, canvasSize);
            refCtx.clearRect(0, 0, canvasSize, canvasSize);

            ctx.fillText(char, 0, 0);
            refCtx.fillText(char, 0, 0);

            let mismatch = false;
            if (isCJK) {
                const imageData = ctx.getImageData(0, 0, ctx.measureText(char).width, canvasSize).data;
                const refData = refCtx.getImageData(0, 0, refCtx.measureText(char).width, canvasSize).data;
                for (let j = 0; j < imageData.length; j++) {
                    if (imageData[j] !== refData[j]) {
                        mismatch = true;
                        break;
                    }
                }
            } else {
                const width = ctx.measureText(char).width;

                const refWidth = refCtx.measureText(char).width;
                if (width !== refWidth) {
                    mismatch = true;
                }
            }


            result += mismatch ? char : "\u29E0";
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
                <Box sx={{ display: "flex", flexDirection: "row", borderBottom: '1px solid #eee', alignItems: "flex-start", justifyContent: "left" }}>
                    <Typography
                        variant="body2"
                        sx={{
                            px: 1,
                            py: 0.5,
                            color: 'text.primary',
                            fontWeight: 500,

                        }}
                    >
                        {fontName}

                    </Typography>
                    <Typography onClick={() => onClickRow(img)} variant="subtitle2" sx={{
                        textTransform: "capitalize",
                        cursor: "pointer",
                        px: 1,
                        py: 0.5,
                        color: 'text.secondary',
                        fontWeight: 500,
                    }}>Embed</Typography>
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