"use client";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import Canvas from "./canvas";
import TextEditor from "./editor";
import { useState, useEffect, createContext, ReactNode, useContext } from "react";
import { socket } from "../socket";

type wsContextType = {
  socket: typeof socket
}
const WsContext = createContext<wsContextType | null>(null);
export function useWs() {
  const context = useContext(WsContext);
  if (!context) {
    throw new Error("useWs는 반드시 wsContext 하위에서 사용되어야 합니다.");
  }
  return context;
}
const WebSocketProvider = ({children}: {children: ReactNode}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      console.log("connected");

      socket.io.engine.on("upgrade", (transport: any) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
  return <WsContext.Provider value={{socket}}>{children}</WsContext.Provider>;
}
export default function Home() {
  return (
    <WebSocketProvider>
      <div className="w-screen h-screen">
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-lg border w-screen"
        >
          <ResizablePanel defaultSize={50}>
            <Canvas></Canvas>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={25}>
                <TextEditor id="top"></TextEditor>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={75}>
                <TextEditor id="bottom"></TextEditor>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </WebSocketProvider>
  );
}
