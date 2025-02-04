import { useEffect,useState } from "react";


export function useSocket(){
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect   (() => {
        const ws = new WebSocket("ws://localhost:8080");
        ws.onopen = () => {
            console.log("Connected to the server");
            setLoading(false);
            setSocket(ws);
        }
    }, []);
    return {
        loading,
        socket
    }
}