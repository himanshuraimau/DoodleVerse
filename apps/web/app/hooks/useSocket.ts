import { useEffect, useState } from "react";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("Connected to the server");
      setLoading(false);
      setSocket(ws);
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLoading(false);
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return {
    loading,
    socket,
  };
}