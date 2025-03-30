interface ServerToClientEvents {
  inputText: (data: string) => void;
  changeLanguage: (data: string) => void;
  search: (req: string) => void;
}

interface ClientToServerEvents {
  inputText: (data: string) => void;
  changeLanguage: (data: string) => void;
  search: (req: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}