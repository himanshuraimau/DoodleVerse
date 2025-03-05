import { Shape } from '../types/shapes';
import { generateUniqueId } from './idGenerator';

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
    const id = generateUniqueId();

    if (selectedTool === 'circle') {
        const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
        return {
            id,
            type: 'circle',
            x: startX,
            y: startY,
            radius: radius,
            isDeleted: false
        };
    } else if (selectedTool === 'text') {
        return {
            id,
            type: 'text',
            x: startX,
            y: startY,
            text: text,
            isDeleted: false
        }
    } else if (selectedTool === 'arrow') {
        return {
            id,
            type: 'arrow',
            x: startX,
            y: startY,
            width: currentX - startX,
            height: currentY - startY,
            isDeleted: false
        };
    }
    else {
        return {
            id,
            type: 'rect',
            x: startX,
            y: startY,
            width: currentX - startX,
            height: currentY - startY,
            isDeleted: false
        };
    }
}

export function eraseShapes(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, shapes: Shape[], point: { x: number, y: number }): string | null {
    // Find the shape that was clicked
    for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        if (shape.isDeleted) continue;

        if (isPointInShape(point, shape)) {
            return shape.id;
        }
    }
    return null;
}

function isPointInShape(point: { x: number, y: number }, shape: Shape): boolean {
    switch (shape.type) {
        case 'rect':
            return point.x >= shape.x && point.x <= shape.x + shape.width &&
                   point.y >= shape.y && point.y <= shape.y + shape.height;
        case 'circle':
            const distance = Math.sqrt(
                Math.pow(point.x - shape.x, 2) + Math.pow(point.y - shape.y, 2)
            );
            return distance <= shape.radius;
        case 'text':
            return point.x >= shape.x && point.x <= shape.x + 100 && // Approximate text width
                   point.y >= shape.y - 20 && point.y <= shape.y; // Approximate text height
        case 'arrow':
            // Simplified arrow hit detection using bounding box
            return point.x >= shape.x && point.x <= shape.x + shape.width &&
                   point.y >= shape.y && point.y <= shape.y + shape.height;
    }
}

export function removeShape(shapes: Shape[], shapeId: string): Shape[] {
    return shapes.map(shape => 
        shape.id === shapeId ? { ...shape, isDeleted: true } : shape
    );
}
