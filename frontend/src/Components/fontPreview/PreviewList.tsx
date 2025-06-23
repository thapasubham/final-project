import PreviewRow from "./previewRow.tsx";
import type { preview } from "../../types/previewTypes.ts";
import { useEffect, useState } from "react";
import getFonts from "../../api/getFonts.ts";
import { Box, Button, Container, } from "@mui/material";
type font = {
    id: number,
    name: string,
    fileName: string
}
function PreviewList({ preview }: { preview: preview }) {
    const [img, setImg] = useState<font[]>([]);
    const limit = 2;
    const [offset, setOffset] = useState(0)
    useEffect(() => {
        const getFont = async () => {
            const result = await getFonts(limit, offset)
            if (result.status === 200) {
                setImg(result.message);

            }
        }

        getFont();

    }, [offset]);


    const list = img.length > 0 ? img.map((item) => (
        <PreviewRow key={item.id} preview={preview} img={item} />
    )) : "No data found";

    const handlePrev = () => {
        setOffset(() => offset <= limit ? 0 : offset - limit)
        console.log(offset)

    }
    const handleNext = () => {
        setOffset(() => limit + offset);
        console.log(offset)

    }
    return (
        <>
            <Container sx={{ display: "flex", justifyContent: "center", padding: 2, gap: 2 }}>
                <Button variant="contained" onClick={handlePrev}>Previous</Button>
                <Button variant="contained" onClick={handleNext} disabled={img.length === 0}>Next</Button>
            </Container>
            {list}
        </>
    )
}
export default PreviewList;