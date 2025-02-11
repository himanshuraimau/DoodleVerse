export function initDraw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    let clicked = false;
    let startX = 0;
    let startY = 0;

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
        console.log(e.clientX, e.clientY);
    })
    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "rgba(255, 255,255,1)";
            ctx.strokeRect(startX, startY, width, height);
        }
    })
}