"use client";
import { initDraw } from '@/components/Canvas/Canvas';
import React, { useEffect, useRef } from 'react';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return;
            }
            initDraw(ctx, canvas);
        }


    }, [canvasRef]);


    return (
        <div>
            <canvas ref={canvasRef} className="" id="canvas" width="1680" height="1050"></canvas>
        </div>
    )
}
