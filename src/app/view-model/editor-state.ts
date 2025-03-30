import { Direction, Language } from "@/constant/constant";
import { ParsedInputTextPayload } from "@/constant/payload-type";
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


export class EditorViewModel {
  private static readonly TopEditorState: EditorState = new EditorState("top");
  private static readonly BottomEditorState: EditorState = new EditorState("bottom");

  static bindStateFromPayload(parsedPayload: ParsedInputTextPayload) {
    parsedPayload.direction === "top" ? this.TopEditorState.setText(parsedPayload.text) : this.BottomEditorState.setText(parsedPayload.text);
  }

}