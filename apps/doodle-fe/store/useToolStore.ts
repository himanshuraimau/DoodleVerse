import { create } from 'zustand';


type Tool = {
    name: string;
};

type ToolState = {
    selectedTool: Tool | null;
    setSelectedTool: (tool: Tool) => void;

};

const useToolStore = create<ToolState>((set) => ({
    selectedTool: null,

    setSelectedTool: (tool: Tool) => {
        set({ selectedTool: tool });
    },

}));

export default useToolStore;