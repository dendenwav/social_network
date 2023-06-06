import { ArrowBack, Check } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface SecondPageTitleProps {
    handleSwipe: () => void;
    handlePost: () => void;
}


const SecondPageTitle = ({handlePost, handleSwipe}: SecondPageTitleProps) => {
    return (        
        <div>
            Créer un post (2/2)
            <IconButton onClick={handleSwipe} sx={{position: 'absolute', left: 12, top: '-4px'}}>
                <ArrowBack />
            </IconButton>
            <IconButton onClick={handlePost} sx={{position: 'absolute', right: 12, top: '-4px'}}>
                <Check />
            </IconButton>
        </div>
    )
}

export default SecondPageTitle;