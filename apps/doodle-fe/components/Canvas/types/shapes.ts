export type Shape =
    {
        id: string;
        type: 'rect';
        x: number;
        y: number;
        width: number;
        height: number;
        isDeleted: boolean;
    } | {
        id: string;
        type: 'circle';
        x: number;
        y: number;
        radius: number;
        isDeleted: boolean;
    } | {
        id: string;
        type: 'text';
        x: number;
        y: number;
        text: string;
        isDeleted: boolean;
    } | {
        id: string;
        type: 'arrow';
        x: number;
        y: number;
        width: number;
        height: number;
        isDeleted: boolean;
    };
