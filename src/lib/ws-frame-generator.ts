type TypingMessageType = {
  direction: "top" | "bottom"
  message: string
  id: string

}
function TypingMessage({direction, id, message}: TypingMessageType) {
  return JSON.stringify({
    direction,
    id,
    message
  });
}

function SearchMessage(url: string) {
  return JSON.stringify({
    url
  });
}

export { TypingMessage, SearchMessage }
export type { TypingMessageType }