import { ContentCopyRounded } from "@mui/icons-material";
import { Box, IconButton, Skeleton, Typography } from "@mui/material";

export function FontSkeleton(){
    return(
        <>
    <Box sx={{ display: "flex", flexDirection: "row", borderBottom: '1px solid #eee', alignItems: "center", justifyContent: "left" }}>
                    <Typography
                    width={"10%"}
                        sx={{

                            px: 1,
                            color: "text.primary",
                            fontWeight: 500,
                        }}
                    >
                        <Skeleton
                        variant="text"
                        sx={{    
                            fontSize: 25,
                            px: 1,
                            color: "text.primary",
                            fontWeight: 500,
                        }}
                    />
                    </Typography>

                    <IconButton
                        size="small"
                        sx={{ p: 0.5, mt: "2px" }} // Fine-tuning spacing if needed
                    >
                        <ContentCopyRounded fontSize="small" />
                    </IconButton>
                </Box>
    <Box
                        sx={{

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
                               
                                lineHeight: 1.4,
                                wordBreak: 'break-word',
                                width: '100%'
                            }}
                        >
                            <Skeleton
                         sx={{

                            fontSize: 25,
                            px: 1,
                            color: "text.primary",
                            fontWeight: 500,
                        }}
                    />
                        </Typography>
    </Box>
        </>
    )
}