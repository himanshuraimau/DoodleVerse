import { Shape } from './types/shapes';
import { initializeCanvas, clearCanvas, redrawShapes, createShape, drawShape, eraseShapes } from './utils/canvasOperations';
import { getExistingShapes, sendShapeToWebSocket, sendEraseShapeToWebSocket } from './services/shapeService';

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
    let currentTool = selectedTool;
    let isErasing = false;
    const ERASER_SIZE = 20;

    const updateTool = (newTool: string) => {
        currentTool = newTool;
        // Remove custom cursor when switching tools
        if (newTool !== 'eraser') {
            canvas.style.cursor = 'default';
        }
        // Update cursor style based on tool
        switch (newTool) {
            case 'eraser':
                canvas.style.cursor = 'crosshair';
                break;
            case 'text':
                canvas.style.cursor = 'text';
                break;
            default:
                canvas.style.cursor = 'default';
        }
    };

    initializeCanvas(context, canvas);

    try {
        const existingShapes = await getExistingShapes(roomId, token);
        shapes = existingShapes;
        redrawShapes(context, shapes);
    } catch (error) {
        console.error('Failed to fetch existing shapes:', error);
    }

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

    function drawEraserCursor(context: CanvasRenderingContext2D, x: number, y: number) {
        context.save();
        context.beginPath();
        context.arc(x, y, ERASER_SIZE/2, 0, Math.PI * 2);
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.stroke();
        context.restore();
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

    socket.onmessage = (event: any) => {
        try {
            const message = JSON.parse(event.data);
            if (message.type === 'chat') {
                try {
                    const parsedShape = JSON.parse(message.message);
                    // Only add the shape if it's not already in the array
                    if (!shapes.some(shape => shape.id === parsedShape.id)) {
                        shapes.push(parsedShape);
                        clearCanvas(context!, canvas);
                        redrawShapes(context!, shapes);
                    }
                } catch (e) {
                    console.error('Error parsing shape:', e);
                }
            } else if (message.type === 'erase') {
                shapes = shapes.map(shape => 
                    shape.id === message.shapeId ? { ...shape, isDeleted: true } : shape
                ).filter(shape => !shape.isDeleted);
                clearCanvas(context!, canvas);
                redrawShapes(context!, shapes);
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
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;

        if (currentTool === 'eraser') {
            isDrawing = true;
            const shapeId = eraseShapes(context!, canvas, shapes, { x: startX, y: startY });
            if (shapeId) {
                sendEraseShapeToWebSocket(socket, shapeId, roomId);
                shapes = shapes.filter(shape => shape.id !== shapeId);
                clearCanvas(context!, canvas);
                redrawShapes(context!, shapes);
                drawEraserCursor(context!, startX, startY);
            }
            return;
        }

        if (currentTool === 'text') {
            isTyping = true;
            textPosition = { x: startX, y: startY };
            currentText = '';
            textInput.style.left = `${e.clientX}px`;
            textInput.style.top = `${e.clientY}px`;
            textInput.style.visibility = 'visible';
            
            // Move focus setting to the end of the event loop
            setTimeout(() => {
                textInput.focus();
            }, 0);
            
            animateCursor();  // Start cursor animation
        } else {
            isDrawing = true;
        }
    };

    const mouseMoveHandler = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        if (currentTool === 'eraser') {
            // Always show eraser cursor when tool is selected
            clearCanvas(context!, canvas);
            redrawShapes(context!, shapes);
            drawEraserCursor(context!, currentX, currentY);
            
            if (isDrawing) {
                const shapeId = eraseShapes(context!, canvas, shapes, { x: currentX, y: currentY });
                if (shapeId) {
                    sendEraseShapeToWebSocket(socket, shapeId, roomId);
                    shapes = shapes.filter(shape => shape.id !== shapeId);
                    clearCanvas(context!, canvas);
                    redrawShapes(context!, shapes);
                    drawEraserCursor(context!, currentX, currentY);
                }
            }
            return;
        }

        if (!isDrawing || !context) return;

        clearCanvas(context, canvas);
        redrawShapes(context, shapes);
        
        const tempShape = createShape(
            startX,
            startY,
            currentText,
            currentX,
            currentY,
            currentTool // Use currentTool instead of selectedTool
        );
        drawShape(context, tempShape);
    };

    const mouseUpHandler = (e: MouseEvent) => {
        if (!isDrawing || !context) return;
        if (currentTool === 'eraser' || currentTool === 'text') return;

        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const newShape = createShape(
            startX,
            startY,
            currentText,
            currentX,
            currentY,
            currentTool // Use currentTool instead of selectedTool
        );

        shapes.push(newShape);
        sendShapeToWebSocket(socket, newShape, roomId);
        
        clearCanvas(context, canvas);
        redrawShapes(context, shapes);
        isDrawing = false;
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
    canvas.addEventListener('mouseleave', mouseUpHandler);

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
            canvas.removeEventListener('mouseleave', mouseUpHandler);
            textInput.remove();
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        },
        isConnected: () => socket.readyState === WebSocket.OPEN,
        updateTool // Export the updateTool function
    };
}

export type { Shape } from './types/shapes';