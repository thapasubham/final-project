import PreviewRow from "./previewRow.tsx";
import type {preview} from "../../types/previewTypes.ts";

function PreviewList({preview}: {preview: preview}      ) {
    return(
        <>
            <PreviewRow preview={preview}/>
            <PreviewRow preview={preview}/>
            <PreviewRow preview={preview}/>
            <PreviewRow preview={preview}/>
        </>
    )
}
export default PreviewList;