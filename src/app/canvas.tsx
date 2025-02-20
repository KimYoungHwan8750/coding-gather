'use client'
import { SearchIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useWs } from "@/provider/websocket-provider";
import { SearchMessage } from "@/lib/ws-frame-generator";
import { useSharingArea } from "@/provider/sharing-area-provider";

export default function Canvas() {
  const nodeRef = useRef<HTMLCanvasElement>(null);
  const SharingArea = useSharingArea();
  const ws = useWs();

  useEffect(() => {
    const canvas = nodeRef.current;
    if(canvas) {
      const ctx = canvas.getContext('2d');
      if(SharingArea.bitmap) {
        canvas.width = SharingArea.bitmap.width;
        canvas.height = SharingArea.bitmap.height;
        if(ctx) {
          ctx.drawImage(SharingArea.bitmap, 0, 0);
        }
      }
    }
}, [SharingArea.bitmap])

  return (
    <div
      className="outline outline-1 w-full h-full flex flex-col overflow-y-auto"
    >
      <SearchBarContainer/>
      { SharingArea.isPending ? (
        <div className="w-full h-full flex items-center justify-center">Loading...</div>
      ) : (
        <canvas ref={nodeRef}></canvas>
      )}
    </div>
  )
}


function SearchBarContainer() {
  const SharingArea = useSharingArea();
  const ws = useWs();
  const getPage = async (url: string) => {
    SharingArea.setIsPending(true);
    ws.socket.emit("search", SearchMessage(url));
  }
  return (
    <div className="w-full h-20 shadow-md flex items-center p-5 gap-2">
      <SearchBar getPage={getPage}/>
      <SearchIcon
        onClick={() => getPage(SharingArea.url)}
        className="h-8 bg-white px-2 rounded-lg box-content cursor-pointer shadow-md hover:outline-1 hover:outline hover:outline-black/20"
      />
    </div>
  )
}

function SearchBar({getPage}: {getPage: (url: string) => void}) {
  const searchBarRef = useRef<HTMLTextAreaElement>(null);
  const SharingArea = useSharingArea();
  useEffect(() => {
    if(searchBarRef.current) {
      searchBarRef.current.addEventListener("keydown", (evt) => {
        if(evt.key === "Enter") {
          evt.preventDefault();
          if(searchBarRef.current){
            getPage(searchBarRef.current.value);
          }
        }
      })
    }
  }, [searchBarRef.current])
  return(
    <textarea ref={searchBarRef}
      onChange={(evt) => SharingArea.setUrl(evt.target.value)}
      className="w-full h-8 shadow outline outline-1 outline-black/20 rounded-lg resize-none leading-8 px-2 focus:shadow-around"
    />
  )
}