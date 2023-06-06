import { ArrowForward, Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface FirstPageTitleProps {
    handleClose: () => void;
    handleSwipe: () => void;
    isImageLoaded: boolean;
}


const FirstPageTitle = ({handleClose, handleSwipe, isImageLoaded}: FirstPageTitleProps) => {
    return (        
        <div>
            Créer un post (1/2)
            <IconButton 
                onClick={handleClose} 
                sx={{position: 'absolute', left: 12, top: '-4px'}}
            >
                <Close />
            </IconButton>
            <IconButton 
                onClick={handleSwipe} 
                disabled={!isImageLoaded} 
                sx={{position: 'absolute', right: 12, top: '-4px'}}
                title={isImageLoaded ? "veuillez ajoutez une image pour passez à la suite." : undefined} 
            >
                <ArrowForward/>
            </IconButton>
        </div>
    )
}

export default FirstPageTitle;