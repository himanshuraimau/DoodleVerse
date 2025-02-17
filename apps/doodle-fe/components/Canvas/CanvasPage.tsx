"use client";
import React, { useEffect, useRef } from 'react';
import { initCanvas } from '@/components/Canvas/Canvas';
import useToolStore from '@/store/useToolStore';
import ToolIcon from './ToolIcon';

export function CanvasPage({ roomId, socket, token }: { roomId: string, socket: WebSocket, token: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { selectedTool, setSelectedTool } = useToolStore();

    const handleToolSelect = (toolName: string) => {
        setSelectedTool({ name: toolName });
        console.log('Selected tool:', toolName);
    };

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            // Clear previous event listeners by creating new canvas instance
            initCanvas(canvas, roomId, socket, token, selectedTool?.name || 'pencil');
        }
    }, [roomId,selectedTool]);

    return (
        <div className="relative flex w-full h-screen">
             <div className="absolute top-2 left-2 z-10">
                <ToolIcon toolName="rectangle" selectedTool={selectedTool?.name} handleToolSelect={handleToolSelect} />
                <ToolIcon toolName="circle" selectedTool={selectedTool?.name} handleToolSelect={handleToolSelect} />
                <ToolIcon toolName="text" selectedTool={selectedTool?.name} handleToolSelect={handleToolSelect} />
                <ToolIcon toolName="arrow" selectedTool={selectedTool?.name} handleToolSelect={handleToolSelect} />
                <ToolIcon toolName="eraser" selectedTool={selectedTool?.name} handleToolSelect={handleToolSelect} />
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