import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from "@mui/material";

interface ConfirmDialogProps {
    title?: string;
    children: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    onConfirm: () => void;
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
    const { title, children, open, setOpen, onConfirm } = props;

    const OnDenyButtonClick = () => {
        setOpen(false);
    };

    const OnAffirmButtonClick = () => {
        setOpen(false);
        onConfirm();
    };

    const titleBlock = title ? 
        <DialogTitle>
            {title}
            <IconButton onClick={() => setOpen(false)} className='dialog-close-button'>
                <Close/>
            </IconButton>
        </DialogTitle> 
    : null;

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            {titleBlock}
            <DialogContent>
                <DialogContentText>{children}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={OnDenyButtonClick} color="secondary" variant="outlined">Non</Button>
                <Button onClick={OnAffirmButtonClick} color="secondary" variant='contained'>Oui</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;