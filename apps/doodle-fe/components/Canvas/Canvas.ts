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

class CanvasManager {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private existingShapes: Shape[] = [];
    private isDrawing = false;
    private startX = 0;
    private startY = 0;
    private mouseDownHandler: (e: MouseEvent) => void = () => {};
    private mouseUpHandler: (e: MouseEvent) => void = () => {};
    private mouseMoveHandler: (e: MouseEvent) => void = () => {};
    private static shapes: Shape[] = []; // Add static shapes array to persist between instances

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');
        this.ctx = context;
        this.existingShapes = CanvasManager.shapes; // Use static shapes
        this.initializeCanvas();
        this.redrawShapes(); // Redraw existing shapes on initialization
    }

    private initializeCanvas() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = "white";
    }

    private clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private redrawShapes() {
        this.existingShapes.forEach(shape => {
            this.drawShape(shape);
        });
    }

    private drawShape(shape: Shape) {
        this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        switch (shape.type) {
            case 'rect':
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                break;
            case 'circle':
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
                this.ctx.stroke();
                break;
            case 'line':
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x1, shape.y1);
                this.ctx.lineTo(shape.x2, shape.y2);
                this.ctx.stroke();
                break;
        }
    }

    public initDraw(shapeType: Shape['type']) {
        this.mouseDownHandler = (e) => {
            this.isDrawing = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
        };

        this.mouseUpHandler = (e) => {
            if (!this.isDrawing) return;
            const newShape = this.createShape(shapeType, e);
            if (newShape) {
                this.existingShapes.push(newShape);
                CanvasManager.shapes = this.existingShapes; // Update static shapes
            }
            this.isDrawing = false;
        };

        this.mouseMoveHandler = (e) => {
            if (!this.isDrawing) return;
            this.clearCanvas();
            this.redrawShapes();
            const tempShape = this.createShape(shapeType, e);
            if (tempShape) {
                this.drawShape(tempShape);
            }
        };

        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }

    public cleanup() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    private createShape(type: Shape['type'], e: MouseEvent): Shape | null {
        switch (type) {
            case 'rect':
                return {
                    type: 'rect',
                    x: this.startX,
                    y: this.startY,
                    width: e.clientX - this.startX,
                    height: e.clientY - this.startY
                };
            case 'circle':
                const radius = Math.sqrt(
                    Math.pow(e.clientX - this.startX, 2) + 
                    Math.pow(e.clientY - this.startY, 2)
                );
                return {
                    type: 'circle',
                    centerX: this.startX,
                    centerY: this.startY,
                    radius
                };
            case 'line':
                return {
                    type: 'line',
                    x1: this.startX,
                    y1: this.startY,
                    x2: e.clientX,
                    y2: e.clientY
                };
            default:
                return null;
        }
    }
}

export function initCanvas(canvas: HTMLCanvasElement, shapeType: Shape['type']) {
    // Cleanup any existing instance
    const oldManager = (canvas as any)._manager;
    if (oldManager) {
        oldManager.cleanup();
    }

    const manager = new CanvasManager(canvas);
    manager.initDraw(shapeType);
    (canvas as any)._manager = manager;
    return manager;
}