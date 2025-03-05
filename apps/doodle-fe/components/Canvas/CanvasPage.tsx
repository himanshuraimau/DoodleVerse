"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Shape } from './types/shapes';
import { clearCanvas, drawShape, removeShape } from './utils/canvasOperations';
import { sendEraseShapeToWebSocket } from './services/shapeService';
import useToolStore from '@/store/useToolStore';
import ToolIcon from './ToolIcon';
import GradientCanvas from './GradientCanvas';
import { initCanvas } from './Canvas';

export function CanvasPage({ roomId, socket, token }: { roomId: string, socket: WebSocket, token: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const canvasInstanceRef = useRef<any>(null); // Store canvas instance
    const { selectedTool, setSelectedTool } = useToolStore();
    const [shapes, setShapes] = useState<Shape[]>([]);
    const canvasCleanupRef = useRef<(() => void) | null>(null);
    const isInitializedRef = useRef(false);

    const handleToolSelect = (toolName: string) => {
        setSelectedTool({ name: toolName });
        // Update the canvas instance with new tool
        if (canvasInstanceRef.current?.updateTool) {
            canvasInstanceRef.current.updateTool(toolName);
        }
    };

    // Initialize canvas only once
    useEffect(() => {
        if (!canvasRef.current || !socket || isInitializedRef.current) return;

        const setupCanvas = async () => {
            try {
                const instance = await initCanvas(
                    canvasRef.current!,
                    roomId,
                    socket,
                    token,
                    selectedTool?.name || 'rectangle' // Default tool
                );
                canvasInstanceRef.current = instance;
                canvasCleanupRef.current = instance.cleanup;
                isInitializedRef.current = true;
            } catch (error) {
                console.error('Failed to initialize canvas:', error);
            }
        };

        setupCanvas();

        return () => {
            if (canvasCleanupRef.current) {
                canvasCleanupRef.current();
                canvasCleanupRef.current = null;
                canvasInstanceRef.current = null;
            }
            isInitializedRef.current = false;
        };
    }, [roomId, socket, token]);

    useEffect(() => {
        if (!socket) return;

        socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'erase') {
                setShapes(prevShapes => removeShape(prevShapes, data.shapeId));
            }
        });
    }, [socket]);

    useEffect(() => {
        if (!canvasRef.current || !ctxRef.current) return;

        clearCanvas(ctxRef.current, canvasRef.current);
        shapes.forEach(shape => !shape.isDeleted && drawShape(ctxRef.current!, shape));
    }, [shapes]);

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