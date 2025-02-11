type Shape = {
    type: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: 'circle';
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: 'line';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}




export function initDraw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    let clicked = false;
    let startX = 0;
    let startY = 0;

    let existingShapes: Shape[] = [];
    // Set initial canvas background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set stroke style to white
    ctx.strokeStyle = "white";

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    })
    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        existingShapes.push({
            type: 'rect',
            x: startX,
            y: startY,
            width,
            height
        })
    })
    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, ctx, canvas);
            ctx.strokeStyle = "rgba(255, 255,255,1)";
            ctx.strokeRect(startX, startY, width, height);

        }
    })
}



function clearCanvas(existingShapes: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.forEach(shape => {
        if (shape.type === 'rect') {

            ctx.strokeStyle = "rgba(255, 255,255,1)";
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}