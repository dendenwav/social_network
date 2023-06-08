import { useEffect, useState } from "react";
import { DraggableData, ResizableDelta, Rnd, RndResizeCallback } from "react-rnd";
import { ResizeDirection } from "re-resizable";
import { Position } from "react-rnd";
import { DraggableEventHandler, DraggableEvent } from "react-draggable";
import { Check, Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

import { ResizeableEle } from "../Share/FirstPageContent";

interface ImageResizerProps {
    open: boolean;
    onClose: (imageToRender?: ResizeableEle) => void;
    image: string;
    imageResizerHeight: number;
    imageResizerWidth: number;
    defaultResizeableEle: ResizeableEle;
};

const ImageResizer = ({ onClose, open, image, imageResizerHeight, imageResizerWidth, defaultResizeableEle }: ImageResizerProps) => {
    const [resizeableEle, setResizeableEle] = useState<ResizeableEle>(defaultResizeableEle);

    useEffect(() => {
        setResizeableEle(defaultResizeableEle);
    }, [image, defaultResizeableEle]);

    const handleClose = () => {
        onClose(defaultResizeableEle);
        setResizeableEle(defaultResizeableEle);
    };
    
    const handleValidate = () => {
        onClose(resizeableEle);
    };

    const handleResize: RndResizeCallback = (e: MouseEvent | TouchEvent, direction: ResizeDirection, ref: HTMLElement, delta: ResizableDelta, position: Position) => {
        setResizeableEle({
            top: position.y,
            left: position.x,
            width: ref.offsetWidth,
            height: ref.offsetHeight
        });
    };

    const handleDrag: DraggableEventHandler = (e: DraggableEvent, d: DraggableData) => {
        setResizeableEle({
            ...resizeableEle,
            top: d.y,
            left: d.x
        });
    };

    return (
        <Dialog onClose={handleClose} open={open} maxWidth='sm' sx={[{'& .MuiDialog-paper': { height: `${imageResizerHeight + 64}px`, width: `${imageResizerWidth}px` }}]}>
            <DialogTitle align='center'>
                Redimensionner l'image
                <IconButton onClick={handleClose} sx={{position: 'absolute', left: 12, top: '12px'}}>
                    <Close />
                </IconButton>
                <IconButton onClick={handleValidate} sx={{position: 'absolute', right: 12, top: '12px'}}>
                    <Check />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{
                backgroundImage: `url(${image})`,
                backgroundSize: `${imageResizerWidth}px ${imageResizerHeight}px`, 
                height: `${imageResizerHeight}px`, 
                width: `${imageResizerWidth}px`,
                overflow: 'hidden',
                position: 'relative'
            }}>
                {
                    open &&
                    (
                        <Rnd
                            default={{
                                x: resizeableEle.left,
                                y: resizeableEle.top,
                                width: resizeableEle.width,
                                height: resizeableEle.height,
                            }}
                            resizeHandleClasses={{
                                bottom: 'resize-handle-bottom',
                                left: 'resize-handle-left',
                                right: 'resize-handle-right',
                                top: 'resize-handle-top',
                            }}
                            disableDragging={false}
                            enableResizing={{ 
                                top:true, 
                                right:true, 
                                bottom:true, 
                                left:true, 
                                topRight:false, 
                                bottomRight:false, 
                                bottomLeft:false, 
                                topLeft:false 
                            }}
                            onResize={handleResize}
                            onDrag={handleDrag}
                            minWidth={75}
                            minHeight={75}
                            bounds="parent"
                            lockAspectRatio={1}
                        >
                            <div
                                className="box"
                                style={{ margin: 0, height: '100%', paddingBottom: '40px', backgroundColor: 'rgba(255,255,255,0.3)' }}
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