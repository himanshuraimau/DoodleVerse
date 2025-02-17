import { Shape } from '../types/shapes';

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
    if (shape.type === 'text') {
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(shape.text, shape.x, shape.y);
    } else {
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
}

export function redrawShapes(ctx: CanvasRenderingContext2D, shapes: Shape[]) {
    shapes.forEach(shape => drawShape(ctx, shape));
}

export function createShape(startX: number, startY: number,text:string, currentX: number, currentY: number, selectedTool: string): Shape {
    if (selectedTool === 'circle') {
        const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
        return {
            type: 'circle',
            x: startX,
            y: startY,
            radius: radius
        };
    } else if(selectedTool === 'text'){
        return{
            type: 'text',
            x: startX,
            y: startY,
            text: text
        }
    } 
    else {
        return {
            type: 'rect',
            x: startX,
            y: startY,
            width: currentX - startX,
            height: currentY - startY
        };
    }
}
