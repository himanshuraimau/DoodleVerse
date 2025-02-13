import { HTTP_URL } from '@/config';
import axios from 'axios';

type Shape = {
    type: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
}

// Store shapes globally
let shapes: Shape[] = [];

function initializeCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
}

function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
}

function redrawShapes(ctx: CanvasRenderingContext2D) {
    shapes.forEach(shape => drawShape(ctx, shape));
}

function createShape(startX: number, startY: number, currentX: number, currentY: number): Shape {
    return {
        type: 'rect',
        x: startX,
        y: startY,
        width: currentX - startX,
        height: currentY - startY
    };
}

export async function initCanvas(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, token: string) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');

    socket.onmessage = (event: any) => {
        const message = JSON.parse(event.data);
        if (message.type === 'chat') {
            const parsedShape = JSON.parse(message.message);
            shapes.push(parsedShape);
            redrawShapes(context);
        }
    }

    let isDrawing = false;
    let startX = 0;
    let startY = 0;

    // Cleanup previous listeners if they exist
    const oldHandlers = (canvas as any)._handlers;
    if (oldHandlers) {
        canvas.removeEventListener("mousedown", oldHandlers.mouseDown);
        canvas.removeEventListener("mouseup", oldHandlers.mouseUp);
        canvas.removeEventListener("mousemove", oldHandlers.mouseMove);
    }

    initializeCanvas(context, canvas);
    redrawShapes(context);

    const mouseDownHandler = (e: MouseEvent) => {
        isDrawing = true;
        startX = e.clientX;
        startY = e.clientY;
    };

    const mouseUpHandler = (e: MouseEvent) => {
        if (!isDrawing) return;
        const newShape = createShape(startX, startY, e.clientX, e.clientY);
        shapes.push(newShape);
        // Send the new shape to the WebSocket
        socket.send(JSON.stringify({
            type: 'chat',
            message: JSON.stringify(newShape),
            roomId: roomId,
        }));
        isDrawing = false;
    };

    const mouseMoveHandler = (e: MouseEvent) => {
        if (!isDrawing) return;
        clearCanvas(context, canvas);
        redrawShapes(context);
        const tempShape = createShape(startX, startY, e.clientX, e.clientY);
        drawShape(context, tempShape);
    };

    canvas.addEventListener("mousedown", mouseDownHandler);
    canvas.addEventListener("mouseup", mouseUpHandler);
    canvas.addEventListener("mousemove", mouseMoveHandler);

    // Store handlers for cleanup
    (canvas as any)._handlers = {
        mouseDown: mouseDownHandler,
        mouseUp: mouseUpHandler,
        mouseMove: mouseMoveHandler
    };

    return {
        cleanup: () => {
            canvas.removeEventListener("mousedown", mouseDownHandler);
            canvas.removeEventListener("mouseup", mouseUpHandler);
            canvas.removeEventListener("mousemove", mouseMoveHandler);
        }
    };
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_URL}/chats/${roomId}`);
    const messages = res.data.messages;
    return messages.map((x: { message: string }) => JSON.parse(x.message));
}
