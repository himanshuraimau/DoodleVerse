"use client";
import React, {useEffect, useRef} from 'react';

export default function Canvas(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => { 
        
        if(canvasRef.current){
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if(!ctx){
                return;
            }

            ctx.strokeRect(25, 25, 100, 100);
        }
        

    }, [canvasRef]);


    return (
        <div>
            <canvas ref={canvasRef} className="bg-white" id="canvas" width="1680" height="1050"></canvas>
        </div>
    )
}