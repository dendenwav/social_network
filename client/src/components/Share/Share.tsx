import { useEffect, useRef, useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Slide } from "@mui/material";
import { ArrowBack, ArrowForward, Close, Check } from '@mui/icons-material';

interface DialogProps {
    open: boolean;
    onClose: () => void;
};

const timeout = 300;

const Share = (props: DialogProps) => {
    const { onClose, open } = props;
    const [checked, setChecked] = useState(false);
    const [isJustOpened, setIsJustOpened] = useState(true);
    const containerRef = useRef<any>(null);

    useEffect(() => {
        if(open && isJustOpened) {
            setIsJustOpened(false);
        }
    }, [open, isJustOpened]);
    

    const handleSwipe = () => {
        setChecked((prev) => !prev);
    };

    const handleClose = () => {
        onClose();
        setIsJustOpened(true);
    };
    
    const handlePost = async () => {
        onClose();
        await new Promise((resolve) => setTimeout(resolve, 500));
        setChecked(false);
        setIsJustOpened(true);
    };
    
    const firstPageTitle = (
        <div>
            Créer un post (1/2)
            <IconButton onClick={handleClose} sx={{position: 'absolute', left: 12, top: 0}}>
                <Close />
            </IconButton>
            <IconButton onClick={handleSwipe} sx={{position: 'absolute', right: 12, top: 0}}>
                <ArrowForward />
            </IconButton>
        </div>
    );

    const secondPageTitle = (
        <div>
            Créer un post (2/2)
            <IconButton onClick={handleSwipe} sx={{position: 'absolute', left: 12, top: 0}}>
                <ArrowBack />
            </IconButton>
            <IconButton onClick={handlePost} sx={{position: 'absolute', right: 12, top: 0}}>
                <Check />
            </IconButton>
        </div>
    );

    const firstPageContent = (
        <div>
            <p>Contenu du post</p>
            <p>Contenu du post</p>
            <p>Contenu du post</p>
            <p>Contenu du post</p>
            <p>Contenu du post</p>
        </div>
    );

    const secondPageContent = (
        <div>
            <p>Contenu du post</p>
            <p>Contenu du post</p>
            <p>Contenu du post</p>
            <p>Contenu du post</p>
            <p>Contenu du post</p>
            <p>Contenu du post</p>
            <p>Contenu du post</p>
            <p>Contenu du post</p>
            <p>Contenu du post</p>
        </div>
    );

    return (
        <Dialog onClose={handleClose} open={open} fullWidth maxWidth='lg' ref={containerRef} sx={[{'& .MuiDialog-paper, & .MuiDialogContent-root': { overflow: 'hidden' }}]}>            
            <DialogTitle align='center' height='64px'>
                <Slide direction='right' in={!checked} container={containerRef.current} timeout={!isJustOpened ? timeout : 0}>
                    <Box sx={{position: 'absolute', left: 0, right: 0}}>
                            {firstPageTitle}
                    </Box>
                </Slide>
                <Slide direction='left' in={checked} container={containerRef.current} timeout={!isJustOpened ? timeout : 0}>
                    <Box sx={{position: 'absolute', left: 0, right: 0}}>
                            {secondPageTitle}
                    </Box>
                </Slide>
            </DialogTitle>
            <DialogContent dividers sx={{position: 'relative', height: '600px'}}>
                <Slide direction='right' in={!checked} container={containerRef.current} timeout={!isJustOpened ? timeout : 0}>
                    <Box sx={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '16px 24px', overflowY: 'auto'}}>
                        {firstPageContent}
                    </Box>
                </Slide>
                <Slide direction='left' in={checked} container={containerRef.current} timeout={!isJustOpened ? timeout : 0}>
                    <Box sx={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '16px 24px', overflowY: 'auto'}}>
                        {secondPageContent}
                    </Box>
                </Slide>
            </DialogContent>
        </Dialog>
    );
};

export default Share;