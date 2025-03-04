import React from 'react';

interface GradientCanvasProps {
    children: React.ReactNode;
}

const GradientCanvas: React.FC<GradientCanvasProps> = ({ children }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            {children}
        </div>
    );
};

export default GradientCanvas;
