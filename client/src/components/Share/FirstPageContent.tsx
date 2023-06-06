import { Crop, Mode } from "@mui/icons-material";
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

const FirstPageContent = ({isImageLoaded, setIsImageLoaded, picture, setPicture}: FirstPageContentProps) => {
    const defaultResizeableEle: ResizeableEle = {top: 0, left: 0, width: 0, height: 0};
    const { enqueueSnackbar } = useSnackbar();

    const [openImageResizer, setOpenImageResizer] = useState(false);
    const [pictureWidth, setPictureWidth] = useState(0);
    const [pictureHeight, setPictureHeight] = useState(0);
    const [imageHeightToRender, setImageHeightToRender] = useState(window.innerHeight - 64);
    const [imageWidthToRender, setImageWidthToRender] = useState(600);
    const [resizeableEle, setResizeableEle] = useState<ResizeableEle>(defaultResizeableEle);

    const setImageRenderValues = useCallback((initialHeight: number, initialWidth: number) => {
        setIsImageLoaded(false);
        const imageRatio = initialWidth / initialHeight;
        const maxImageRatio = 600 / (window.innerHeight - 128);

        let width = 0;
        let height = 0;

        if (imageRatio < maxImageRatio) {
            width = (window.innerHeight - 128) * imageRatio;
            height = window.innerHeight - 128;
            setImageWidthToRender(width);
            setImageHeightToRender(height);
        } else {
            width = 600;
            height = 600 / imageRatio;
            setImageWidthToRender(width);
            setImageHeightToRender(height);
        }

        if (imageRatio > 1) {
            setResizeableEle({
                top: 0, 
                left: (width - height) / 2, 
                width: height, 
                height: height
            });
        } else {
            setResizeableEle({
                top: (height - width) / 2,
                left: 0,
                width: width,
                height: width
            });
        }
        setIsImageLoaded(true);
    }, [setIsImageLoaded]);
    
    useEffect(() => {
        if (pictureHeight > 0 && pictureWidth > 0) {
            console.log("set image render values");
            setImageRenderValues(pictureHeight, pictureWidth);
        }
    }, [pictureHeight, pictureWidth, setImageRenderValues]);
    
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
                            {isImageLoaded && resizeableEle !== defaultResizeableEle && (
                                <ImageResizer 
                                    open={openImageResizer} 
                                    onClose={handleClose} 
                                    image={picture} 
                                    imageHeightToRender={imageHeightToRender} 
                                    imageWidthToRender={imageWidthToRender} 
                                    defaultResizeableEle={resizeableEle}
                                />
                            )}
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
    )
}

export default FirstPageContent;
