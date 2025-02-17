import { Shape } from './types/shapes';
import { initializeCanvas, clearCanvas, redrawShapes, createShape, drawShape } from './utils/canvasOperations';
import { getExistingShapes, sendShapeToWebSocket } from './services/shapeService';

function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export async function initCanvas(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, token: string, selectedTool: string) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');

    let shapes: Shape[] = [];
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let currentText = "";
    let textPosition = { x: 0, y: 0 };
    let isTyping = false;

    // Create text input element
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.style.position = 'absolute';
    textInput.style.visibility = 'hidden';
    textInput.style.opacity = '0';  // Make it completely invisible
    textInput.style.pointerEvents = 'none';  // Prevent it from intercepting mouse events
    canvas.parentElement?.appendChild(textInput);

    // Add cursor animation function
    function drawCursor(x: number, y: number) {
        const cursorHeight = 20; // Match font size
        context?.save();
        context?.beginPath();
        context?.moveTo(x, y - cursorHeight);
        context?.lineTo(x, y);
        context!.strokeStyle = 'white';
        context!.lineWidth = 1;
        if (Math.floor(Date.now() / 500) % 2) { // Blink every 500ms
            context?.stroke();
        }
        context?.restore();
    }

    const debouncedSendText = debounce((text: string, x: number, y: number) => {
        const newShape = createShape(x, y, text, x, y, 'text');
        sendShapeToWebSocket(socket, newShape, roomId);
        shapes.push(newShape);
        clearCanvas(context, canvas);
        redrawShapes(context, shapes);
        isTyping = false;
        textInput.style.visibility = 'hidden';
        currentText = "";
    }, 2000);

    try {
        shapes = await getExistingShapes(roomId, token);
    } catch (error) {
        console.error('Failed to initialize canvas:', error);
        throw error;
    }

    socket.onmessage = (event: any) => {
        try {
            const message = JSON.parse(event.data);
            if (message.type === 'chat') {
                const parsedShape = JSON.parse(message.message);
                shapes.push(parsedShape);
                redrawShapes(context, shapes);
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
    };

    // Cleanup previous listeners
    const oldHandlers = (canvas as any)._handlers;
    if (oldHandlers) {
        canvas.removeEventListener("mousedown", oldHandlers.mouseDown);
        canvas.removeEventListener("mouseup", oldHandlers.mouseUp);
        canvas.removeEventListener("mousemove", oldHandlers.mouseMove);
    }

    initializeCanvas(context, canvas);
    redrawShapes(context, shapes);

    // Add cursor animation loop
    let cursorAnimationFrame: number;
    
    const animateCursor = () => {
        if (isTyping) {
            clearCanvas(context, canvas);
            redrawShapes(context, shapes);
            context.font = "20px Arial";
            context.fillStyle = "white";
            context.fillText(currentText, textPosition.x, textPosition.y);
            
            const textWidth = context.measureText(currentText).width;
            drawCursor(textPosition.x + textWidth, textPosition.y);
            
            cursorAnimationFrame = requestAnimationFrame(animateCursor);
        }
    };

    const mouseDownHandler = (e: MouseEvent) => {
        if (selectedTool === 'text') {
            const rect = canvas.getBoundingClientRect();
            textPosition = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            textInput.style.left = `${e.clientX}px`;
            textInput.style.top = `${e.clientY}px`;
            textInput.style.visibility = 'visible';
            
            // Move focus setting to the end of the event loop
            setTimeout(() => {
                textInput.focus();
            }, 0);
            
            isTyping = true;
            currentText = '';
            animateCursor();  // Start cursor animation
        } else {
            isTyping = false;
            cancelAnimationFrame(cursorAnimationFrame);
            isDrawing = true;
            startX = e.clientX - canvas.getBoundingClientRect().left;
            startY = e.clientY - canvas.getBoundingClientRect().top;
        }
    };

    const mouseUpHandler = (e: MouseEvent) => {
        if (!isDrawing || selectedTool === 'text') return;
        const rect = canvas.getBoundingClientRect();
        const newShape = createShape(
            startX,
            startY,
            currentText,
            e.clientX - rect.left,
            e.clientY - rect.top,
            selectedTool
        );
        sendShapeToWebSocket(socket, newShape, roomId);
        shapes.push(newShape);
        isDrawing = false;
        clearCanvas(context, canvas);
        redrawShapes(context, shapes);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
        if (!isDrawing || selectedTool === 'text') return;
        const rect = canvas.getBoundingClientRect();
        clearCanvas(context, canvas);
        redrawShapes(context, shapes);
        const tempShape = createShape(
            startX,
            startY,
            currentText,
            e.clientX - rect.left,
            e.clientY - rect.top,
            selectedTool
        );
        drawShape(context, tempShape);
    };

    textInput.addEventListener('input', (e: Event) => {
        const input = e.target as HTMLInputElement;
        currentText = input.value;
        clearCanvas(context, canvas);
        redrawShapes(context, shapes);
        context.font = "20px Arial";
        context.fillStyle = "white";
        context.fillText(currentText, textPosition.x, textPosition.y);
        
        // Calculate cursor position based on text width
        const textWidth = context.measureText(currentText).width;
        drawCursor(textPosition.x + textWidth, textPosition.y);
        
        debouncedSendText(currentText, textPosition.x, textPosition.y);
    });

    canvas.addEventListener("mousedown", mouseDownHandler);
    canvas.addEventListener("mouseup", mouseUpHandler);
    canvas.addEventListener("mousemove", mouseMoveHandler);

    (canvas as any)._handlers = {
        mouseDown: mouseDownHandler,
        mouseUp: mouseUpHandler,
        mouseMove: mouseMoveHandler
    };

    return {
        cleanup: () => {
            cancelAnimationFrame(cursorAnimationFrame);
            canvas.removeEventListener("mousedown", mouseDownHandler);
            canvas.removeEventListener("mouseup", mouseUpHandler);
            canvas.removeEventListener("mousemove", mouseMoveHandler);
            textInput.remove();
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        },
        isConnected: () => socket.readyState === WebSocket.OPEN
    };
}

export type { Shape } from './types/shapes';