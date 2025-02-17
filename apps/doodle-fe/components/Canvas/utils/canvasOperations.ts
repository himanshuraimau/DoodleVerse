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

function drawArrowhead(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) {
    const headLength = 15;
    const headAngle = Math.PI / 6; // 30 degrees

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
        x - headLength * Math.cos(angle - headAngle),
        y - headLength * Math.sin(angle - headAngle)
    );
    ctx.moveTo(x, y);
    ctx.lineTo(
        x - headLength * Math.cos(angle + headAngle),
        y - headLength * Math.sin(angle + headAngle)
    );
    ctx.stroke();
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
        } else if (shape.type === 'arrow') {
            const angle = Math.atan2(shape.height, shape.width);
            const endX = shape.x + shape.width;
            const endY = shape.y + shape.height;
            
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            drawArrowhead(ctx, endX, endY, angle);
        }
    }
}

export function redrawShapes(ctx: CanvasRenderingContext2D, shapes: Shape[]) {
    shapes.forEach(shape => drawShape(ctx, shape));
}

export function createShape(startX: number, startY: number, text: string, currentX: number, currentY: number, selectedTool: string): Shape {
    if (selectedTool === 'circle') {
        const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
        return {
            type: 'circle',
            x: startX,
            y: startY,
            radius: radius
        };
    } else if (selectedTool === 'text') {
        return {
            type: 'text',
            x: startX,
            y: startY,
            text: text
        }
    } else if (selectedTool === 'arrow') {
        return {
            type: 'arrow',
            x: startX,
            y: startY,
            width: currentX - startX,
            height: currentY - startY
        };
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
