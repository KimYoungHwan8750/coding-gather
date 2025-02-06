export function TypingMessage(id: "top" | "bottom", message: string) {
  return JSON.stringify({
    id,
    message
  });
}

export function SearchMessage(url: string) {
  return JSON.stringify({
    url
  });
}