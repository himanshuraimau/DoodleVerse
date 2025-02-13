import { HTTP_URL } from '../../config';
import axios from 'axios';

export type Shape = {
    type: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
}

export function initializeCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
}

export function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
}

export function redrawShapes(ctx: CanvasRenderingContext2D, shapes: Shape[]) {
    shapes.forEach(shape => drawShape(ctx, shape));
}

export function createShape(startX: number, startY: number, currentX: number, currentY: number): Shape {
    return {
        type: 'rect',
        x: startX,
        y: startY,
        width: currentX - startX,
        height: currentY - startY
    };
}

export async function getExistingShapes(roomId: string, token: string) {
    const res = await axios.get(`${HTTP_URL}/room/${roomId}/chats`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const messages = res.data.messages;
    return messages.map((x: { message: string }) => JSON.parse(x.message));
}
