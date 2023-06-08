import { Crop, Mode, SaveAlt } from "@mui/icons-material";
import { Button } from "@mui/material";
import ImageResizer from "../ImageResizer/ImageResizer";
import { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "notistack";

export interface ResizeableEle {
    top: number;
    left: number;
    width: number;
    height: number;
};

interface FirstPageContentProps {
    isImageLoaded: boolean;
    setIsImageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
    picture: any;
    setPicture: React.Dispatch<React.SetStateAction<any>>;
};

const FirstPageContent = ({setIsImageLoaded, picture, setPicture}: FirstPageContentProps) => {
    const { enqueueSnackbar } = useSnackbar();
    const defaultResizeableEle: ResizeableEle = {top: 0, left: 0, width: 0, height: 0};

    const [openImageResizer, setOpenImageResizer] = useState(false);
    const [imageHeight, setImageHeight] = useState(0);
    const [imageWidth, setImageWidth] = useState(0);
    const [resizeableEle, setResizeableEle] = useState<ResizeableEle>(defaultResizeableEle);
    const [imageResizerHeight, setImageResizerHeight] = useState(window.innerHeight - 64);
    const [imageResizerWidth, setImageResizerWidth] = useState(600);
    const [backgroundSize, setBackgroundSize] = useState('auto 518px');
    const [backgroundPosition, setBackgroundPosition] = useState('0 0');

    const setImageResizerValues = (initialHeight: number, initialWidth: number): ResizeableEle => {
        const imageRatio = initialWidth / initialHeight;
        const maxImageRatio = 600 / (window.innerHeight - 128);

        let width = 0;
        let height = 0;

        if (imageRatio < maxImageRatio) {
            width = (window.innerHeight - 128) * imageRatio;
            height = window.innerHeight - 128;
            setImageResizerWidth(width);
            setImageResizerHeight(height);
        } else {
            width = 600;
            height = 600 / imageRatio;
            setImageResizerWidth(width);
            setImageResizerHeight(height);
        }

        if (imageRatio > 1) {
            return {
                top: 0, 
                left: (width - height) / 2, 
                width: height, 
                height: height
            };
        } else {
            return {
                top: (height - width) / 2,
                left: 0,
                width: width,
                height: width
            };
        }
    };

    const setBackgroundSizeAndPosition = useCallback((newResizeableEle: ResizeableEle, initialHeight: number, initialWidth: number) => {
        setImageHeight(initialHeight);
        setImageWidth(initialWidth);

        const maxSide = 518;
        setIsImageLoaded(false);

        const imageRatio = initialWidth / initialHeight;

        let widthBackgound: String = 'auto';
        let heightBackground: String = 'auto';

        let topPosition: Number = 0;
        let leftPosition: Number = 0;

        if (imageRatio > 1) {
            const heightResult = Math.round(imageResizerHeight * maxSide / newResizeableEle.height);
            const backgroundRatio = heightResult / maxSide;

            topPosition = Math.round((newResizeableEle.top * maxSide * backgroundRatio) / imageResizerHeight);
            leftPosition = Math.round((newResizeableEle.left * maxSide * backgroundRatio * imageRatio) / imageResizerWidth);

            heightBackground = `${heightResult}px`;
        } else {
            const widthResult = Math.round(imageResizerWidth * maxSide / newResizeableEle.width);
            const backgroundRatio = widthResult / 518;

            topPosition = Math.round((newResizeableEle.top * maxSide * backgroundRatio) / (imageResizerHeight * imageRatio));
            leftPosition = Math.round((newResizeableEle.left * maxSide * backgroundRatio) / (imageResizerWidth));

            widthBackgound = `${widthResult}px`;
        }

        setBackgroundSize(`${widthBackgound} ${heightBackground}`);
        setBackgroundPosition(`${-leftPosition}px ${Math.round(-topPosition)}px`);
        
        setIsImageLoaded(true);
    }, [imageResizerHeight, imageResizerWidth, setIsImageLoaded]);

    useEffect(() => {
        if (resizeableEle.width > 0 && resizeableEle.height > 0) {
            setBackgroundSizeAndPosition(resizeableEle, imageHeight, imageWidth);
        }
    }, [resizeableEle, imageHeight, imageWidth, setBackgroundSizeAndPosition]);
    
    const handleFileInput = (e: any) => {
        if (resizeableEle !== defaultResizeableEle) {
            setResizeableEle(defaultResizeableEle);
        }

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
            setIsImageLoaded(false);

            const result = setImageResizerValues(i.height, i.width);

            setResizeableEle(result);
            setImageHeight(i.height);
            setImageWidth(i.width);

            setIsImageLoaded(true);
        };

        e.target.value = null;
    };
    
    const handleOpen = () => {
        setOpenImageResizer(true);
    };

    const handleClose = (newResizeableEle?: ResizeableEle) => {
        if (newResizeableEle) {
            setResizeableEle(newResizeableEle);
        }
        setOpenImageResizer(false);
    };

    return (        
        <div>
        {
            (picture !== null) ? (
                <div className="image-container full">
                    <div className="image-full-content">
                        <div className="image-info">
                            <p>image infos</p>
                        </div>
                        <div
                            className="image-overview" 
                            style={{
                                backgroundImage: `url(${picture})`,
                                backgroundSize: backgroundSize,
                                backgroundPosition: backgroundPosition,
                            }}
                        >
                            <div className="image-overlay" >
                                <Button fullWidth variant="outlined" component="label" color="secondary" size="large" onClick={handleOpen} startIcon={<Crop/>}>
                                    Redimensionner l'image
                                </Button>
                                <Button fullWidth variant="outlined" component="label" color="secondary" size="large" startIcon={<Mode/>}>
                                    Changer l'image                                
                                    <input 
                                        type="file" 
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileInput}
                                        />
                                </Button>                            
                                {resizeableEle !== defaultResizeableEle && (
                                    <ImageResizer 
                                    open={openImageResizer} 
                                    onClose={handleClose} 
                                    image={picture} 
                                    imageResizerHeight={imageResizerHeight} 
                                    imageResizerWidth={imageResizerWidth} 
                                    defaultResizeableEle={resizeableEle}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )
            : (
                <div className="image-container empty">
                    <div className="image-empty-content">
                        <div className="image-empty-header">
                            <div className="image-empty-icon">
                                <SaveAlt/>
                            </div>
                            <div className="image-empty-title">Glisser déposer une image ici</div>
                            <div className="image-empty-subtitle">ou</div>
                        </div>
                        <Button variant="outlined" component="label" color="secondary">
                            PARCOURIR LES FICHIERS
                            <input 
                                type="file" 
                                hidden
                                accept="image/*"
                                onChange={handleFileInput}
                            />
                        </Button>
                    </div>
                </div>
            )
        }
        </div>
    )
}

export default FirstPageContent;
