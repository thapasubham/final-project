import { Card, createTheme, CssBaseline,  ThemeProvider, Typography } from "@mui/material";
import type { preview } from "../../types/previewTypes.ts";
import { API_URL } from "../../utils/config.ts";
import { useMemo } from "react";
type font = {
    id: number;
    name: string;
    fileName: string;
}



function PreviewRow({ preview, img }: { preview: preview, img: font }) {
    const fontName = img.fileName.split(".")[0]
    const fontUrl = `${API_URL}/static/${img.fileName}`;
    const theme = useMemo(() => {
        return createTheme({

            components: {
                MuiCssBaseline: {
                    styleOverrides: `
             @font-face {
              font-family: '${fontName}';
              src: url('${fontUrl}') format('opentype');
            }
            }
            `
                }
            }
        })

    }, [])
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <Card
                    sx={{
                        textAlign: "left",
                        width: 800,
                        maxWidth: 600,
                        maxHeight: preview.size * 100,
                        background: preview.backgroundColor,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                    }}
                >



                    <Typography sx={{ px: 1 }} color={preview.color}>
                        {fontName}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: preview.size,
                            px: 1,
                            color: preview.color,
                            fontFamily: fontName,

                        }}>
                        {preview.text}

                    </Typography>

                </Card>
            </ThemeProvider >
        </>
    )
}

export default PreviewRow;