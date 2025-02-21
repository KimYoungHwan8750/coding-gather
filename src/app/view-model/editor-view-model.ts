import { Direction, Language } from "@/constant/constant";
class EditorState {
  private readonly direction: Direction;
  private text: string;
  private language: Language = "Plain Text";

  constructor(direction: Direction) {
    this.direction = direction;
    this.text = ""; 
  }

  getText() {
    return this.text;
  }

  setText(text: string) {
    this.text = text;
  }


  getLanguage() {
    return this.language;
  }

  setLanguage(language: Language) {
    this.language = language;
  }

}

class EditorViewModel {
  private static readonly TopEditorState: EditorState = new EditorState("top");
  private static readonly BottomEditorState: EditorState = new EditorState("bottom");

}