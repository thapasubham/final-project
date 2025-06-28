import { useTheme } from "@mui/material/styles";
import { Box, Typography, Paper, Divider, Button } from "@mui/material";
import { languageLists } from "../../constants/languageText";
import { useEffect, useState } from "react";
export default function MultiLangPreview({
    userText,
    onSelect,
}: {
    userText: string,
    onSelect: (lang: string) => void;
}) {
    const [active, setActive] = useState("");
    const theme = useTheme();

    useEffect(() => {
        setActive(userText)

    }, [userText])

    return (
        <Paper sx={{ display: "flex", flexDirection: "column", }}>
            {languageLists.map((lang, index) => (
                <Box key={lang.language}>
                    <Button
                        fullWidth
                        size="small"
                        variant="text"
                        onClick={() => {
                            onSelect(lang.text);
                            setActive(lang.text);
                        }}
                        sx={{

                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            textTransform: "none",
                            gap: 0.5,
                            borderRadius: 0,
                            borderLeft: active === lang.text ? `4px solid ${theme.palette.primary.dark}` : "4px solid transparent",
                            color: active === lang.text ? theme.palette.secondary.dark : theme.palette.text.primary,
                            "&:hover": {
                                backgroundColor: active === lang.text ? theme.palette.primary.contrastText : theme.palette.action.hover,
                            }
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{
                                minWidth: 80,
                                fontWeight: 500,
                                backgroundColor: active === lang.text ? "white" : "black",
                                color: active === lang.text ? "black" : "white",
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                            }}
                        >
                            {lang.language}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            sx={{ color: active === lang.language ? theme.palette.primary.dark : theme.palette.text.primary }}
                        >
                            {lang.text}
                        </Typography>
                    </Button>
                    {index < languageLists.length - 1 && <Divider />}
                </Box>
            ))}
        </Paper>
    );
}