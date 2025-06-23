import {Card, Divider, Typography} from "@mui/material";
import type {preview} from "../../types/previewTypes.ts";

function PreviewRow({preview}: {preview: preview}) {
    return(
        <>
            <Card sx={{width: 600, maxWidth: 600, height: 100, background: preview.backgroundColor}}>


            <Typography
                sx={{ fontSize: preview.size, fontWeight: 600, color: preview.color }}>
                {preview.text}
            </Typography>

            </Card>
            <Divider sx={{ margin: "0 auto" }}/>
        </>
    )
}

export default PreviewRow;