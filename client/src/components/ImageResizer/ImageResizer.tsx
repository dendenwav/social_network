import { Check, Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";

interface ImageResizerProps {
    open: boolean;
    onClose: (imageToRender?: ResizeableEle) => void;
    image: string;
    imageHeight: number;
    imageWidth: number;
};

interface ResizeableEle {
    top: number;
    left: number;
    width: number;
    height: number;
};

const ImageResizer = (props: ImageResizerProps) => {
    const { onClose, open, image, imageHeight, imageWidth } = props;
    const [imageHeightToRender, setImageHeightToRender] = useState(window.innerHeight - 64);
    const [imageWidthToRender, setImageWidthToRender] = useState(600);

    const setImageRenderValues = (initialHeight: number, initialWidth: number) => {
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
    };

    useEffect(() => {
        setImageRenderValues(imageHeight, imageWidth);
    }, [image, imageHeight, imageWidth]);

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open} maxWidth='sm' sx={[{'& .MuiDialog-paper': { height: `${imageHeightToRender + 64}px`, width: `${imageWidthToRender}px` }}]}>
            <DialogTitle align='center'>
                Redimensionner l'image
                <IconButton onClick={handleClose} sx={{position: 'absolute', left: 12, top: '12px'}}>
                    <Close />
                </IconButton>
                <IconButton onClick={handleClose} sx={{position: 'absolute', right: 12, top: '12px'}}>
                    <Check />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{
                backgroundImage: `url(${image})`, 
                backgroundSize: `${imageWidthToRender}px ${imageHeightToRender}px`, 
                height: `${imageHeightToRender}px`, 
                width: `${imageWidthToRender}px`,
                overflow: 'hidden',
                position: 'relative'
            }}>
                {
                    open &&
                    (
                        <Rnd
                            default={{
                                x: 0,
                                y: 0,
                                width: 100,
                                height: 100,
                            }}
                            minWidth={20}
                            minHeight={20}
                            bounds="parent"
                            lockAspectRatio={1}
                        >
                            <div
                                className="box"
                                style={{ margin: 0, height: '100%', paddingBottom: '40px' }}
                            >

                            </div>
                        </Rnd>
                    )
                }
                
            </DialogContent>
        </Dialog>
    );
}

export default ImageResizer;