import React from 'react';
import { LucideIcon } from 'lucide-react';
import { RectangleVertical, Circle, Type, ArrowUpRight, Eraser } from 'lucide-react';

interface ToolIconProps {
    toolName: string;
    selectedTool?: string;
    handleToolSelect: (toolName: string) => void;
}

const toolIcons: { [key: string]: LucideIcon } = {
    rectangle: RectangleVertical,
    circle: Circle,
    text: Type,
    arrow: ArrowUpRight,
    eraser: Eraser,
};

const ToolIcon: React.FC<ToolIconProps> = ({ toolName, selectedTool, handleToolSelect }) => {
    const Icon = toolIcons[toolName];
    const isSelected = selectedTool === toolName;

    return (
        <button
            className={`relative group p-3 rounded-lg transition-colors duration-200 ${isSelected ? 'bg-emerald-500' : 'bg-gray-800 hover:bg-gray-700'
                }`}
            onClick={() => handleToolSelect(toolName)}
        >
            {isSelected && (
                <span className="absolute -inset-1 bg-emerald-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></span>
            )}
            <Icon className="h-6 w-6 text-white relative" />
        </button>
    );
};

export default ToolIcon;