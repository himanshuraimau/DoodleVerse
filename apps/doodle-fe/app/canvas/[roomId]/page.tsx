"use client";
import { initCanvas } from '@/components/Canvas/Canvas';
import React, { useEffect, useRef, useState } from 'react';

type ShapeType = 'rect' | 'circle' | 'line';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentShape, setCurrentShape] = useState<ShapeType>('rect');

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;
            
            // Clear previous event listeners by creating new canvas instance
            initCanvas(canvas, currentShape);
        }
    }, [currentShape]);

    return (
        <div className="relative">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-4 bg-gray-800 p-4 rounded-lg shadow-lg">
                <button
                    onClick={() => setCurrentShape('line')}
                    className={`px-4 py-2 rounded-md transition-all ${
                        currentShape === 'line' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                >
                    Line
                </button>
                <button
                    onClick={() => setCurrentShape('rect')}
                    className={`px-4 py-2 rounded-md transition-all ${
                        currentShape === 'rect' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                >
                    Rectangle
                </button>
                <button
                    onClick={() => setCurrentShape('circle')}
                    className={`px-4 py-2 rounded-md transition-all ${
                        currentShape === 'circle' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                >
                    Circle
                </button>
            </div>
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
