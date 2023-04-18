import { Check, Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";

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
    const ref = useRef<HTMLDivElement>(null);
    const refLeft = useRef<HTMLDivElement>(null);
    const refTop = useRef<HTMLDivElement>(null);
    const refRight = useRef<HTMLDivElement>(null);
    const refBottom = useRef<HTMLDivElement>(null);
    const [imageHeightToRender, setImageHeightToRender] = useState(window.innerHeight - 64);
    const [imageWidthToRender, setImageWidthToRender] = useState(600);

    const setImageRenderValues = (initialHeight: number, initialWidth: number) => {
        const imageRatio = initialWidth / initialHeight;
        console.log("imageRatio ", imageRatio);
        const maxImageRatio = 600 / (window.innerHeight - 128);
        console.log("maxImageRatio ", maxImageRatio);

        let width = 0;
        let height = 0;

        if (imageRatio < maxImageRatio) {
            height = window.innerHeight - 64;
            width = 600;
            console.log("if");
            console.log("width ", width);
            console.log("height ", height);
            setImageWidthToRender(width);
            setImageHeightToRender(height);
        } else {
            width = 600;
            height = 600 / imageRatio;
            console.log("else");
            console.log("width ", width);
            console.log("height ", height);
            setImageWidthToRender(width);
            setImageHeightToRender(height);
        }
    };

    useEffect(() => {
        if (ref.current) {
            const resizeableEle: HTMLDivElement = ref.current;
            const styles = window.getComputedStyle(resizeableEle);
            let width = parseInt(styles.width, 10);
            let height = parseInt(styles.height, 10);
            let x = 0;
            let y = 0;

            resizeableEle.style.top = "50px";
            resizeableEle.style.left = "50px";

            // Right resize
            const onMouseMoveRightResize = (event: MouseEvent) => {
                const dx = event.clientX - x;
                x = event.clientX;
                width = width + dx;
                resizeableEle.style.width = `${width}px`;
            };

            const onMouseUpRightResize = (event: MouseEvent) => {
                document.removeEventListener("mousemove", onMouseMoveRightResize);
            };

            const onMouseDownRightResize = (event: MouseEvent) => {
                x = event.clientX;
                resizeableEle.style.left = styles.left;
                resizeableEle.style.right = "";
                document.addEventListener("mousemove", onMouseMoveRightResize);
                document.addEventListener("mouseup", onMouseUpRightResize);
            };

            // Top resize
            const onMouseMoveTopResize = (event: MouseEvent) => {
                const dy = event.clientY - y;
                height = height - dy;
                y = event.clientY;
                resizeableEle.style.height = `${height}px`;
            };

            const onMouseUpTopResize = (event: MouseEvent) => {
                document.removeEventListener("mousemove", onMouseMoveTopResize);
            };

            const onMouseDownTopResize = (event: MouseEvent) => {
                y = event.clientY;
                const styles = window.getComputedStyle(resizeableEle);
                resizeableEle.style.bottom = styles.bottom;
                resizeableEle.style.top = "";
                document.addEventListener("mousemove", onMouseMoveTopResize);
                document.addEventListener("mouseup", onMouseUpTopResize);
            };

            // Bottom resize
            const onMouseMoveBottomResize = (event: MouseEvent) => {
            const dy = event.clientY - y;
            height = height + dy;
            y = event.clientY;
            resizeableEle.style.height = `${height}px`;
            };

            const onMouseUpBottomResize = (event: MouseEvent) => {
                document.removeEventListener("mousemove", onMouseMoveBottomResize);
            };

            const onMouseDownBottomResize = (event: MouseEvent) => {
                y = event.clientY;
                const styles = window.getComputedStyle(resizeableEle);
                resizeableEle.style.top = styles.top;
                resizeableEle.style.bottom = "";
                document.addEventListener("mousemove", onMouseMoveBottomResize);
                document.addEventListener("mouseup", onMouseUpBottomResize);
            };

            // Left resize
            const onMouseMoveLeftResize = (event: MouseEvent) => {
                const dx = event.clientX - x;
                x = event.clientX;
                width = width - dx;
                resizeableEle.style.width = `${width}px`;
            };

            const onMouseUpLeftResize = (event: MouseEvent) => {
                document.removeEventListener("mousemove", onMouseMoveLeftResize);
            };

            const onMouseDownLeftResize = (event: MouseEvent) => {
                x = event.clientX;
                resizeableEle.style.right = styles.right;
                resizeableEle.style.left = "";
                document.addEventListener("mousemove", onMouseMoveLeftResize);
                document.addEventListener("mouseup", onMouseUpLeftResize);
            };

            // Add mouse down event listener
            if  (!refRight.current || !refTop.current || !refBottom.current || !refLeft.current) {
                return;
            }

            const resizerRight = refRight.current;
            resizerRight.addEventListener("mousedown", onMouseDownRightResize);
            const resizerTop = refTop.current;
            resizerTop.addEventListener("mousedown", onMouseDownTopResize);
            const resizerBottom = refBottom.current;
            resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);
            const resizerLeft = refLeft.current;
            resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);

            return () => {
                resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
                resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
                resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
                resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
            };
        }
    }, []);

    useEffect(() => {
        setImageRenderValues(imageHeight, imageWidth);
    }, []);

    const handleClose = () => {
        onClose();
    };

    const handleValidate = () => {
        if (ref.current) {
            const resizeableEle: HTMLDivElement = ref.current;
            const styles = window.getComputedStyle(resizeableEle);
            const width = parseInt(styles.width, 10);
            const height = parseInt(styles.height, 10);
            const top = parseInt(styles.top, 10);
            const left = parseInt(styles.left, 10);
            const right = parseInt(styles.right, 10);
            const bottom = parseInt(styles.bottom, 10);
            const imageWidth = imageHeight * (width / height);
            const imageLeft = imageWidth * (left / width);
            const imageRight = imageWidth * (right / width);
            const imageTop = imageHeight * (top / height);
            const imageBottom = imageHeight * (bottom / height);
            const imageWidthToRender = imageWidth - imageLeft - imageRight;
            const imageHeightToRender = imageHeight - imageTop - imageBottom;
            const imageToRender = {
                width: imageWidthToRender,
                height: imageHeightToRender,
                left: imageLeft,
                top: imageTop,
            };
            onClose(imageToRender);
        }
    };

    return (
        <Dialog onClose={handleClose} open={open} maxWidth='sm' sx={[{'& .MuiDialog-paper': { height: `${imageHeightToRender + 64}px`, width: `${imageWidthToRender}px` }}]}>
            <DialogTitle align='center'>
                Redimensionner l'image
                <IconButton onClick={handleClose} sx={{position: 'absolute', left: 12, top: '12px'}}>
                    <Close />
                </IconButton>
                <IconButton onClick={handleValidate} sx={{position: 'absolute', right: 12, top: '12px'}}>
                    <Check />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{backgroundImage: `url(${image})`, backgroundSize: `${imageWidthToRender}px ${imageHeightToRender}px`}}>
                <div className="container">
                    <div ref={ref} className="resizeable">
                        <div ref={refLeft} className="resizer resizer-l"></div>
                        <div ref={refTop} className="resizer resizer-t"></div>
                        <div ref={refRight} className="resizer resizer-r"></div>
                        <div ref={refBottom} className="resizer resizer-b"></div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ImageResizer;