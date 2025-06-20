import PreviewRow from "./previewRow.tsx";
import type { preview } from "../../types/previewTypes.ts";
import { useEffect,  useState } from "react";
import getFonts from "../../api/getFonts.ts";
type font = {
    id: number,
    name: string,
    fileName: string
}
function PreviewList({ preview }: { preview: preview }) {
    const [img, setImg] = useState<font[]>([]);

    useEffect(() => {
        console.log("Mounted");
        const getFont = async () => {
            const result = await getFonts()
            if (result.status === 200) {
                setImg(result.message);

            }
        }

        getFont();

    }, []);

    console.log(img)
    const list = img.map((item) => (
        <PreviewRow key={item.id} preview={preview} img={item} />
    ));
    return (
        <>
            {list}
        </>
    )
}
export default PreviewList;