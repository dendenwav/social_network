import { useEffect, useRef, useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";

import FirstPageTitle from "./FirstPageTitle";
import SecondPageTitle from "./SecondPageTitle";
import FirstPageContent from "./FirstPageContent";
import SecondPageContent from "./SecondPageContent";

interface DialogProps {
    open: boolean;
    onClose: () => void;
};

const timeout = 300;

const Share = (props: DialogProps) => {
    const [checked, setChecked] = useState(false);
    const [isJustOpened, setIsJustOpened] = useState(true);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [picture, setPicture] = useState<any>(null);
    
    const { onClose, open } = props;
    const containerRef = useRef<any>(null);

    useEffect(() => {
        if (picture && !isImageLoaded) {
            setIsImageLoaded(true);
        }
    }, [picture, isImageLoaded]);

    useEffect(() => {
        if(open && isJustOpened) {
            setIsJustOpened(false);
        }
    }, [open, isJustOpened]);
    
    const cleanUp = async () => {
        await new Promise((resolve) => setTimeout(resolve, 225));
        setChecked(false);
        setIsJustOpened(true);
        setPicture(null);
        setIsImageLoaded(false);
    }

    const handleSwipe = () => {
        setChecked((prev) => !prev);
    };

    const handleClose = async () => {
        onClose();
        await cleanUp();
    };
    
    const handlePost = async () => {
        onClose();
        await cleanUp();
        
    };

    return (
        <Dialog onClose={handleClose} open={open} fullWidth maxWidth='lg' ref={containerRef} sx={[{'& .MuiDialog-paper, & .MuiDialogContent-root': { overflow: 'hidden' }}]}>            
            <DialogTitle align='center' height='64px'>
                <Slide direction='right' in={!checked} container={containerRef.current} timeout={!isJustOpened ? timeout : 0}>
                    <Box sx={{position: 'absolute', left: 0, right: 0}}>
                        <FirstPageTitle handleClose={handleClose} handleSwipe={handleSwipe} isImageLoaded={isImageLoaded}/>
                    </Box>
                </Slide>
                <Slide direction='left' in={checked} container={containerRef.current} timeout={!isJustOpened ? timeout : 0}>
                    <Box sx={{position: 'absolute', left: 0, right: 0}}>
                        <SecondPageTitle handleSwipe={handleSwipe} handlePost={handlePost}/>
                    </Box>
                </Slide>
            </DialogTitle>
            <DialogContent dividers sx={{position: 'relative', height: '600px'}}>
                <Slide direction='right' in={!checked} container={containerRef.current} timeout={!isJustOpened ? timeout : 0}>
                    <Box sx={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '16px 24px', overflowY: 'auto'}}>
                        <FirstPageContent isImageLoaded={isImageLoaded} setIsImageLoaded={setIsImageLoaded} picture={picture} setPicture={setPicture}/>
                    </Box>
                </Slide>
                <Slide direction='left' in={checked} container={containerRef.current} timeout={!isJustOpened ? timeout : 0}>
                    <Box sx={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '16px 24px', overflowY: 'auto'}}>
                        <SecondPageContent/>
                    </Box>
                </Slide>
            </DialogContent>
        </Dialog>
    );
};

export default Share;