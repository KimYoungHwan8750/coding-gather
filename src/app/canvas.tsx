'use client'

import { SearchIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function Canvas() {
  const [imageBitmap, setImageBitmap] = useState<ImageBitmap|null>(null);
  const nodeRef = useRef<HTMLCanvasElement>(null);
  const [isPending, setIsPending] = useState(false);
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
  const getPage = async (url: string) => {
    setIsPending(true);
    const res = await fetch("/api/search?url=" + encodeURI(url));
    if(!res.ok) {
      setIsPending(false);
      alert("스크린샷 캡처에 실패했습니다.");
      return;
    }
    const imageData = await res.blob();
    const imageBitmap = await createImageBitmap(imageData);
    setImageBitmap(imageBitmap);
    setIsPending(false);
  }
  return (
    <div className="w-full h-20 shadow-md flex items-center p-5 gap-2">
      <SearchBar setUrl={setUrl}/>
      <SearchIcon
        onClick={() => getPage(url)}
        className="h-8 bg-white px-2 rounded-lg box-content cursor-pointer shadow-md hover:outline-1 hover:outline hover:outline-black/20"
      />
    </div>
  )
}

function SearchBar({setUrl}: {setUrl: (str: string) => void}) {
  return(
    <textarea
      onChange={(evt) => setUrl(evt.target.value)}
      className="w-full h-8 shadow outline outline-1 outline-black/20 rounded-lg resize-none leading-8 px-2 focus:shadow-around"
    />
  )
}