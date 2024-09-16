import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type MySnackbarProps = {
    isOpen: boolean;
    period: number; // in milliseconds
    message: string;
    severity: "success" | "info" | "warning" | "error";
    closeAction: () => void;   
};

export default function MySnackbar ({isOpen, period, message, severity, closeAction}: MySnackbarProps){
    const [open, setOpen] = React.useState(isOpen);

    const handleClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpen(false);
        closeAction();
    };

    return (
        <div>
        <Snackbar open={open} autoHideDuration={period} onClose={handleClose}>
            <Alert
            onClose={handleClose}
            severity={severity}
            variant="filled"
            sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
        </div>
    );
}
