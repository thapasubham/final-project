import { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

type NotifyFunction = (message: string, severity?: AlertColor) => void;

const NotificationContext = createContext<NotifyFunction | undefined>(undefined);

export const useNotification = (): NotifyFunction => {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error("useNotification must be used inside NotificationProvider");
    }
    return ctx;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
    const [options, setOptions] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "info",
    });

    const notify: NotifyFunction = (message, severity = "info") => {
        setOptions({ open: true, message, severity });
    };

    return (
        <NotificationContext.Provider value={notify}>
            {children}

            <Snackbar
                open={options.open}
                autoHideDuration={3000}
                onClose={() => setOptions({ ...options, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert severity={options.severity} variant="filled">
                    {options.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
}
