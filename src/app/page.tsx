import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import Canvas from "./canvas";
import TextEditor from "./editor";

export default function Home() {
  return (
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
              <TextEditor></TextEditor>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              <TextEditor></TextEditor>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
