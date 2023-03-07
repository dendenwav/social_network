import { IconButton } from '@mui/material';
import { Close as IconClose } from '@mui/icons-material';
import { useSnackbar, SnackbarKey } from 'notistack';

interface SnackbarCloseButtonProps {
    snackbarKey: SnackbarKey;
}

export const SnackbarCloseButton = ({ snackbarKey }: SnackbarCloseButtonProps) => {
    const { closeSnackbar } = useSnackbar();

    return (
        <IconButton onClick={() => closeSnackbar(snackbarKey)} color='inherit'>
            <IconClose />
        </IconButton>
    );
}