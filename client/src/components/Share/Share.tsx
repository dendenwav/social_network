import { useEffect, useRef, useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Slide } from "@mui/material";
import { ArrowBack, ArrowForward, Close, Check, Crop, Delete } from '@mui/icons-material';
import { useSnackbar } from "notistack";

import ImageResizer from "../ImageResizer/ImageResizer";

interface DialogProps {
    open: boolean;
    onClose: () => void;
};

const timeout = 300;

const Share = (props: DialogProps) => {    
    const [openImageResizer, setOpenImageResizer] = useState(false);
    const [checked, setChecked] = useState(false);
    const [isJustOpened, setIsJustOpened] = useState(true);
    const [picture, setPicture] = useState<any>(null);
    const [pictureWidth, setPictureWidth] = useState(0);
    const [pictureHeight, setPictureHeight] = useState(0);
    
    const { onClose, open } = props;
    const containerRef = useRef<any>(null);
    const { enqueueSnackbar } = useSnackbar();

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
    }

    const handleSwipe = () => {
        setChecked((prev) => !prev);
    };

    const handleDeletePicture = (e: React.InputHTMLAttributes<HTMLInputElement>) => {
        setPicture(null);
    };

    const handleClose = async () => {
        onClose();
        await cleanUp();
    };
    
    const handleClickOpen = () => {
        setOpenImageResizer(true);
    };

    const handleCloseImageResizer = () => {
        setOpenImageResizer(false);
    };
    
    const handleFileInput = (e: any) => {
        var i = new Image();
        var reader = new FileReader();        
        reader.readAsDataURL(e.target.files[0]);

        reader.onload = function () {
            i.src = reader.result as string;
            setPicture(reader.result);
            enqueueSnackbar("L'image a correctement été importé", { variant: 'success' }, );
        };

        reader.onerror = function (error) {
            console.log('Error: ', error);
            enqueueSnackbar("Une erreur est survenue lors de l'import de l'image. Veuillez rééssayer !", { variant: 'error' }, );
        };        

        i.onload = function () {
            console.log(i.width, i.height);
            setPictureHeight(i.height);
            setPictureWidth(i.width);
        };

        e.target.value = null;
    };
    
    const handlePost = async () => {
        onClose();
        await cleanUp();
        
    };
    
    const firstPageTitle = (
        <div>
            Créer un post (1/2)
            <IconButton onClick={handleClose} sx={{position: 'absolute', left: 12, top: '-4px'}}>
                <Close />
            </IconButton>
            <IconButton onClick={handleSwipe} disabled={picture == null} title={picture == null ? "veuillez ajoutez une image pour passez à la suite." : undefined}  sx={{position: 'absolute', right: 12, top: '-4px'}}>
                <ArrowForward/>
            </IconButton>
        </div>
    );

    const secondPageTitle = (
        <div>
            Créer un post (2/2)
            <IconButton onClick={handleSwipe} sx={{position: 'absolute', left: 12, top: '-4px'}}>
                <ArrowBack />
            </IconButton>
            <IconButton onClick={handlePost} sx={{position: 'absolute', right: 12, top: '-4px'}}>
                <Check />
            </IconButton>
        </div>
    );

    const firstPageContent = (
        <div>
            <Button variant="outlined" component="label" color="secondary">
                Upload File
                <input 
                    type="file" 
                    hidden
                    accept="image/*"
                    onChange={handleFileInput}
                />
            </Button>
            {
                picture !== null ? (
                    <div className="image-container">
                        <img src={picture} alt="preview" className="uploaded-image"/>
                        <div className="image-overlay" >
                            <Button fullWidth variant="outlined" component="label" color="secondary" size="large" onClick={handleClickOpen} startIcon={<Crop/>}>
                                Redimensionner l'image
                            </Button>
                            <Button fullWidth variant="outlined" component="label" color="secondary" size="large" onClick={handleDeletePicture} startIcon={<Delete/>}>
                                Supprimer l'image
                            </Button>
                            <ImageResizer open={openImageResizer} onClose={handleCloseImageResizer} image={picture} imageHeight={pictureHeight} imageWidth={pictureWidth}/>
                        </div>
                    </div>
                )
                : (
                    <div className="image-container empty">

                    </div>
                )
            }
            <p>Contenu du post</p>
            <p>Contenu du post</p>
            <p>Contenu du post</p>
            <p>Contenu du post</p>
            <p>Contenu du post </p>
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