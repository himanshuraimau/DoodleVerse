"use client";
import React, { useEffect, useRef } from 'react';
import { initCanvas } from '@/components/Canvas/Canvas';

export function CanvasPage({ roomId, socket, token }: { roomId: string, socket: WebSocket, token: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            // Clear previous event listeners by creating new canvas instance
            initCanvas(canvas, roomId,socket, token);
        }
    }, [roomId]);

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                className="w-full h-screen bg-black"
                id="canvas"
                width="1680"
                height="1050"
            />
        </div>
    );
}