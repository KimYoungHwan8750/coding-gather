'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ReactNode, useEffect, useState } from "react";
import { useWs } from "./page";
import { TypingMessage } from "@/lib/ws-frame-generator";
import dynamic from "next/dynamic";

export default function TextEditor({direction}: {direction: "top" | "bottom"}) {
  const [language, setLanguage] = useState<string | null>(null);
  const lowerCaseLanguage = language?.toLowerCase();
  const ws = useWs();
  const [offset, setOffset] = useState(0);
  const [text, setText] = useState("");
  const [payload, setPayload] = useState("");
  const id = ws.socket.id;
  const MonacoEditor = dynamic(() => import('react-monaco-editor'), {
    ssr: false
  });
  const syncEditor = (message?: string) => {
    if(message && id) {
      setText(message);
      if(message.length != offset) {
        setOffset(message.length);
        ws.socket.emit("typing", TypingMessage({id, message, direction}));
      }
    }
  };
  useEffect(() => {
    ws.socket.on("typing", setPayload);
    let parsePayload;
    if(payload) {
      parsePayload = JSON.parse(payload);
      if(parsePayload.direction === direction) {
        setText(parsePayload.message);
        console.log(parsePayload.message);
      }
    }
    return () => {
      ws.socket.off("typing", setPayload);
    }
  }, [payload])


  return (
    <div className="w-full h-full flex flex-col">
      <EditorToolbar>
        <LanguageMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="h-full outline-none">
              <MenuTrigger>{language? language : "Language"}</MenuTrigger>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup onValueChange={setLanguage}>
              <DropdownMenuRadioItem value="JavaScript">JavaScript</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="TypeScript">TypeScript</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Python">Python</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Html">HTML</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Css">CSS</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Java">Java</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="C">C</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </LanguageMenu>
      </EditorToolbar>
      <MonacoEditor
        height={"100%"}
        language={lowerCaseLanguage? lowerCaseLanguage : "plaintext"}
        onChange={syncEditor}
        defaultValue="// 여기에 코드를 입력하세요"
        value={text}
        theme="vs-dark"
      />


    </div>
  );
}

function EditorToolbar({children}: {children: React.ReactNode}) {
  return (
    <div className="w-full min-h-12 flex items-center gap-2 box-content">
      {children}
    </div>
  )
}

function LanguageMenu({children}: {children: ReactNode}) {
  return (
    <div className="h-full rounded-md bg-background shadow-sm">
      {children}
    </div>
  )
}

function MenuTrigger({children}: {children: ReactNode}) {
  return (
    <div className="font-mono flex justify-center items-center px-2 border-x-[1px] h-full cursor-pointer select-none hover:bg-accent hover:text-accent-foreground w-[12ch]">
      {children}
    </div>
  )
}