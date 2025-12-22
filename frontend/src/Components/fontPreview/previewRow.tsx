import { Box, Card, IconButton, Typography } from "@mui/material";
import type { preview } from "../../types/previewTypes.ts";
import { API_URL } from "../../utils/config.ts";
import { useEffect, useState } from "react";
import { Compare, ContentCopyRounded, Shop, Shop2Outlined, ShoppingCart } from "@mui/icons-material";
import { FontSkeleton } from "./FontSkeleton.tsx";
import { useAuth } from "../../auth/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

interface Font {
    id: number;
    name: string;
    fileName: string;
    price: number
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
    const fontUrl = `${API_URL}/static/${img.fileName}`;
    const [isLoading, setIsLoading] = useState(true);
    const { isLogged, userID } = useAuth();
    const navigate = useNavigate();

    const openComparison = () => {
        navigate("/compare", {
            state: { font: img, previewText }
        });
    };

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = fontUrl;
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);

    }, [fontUrl]);
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        if (!fontName || !fontUrl) return; // safety check
        if (fontLoaded) return; // already loaded

        const loadFont = async () => {
            try {
                // Create FontFace with swap
                const fontFace = new FontFace(fontName, `url(${fontUrl}) format('woff2')`, { display: 'swap' });

                // Load font
                const loadedFace = await fontFace.load();

                // Add to document fonts
                document.fonts.add(loadedFace);
                setFontLoaded(true); // mark as loaded
            } catch (err) {
                console.error('Failed to load font', fontName, err);
                setFontLoaded(true); // still allow fallback rendering
            }
        };
        setIsLoading(false);

        loadFont();
    }, [fontName]);


    useEffect(
        () => {
            setMissingGlyphs(false)
            checkMissing()

        }, [previewText])
    useEffect(() => {
        setMissingGlyphs(false)
        const fontFace = new FontFace(fontName, `url(${fontUrl}) format('woff2')`);
        fontFace.load().then((loadedFace) => {
            document.fonts.add(loadedFace);
            checkMissing()
        });

    }, [fontName]);

    const checkMissing = () => {

        const supportedText = isSupported(previewText);
        const hasTofu = supportedText.includes('\u29E0');
        if (hasTofu) setMissingGlyphs(hasTofu);
        setRender(supportedText);
    }
    const isSupported = (text: string,) => {
        const canvasSize = 150;
        const canvas = document.createElement("canvas");
        const refCanvas = document.createElement("canvas");

        canvas.width = refCanvas.width = canvas.height = refCanvas.height = canvasSize;

        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        const refCtx = refCanvas.getContext("2d", { willReadFrequently: true })!;

        ctx.textBaseline = refCtx.textBaseline = "top";
        ctx.fillStyle = refCtx.fillStyle = "black";

        let result = "";

        for (const char of text) {
            if (char.trim() === "") {
                result += char;
                continue;
            }
            const isDevanagari = /[\u0900-\u097F]/.test(char);

            const isCJK = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(char);
            let fontSize = isCJK ? 5 : 150;

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

        <Card

            sx={{
                width: viewMode === 'grid' ? 'calc(50% - 8px)' : '100%',
                boxShadow: 1,
                p: 2,
                borderRadius: 2,
                backgroundColor: 'background.paper',

            }}>
            {isLoading ? (
                <>
                    <FontSkeleton />
                </>
            ) : (<>
                <Box sx={{ display: "flex", flexDirection: "row", borderBottom: '1px solid #eee', alignItems: "center", justifyContent: "left" }}>
                    <Typography
                        sx={{

                            fontSize: 25,
                            px: 1,
                            color: "text.primary",
                            fontWeight: 500,
                        }}
                    >
                        {fontName}

                    </Typography>

                    {isLogged && <IconButton
                        onClick={() => onClickRow(img)}
                        size="small"
                        sx={{ p: 0.5, mt: "2px" }} // Fine-tuning spacing if needed
                    >
                        <ShoppingCart />
                    </IconButton>
                    }
                    <IconButton onClick={openComparison}>
                        <Compare />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        backgroundColor: preview.backgroundColor,

                        mt: 1,
                        p: 1.5,
                        minHeight: 50,
                        display: 'flex',
                        borderRadius: 2,

                        alignItems: 'center',
                    }}
                >
                    <Typography
                        sx={{
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
                <Typography sx={{ mt: 1, fontWeight: 600 }}>
                    {img.price}$
                </Typography>
            </>)}
        </Card>
    );
}

export default PreviewRow;