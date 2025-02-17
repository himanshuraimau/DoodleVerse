import { RectangleHorizontal,Circle,Type, Pencil, MoveUpRight, Eraser } from 'lucide-react';



const ToolIcon = ({ toolName, selectedTool, handleToolSelect }: { toolName: string, selectedTool: string | undefined, handleToolSelect: (toolName: string) => void }) => {
    return (
        <button
            className={`p-2 rounded-full ${selectedTool === toolName ? 'bg-gray-700' : 'bg-gray-800'}`}
            onClick={() => handleToolSelect(toolName)}
        >
            {toolName === 'rectangle' && <RectangleHorizontal size={24} />}
            {toolName === 'circle' && <Circle size={24} />}
            {toolName==='text'&& <Pencil size={24}/>}
            {toolName === 'arrow'  && <MoveUpRight size={24} />}
            {toolName === 'eraser' && <Eraser size={24} />}
        </button>
    );
};


export default ToolIcon;