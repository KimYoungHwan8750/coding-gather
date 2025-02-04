'use client'
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NoneRingButton } from "@/components/ui/none-ring-button";
import Editor from "@monaco-editor/react";
import { ReactNode, useState } from "react";

export default function TextEditor() {
  const [language, setLanguage] = useState<string | null>(null);
  const lowerCaseLanguage = language?.toLowerCase();
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
              <DropdownMenuRadioItem value="C++">C++</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </LanguageMenu>

      </EditorToolbar>
      <Editor
        className="w-full h-full"
        height="100%"
        defaultLanguage="plaintext"
        language={lowerCaseLanguage? lowerCaseLanguage : "plaintext"}
        defaultValue="// 여기에 코드를 입력하세요"
        theme="vs-dark"
        options={{
          minimap: { enabled: true }
        }}
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