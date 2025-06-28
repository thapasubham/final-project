import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { API_URL } from "../../utils/config";
import { useState } from "react";

interface Font {
    id: number;
    name: string;
    fileName: string;
}

function Embed({ selectedFont }: { selectedFont: Font | null }) {
    const [copied, setCopied] = useState<string | null>(null);

    const htmlEmbed = `<link rel="stylesheet" href="${API_URL}/static/${selectedFont?.fileName}" />`;

    const cssUsage = `<link href="${API_URL}/static/${selectedFont?.fileName}" rel="stylesheet">
    <style>
  @font-face {
    font-family: '${selectedFont?.name}';
    src: url('${API_URL}/static/${selectedFont?.fileName}') format('opentype');
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
        <Tooltip title={copied === text ? "Copied!" : "Copy"}>
            <IconButton
                onClick={() => handleCopy(text)}
                size="small"
                sx={{ float: "right", mt: -5 }}
            >
                <ContentCopy fontSize="small" />
            </IconButton>
        </Tooltip>
    );

    return (
        <Box sx={{ width: "50vw", p: 2, gap: 5 }}>
            <Typography variant="h5">{selectedFont?.name}</Typography>


            <Typography variant="h6" sx={{ mt: 3 }}>
                Usage
            </Typography>

            <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: 1, p: 1, mb: 1, position: "relative" }}>
                <CopyButton text={cssUsage} />
                <Typography component="pre" sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                    {cssUsage}
                </Typography>


            </Box>
        </Box>
    );
}

export default Embed;
