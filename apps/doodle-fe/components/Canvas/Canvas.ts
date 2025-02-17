import { HTTP_URL } from "@/config";
import axios from "axios"

export type Shape =
    {
        type: 'rect';
        x: number;
        y: number;
        width: number;
        height: number;
    } | {
        type: 'circle';
        x: number;
        y: number;
        radius: number;
    };

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
    if (shape.type === 'rect') {
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
    else if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

function redrawShapes(ctx: CanvasRenderingContext2D, shapes: Shape[]) {
    shapes.forEach(shape => drawShape(ctx, shape));
}

function createShape(startX: number, startY: number, currentX: number, currentY: number, selectedTool: string): Shape {
    if (selectedTool === 'circle') {
        const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
        return {
            type: 'circle',
            x: startX,
            y: startY,
            radius: radius
        };
    } else {
        return {
            type: 'rect',
            x: startX,
            y: startY,
            width: currentX - startX,
            height: currentY - startY
        };
    }
}


export async function initCanvas(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, token: string,selectedTool:string) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');

    let shapes: Shape[] = [];

    try {
        // Initialize shapes from existing data
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
    redrawShapes(context, shapes);

    const mouseDownHandler = (e: MouseEvent) => {
        isDrawing = true;
        startX = e.clientX;
        startY = e.clientY;
    };

    const mouseUpHandler = (e: MouseEvent) => {
        if (!isDrawing) return;
        const newShape = createShape(startX, startY, e.clientX, e.clientY, selectedTool);

        if (socket.readyState === WebSocket.OPEN) {
            try {
                socket.send(JSON.stringify({
                    type: 'chat',
                    message: JSON.stringify(newShape),
                    roomId: roomId,
                }));
                shapes.push(newShape);
            } catch (error) {
                console.error('Error sending shape through WebSocket:', error);
            }
        } else {
            console.warn('WebSocket not ready');
        }

        isDrawing = false;
        clearCanvas(context, canvas);
        redrawShapes(context, shapes);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
        if (!isDrawing) return;
        clearCanvas(context, canvas);
        redrawShapes(context, shapes);
        const tempShape = createShape(startX, startY, e.clientX, e.clientY, selectedTool);
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

    // Enhanced cleanup function
    return {
        cleanup: () => {
            canvas.removeEventListener("mousedown", mouseDownHandler);
            canvas.removeEventListener("mouseup", mouseUpHandler);
            canvas.removeEventListener("mousemove", mouseMoveHandler);
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        },
        isConnected: () => socket.readyState === WebSocket.OPEN
    };
}

async function getExistingShapes(roomId: string, token: string) {
    const res = await axios.get(`${HTTP_URL}/room/${roomId}/chats`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const messages = res.data.messages;
    return messages.map((x: { message: string }) => JSON.parse(x.message));
}