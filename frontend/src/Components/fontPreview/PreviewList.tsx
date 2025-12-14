import type { preview } from "../../types/previewTypes.ts";
import { Suspense, useEffect, useRef, useState } from "react";
import getFonts from "../../api/getFonts.ts";
import { Button, ToggleButtonGroup, ToggleButton, Typography, Box, Drawer, TextField, InputAdornment, } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowForward, GridView, Restore, Search, TableRows, Warning, } from "@mui/icons-material";
import { languageLists } from "../../constants/languageText.ts";
import Loading from "../loading/loading.tsx";
import PreviewRow from "./previewRow.tsx";
import { API_URL } from "../../utils/config.ts";
import { useNotification } from "../../notification/notificationContext.tsx";
import { useAuth } from "../../auth/AuthContext.tsx";

type font = {
    id: number,
    name: string,
    fileName: string
    price: number
}

function PreviewList({ previewText, preview, reset, setReset }: { previewText: string, preview: preview; reset: boolean; setReset: (val: boolean) => void }) {
    const [missingGlyphs, setMisssingGlyphs] = useState(false);
    const [sampletext, setSampleText] = useState("");
    const [img, setImg] = useState<font[]>([]);
    const [searchParam, setParam] = useSearchParams();
    const paramLang = searchParam.get("lang");
    const paramOffset = searchParam.get("offset");
    const searchQ = searchParam.get("search");
    const [offset, setOffset] = useState(Number(paramOffset) || 0);
    const [selectedFont, setSelectedFont] = useState<font | null>(null);
    const notify = useNotification();
    const navigate = useNavigate();
    const [error, setError] = useState("")
    const [language, setLanguage] = useState<string>(() => paramLang ? paramLang : "");
    const tempOffset = useRef(0);
    const limit = 5;
    const totalCount = useRef(0);
    const [viewMode, setViewMode] = useState<'row' | 'grid'>('row');
    const [order_by, setOrderby] = useState<"ASC" | "DESC">("ASC");
    const [search, setSearch] = useState(() => searchQ ? searchQ : "");
    useEffect(() => {
        if (reset) {
            setLanguage("");
            setOffset(0);
            tempOffset.current = 0;
            setOrderby("ASC")
            setSearch("")
            setReset(false);

        }
    }, [reset, setReset]);

    useEffect(() => {
        const defaultText = "The quick brown fox jumps over the lazy dog.";
        if (previewText) {
            setSampleText(previewText);
            return;
        }
        setTimeout(() => {
            const matched = languageLists.find(
                (langs) => langs.language.toLowerCase() === language?.toLowerCase()
            )
            setSampleText(matched?.text || defaultText);
        }, 10);


    }, [previewText, language]);


    useEffect(() => {
        if (offset == 0) {
            searchParam.delete("offset");
        } else {
            searchParam.set("offset", offset.toString());
        }
        if (language) {
            searchParam.set("lang", language);
        } else {
            searchParam.delete("lang");
        }
        if (search) {
            searchParam.set("search", search)
        } else {
            searchParam.delete("search")
        }
        setParam(searchParam);

        setMisssingGlyphs(false);
        const getFont = async () => {

            const result = await getFonts(limit, offset, language, search, order_by);
            console.log(result)
            if (result.status === 200) {
                setImg(result.message.fonts);
                totalCount.current = result.message.count;
            }
            if (img.length === 0) {
                setError("Failed to load fonts")
            }
        };

        const delay = setTimeout(() => {
            getFont();

        }, 10)
        return () => clearTimeout(delay);

    }, [offset, language, search, order_by]);


    const handlePrev = () => {
        setOffset((prevOffset) => (prevOffset <= limit ? 0 : prevOffset - limit));
    };
    const handleNext = () => {
        setOffset((prevOffset) => prevOffset + limit);
    };

    const handleChange = (
        e: React.MouseEvent<HTMLElement>,
        newLanguage: string | null,
    ) => {

        const delay = setTimeout(() => {
            if (newLanguage === null) {
                setLanguage("");
                setOffset(tempOffset.current || 0);
                tempOffset.current = 0;
            } else {
                if (tempOffset.current === 0) {
                    tempOffset.current = offset;
                }
                setLanguage(newLanguage);
                setOffset(0);
            }

        }, 50)
        return () => clearTimeout(delay);
    };
    const handleRowClick = async (font: font) => {
        setSelectedFont(font);

        navigate(`/payment/?fontId=${font.id}&price=${font.price}`)

    };
    const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;


        if (value !== "") {
            if (tempOffset.current === 0) {
                tempOffset.current = offset;
            }
            setOffset(0);
        } else {
            setOffset(tempOffset.current);
            tempOffset.current = 0;
        }

        setSearch(value);
    };


    return (
        <> <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: 1,
            p: 1,
            mx: 1,
            borderRadius: 1,
            position: "sticky",
            zIndex: 1200,
            top: 0,
            gap: 2,
            alignItems: "center",
            backgroundColor: "background.paper",
        }}>

            <ToggleButtonGroup
                color="secondary"
                value={language}
                exclusive
                onChange={handleChange}
                aria-label="Language"
                sx={{
                    gap: 1,
                    '& .MuiToggleButton-root': {
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        fontWeight: 500,
                        textTransform: 'capitalize',
                        border: '1px solid #ccc',
                    },
                }}
            >
                <ToggleButton value="english">English</ToggleButton>
                <ToggleButton value="nepali">Nepali</ToggleButton>
                <ToggleButton value="chinese">Chinese</ToggleButton>
            </ToggleButtonGroup>
            <Box>

                <TextField type="text" placeholder="Search fonts"
                    variant="standard"
                    size="small"
                    value={search}
                    onChange={handleText}
                    slotProps={{
                        input: {
                            startAdornment: (<InputAdornment position="start">
                                <Search sx={{ fontSize: 20 }} />
                            </InputAdornment>)
                        }
                    }}
                    sx={{ borderRadius: 5 }}
                />
                <Button
                    variant="text"
                    onClick={() => setOrderby((prev) => (prev === "ASC" ? "DESC" : "ASC"))}
                    size="small"
                >
                    {order_by === "ASC" ? (<>A<ArrowForward fontSize="small" />Z</>) : (<>Z<ArrowForward fontSize="small" />A</>)}
                </Button>
            </Box>
            {missingGlyphs && (
                <>

                    <Typography variant="body2" color="error">
                        <Warning sx={{ width: 20 }} /> Some fonts in this list dont support certain characters.
                    </Typography>
                </>)}
            <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, val) => val && setViewMode(val)}
                aria-label="View Mode"
                size="small"
            >
                <ToggleButton value="row" aria-label="Row View"><TableRows /></ToggleButton>
                <ToggleButton value="grid" aria-label="Grid View"><GridView /></ToggleButton>
            </ToggleButtonGroup>
        </Box >

            <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%", p: 1.5 }}
            >
                {img.length > 0 ? (
                    <Box
                        pt={1}
                        sx={{
                            display: "flex",
                            flexDirection: viewMode === "row" ? "column" : "row",
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >  {img.map((item) => (
                        <Suspense fallback={<Loading />}>
                            <PreviewRow
                                previewText={sampletext}
                                key={item.id}
                                preview={preview}
                                search={search}
                                img={item}
                                setMissingGlyphs={setMisssingGlyphs}
                                viewMode={viewMode}
                                onClickRow={handleRowClick}
                            />
                        </Suspense>))}</Box>
                ) : (<>
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                        <Typography
                            variant="body2"
                            color="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Typography>

                        <Button
                            variant="outlined"
                            onClick={() => {
                                setLanguage("");
                                setOffset(0);
                                tempOffset.current = 0;
                                setReset(false);
                                setOrderby("ASC");
                                setSearch("");
                            }}
                        ><Restore />
                            Reset Filters
                        </Button>
                    </Box>

                </>)}
                {/* <Drawer
                    anchor="right"
                    open={Boolean(selectedFont)}
                    onClose={() => setSelectedFont(null)}
                >
                    <Embed selectedFont={selectedFont} onClose={() => setSelectedFont(null)} />

                </Drawer> */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: 2,
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handlePrev}
                        disabled={offset === 0}
                        aria-label="Previous fonts"
                    >
                        Previous
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={offset + limit >= totalCount.current}
                        aria-label="Next fonts"
                    >
                        Next
                    </Button>
                </Box>
            </Box >
        </>);
}
export default PreviewList;

