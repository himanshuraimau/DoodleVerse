"use client";
import React, { useEffect, useRef, useState } from 'react';
import { initCanvas } from '@/components/Canvas/Canvas';
import useToolStore from '@/store/useToolStore';
import ToolIcon from './ToolIcon';
import GradientCanvas from './GradientCanvas';


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
    }, [roomId, selectedTool]);

    return (
        <div className="relative flex w-full h-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden">
            <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                <ToolIcon toolName="rectangle" selectedTool={selectedTool?.name} handleToolSelect={handleToolSelect} />
                <ToolIcon toolName="circle" selectedTool={selectedTool?.name} handleToolSelect={handleToolSelect} />
                <ToolIcon toolName="text" selectedTool={selectedTool?.name} handleToolSelect={handleToolSelect} />
                <ToolIcon toolName="arrow" selectedTool={selectedTool?.name} handleToolSelect={handleToolSelect} />
                <ToolIcon toolName="eraser" selectedTool={selectedTool?.name} handleToolSelect={handleToolSelect} />

            </div>

            <GradientCanvas>
                <canvas
                    ref={canvasRef}
                    className="rounded-xl shadow-2xl border border-gray-800"
                    id="canvas"
                    width="1680"
                    height="1050"
                />
            </GradientCanvas>
        </div>
    );
}