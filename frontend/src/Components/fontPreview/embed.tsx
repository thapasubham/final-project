import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Close, ContentCopy } from "@mui/icons-material";
import { API_URL } from "../../utils/config";
import { useState } from "react";

interface Font {
    id: number;
    name: string;
    fileName: string;
}

function Embed({ selectedFont, onClose }: { selectedFont: Font | null, onClose: (font: Font | null) => void }) {
    const [copied, setCopied] = useState<string | null>(null);



    const cssUsage = `<style>
  @font-face {
    font-family: '${selectedFont?.name}';
    src: url('${API_URL}/static/${selectedFont?.fileName}') format('truetype');
  }

  body {
    font-family: '${selectedFont?.name}', sans-serif;
  }
</style>`;

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(text);
            setTimeout(() => setCopied(null), 1500);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    const CopyButton = ({ text }: { text: string }) => (
        <>
            <Tooltip title={copied === text ? "Copied!" : "Copy"}>
                <IconButton
                    onClick={() => handleCopy(text)}
                    size="small"

                >
                    <ContentCopy fontSize="small" />
                </IconButton>
            </Tooltip></>
    );

    return (
        <Box sx={{ width: "50vw", p: 2, gap: 5 }}>
            <Typography variant="h6" fontFamily={selectedFont?.name}>{selectedFont?.name}</Typography>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                    mb: 1,
                }}
            >
                <Typography variant="body2">Usage</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                    <CopyButton text={cssUsage} />
                    <IconButton onClick={() => onClose(null)} size="small">
                        <Tooltip title={"Close"}><Close /></Tooltip></IconButton>
                </Box>
            </Box>

            <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: 1, p: 1, mb: 1, position: "relative" }}>

                <Typography component="pre" sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                    {cssUsage}
                </Typography>

            </Box>
        </Box>
    );
}

export default Embed;
