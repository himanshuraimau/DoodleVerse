export type Shape =
    {
        id: string;
        type: 'rect';
        x: number;
        y: number;
        width: number;
        height: number;
    } | {
        id: string;
        type: 'circle';
        x: number;
        y: number;
        radius: number;
    } | {
        id: string;
        type: 'text',
        x: number,
        y: number,
        text: string,
    } | {
        id: string;
        type: 'arrow';
        x: number;
        y: number;
        width: number;
        height: number;
    };
