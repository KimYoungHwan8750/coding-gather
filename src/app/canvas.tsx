'use client'
import { SearchIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useWs } from "./page";
import { SearchMessage } from "@/lib/ws-frame-generator";

export default function Canvas() {
  const [imageBitmap, setImageBitmap] = useState<ImageBitmap|null>(null);
  const nodeRef = useRef<HTMLCanvasElement>(null);
  const [isPending, setIsPending] = useState(false);
  const ws = useWs();
  useEffect(() => {
      ws.socket.on("search", (res) => {
        const parseReq = JSON.parse(res);
      if(parseReq.code === 404) {
        setIsPending(false);
        alert("404 Not Found");
      } else {
        const byteArray = Uint8Array.from(atob(parseReq.data), c => c.charCodeAt(0));
        const blob = new Blob([byteArray], {type: "image/png"});
        createImageBitmap(blob).then((bitMap) => {
          setImageBitmap(bitMap);
          setIsPending(false);
        })
      }
    })
  }, []);
  useEffect(() => {
    const canvas = nodeRef.current;
    if(canvas) {
      const ctx = canvas.getContext('2d');
      if(imageBitmap) {
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        if(ctx) {
          ctx.drawImage(imageBitmap, 0, 0);
        }
      }
    }
}, [imageBitmap])

  return (
    <div
      className="outline outline-1 w-full h-full flex flex-col overflow-y-auto"
    >
      <SearchBarContainer
        setIsPending={setIsPending}
        setImageBitmap={setImageBitmap}
      />
      {isPending && <div className="w-full h-full flex items-center justify-center">Loading...</div>}
      {isPending || <canvas ref={nodeRef}></canvas>}
    </div>
  )
}


function SearchBarContainer({setImageBitmap, setIsPending}: {setImageBitmap: (bitMap: ImageBitmap) => void, setIsPending: (pending: boolean) => void}) {
  const [url, setUrl] = useState("");
  const ws = useWs();
  const getPage = async (url: string) => {
    setIsPending(true);
    ws.socket.emit("search", SearchMessage(url));
  }
  return (
    <div className="w-full h-20 shadow-md flex items-center p-5 gap-2">
      <SearchBar setUrl={setUrl} getPage={getPage}/>
      <SearchIcon
        onClick={() => getPage(url)}
        className="h-8 bg-white px-2 rounded-lg box-content cursor-pointer shadow-md hover:outline-1 hover:outline hover:outline-black/20"
      />
    </div>
  )
}

function SearchBar({setUrl, getPage}: {setUrl: (str: string) => void, getPage: (url: string) => void}) {
  const searchBarRef = useRef<HTMLTextAreaElement>(null);
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
      onChange={(evt) => setUrl(evt.target.value)}
      className="w-full h-8 shadow outline outline-1 outline-black/20 rounded-lg resize-none leading-8 px-2 focus:shadow-around"
    />
  )
}