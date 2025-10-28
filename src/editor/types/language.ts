import { EditorView } from "@codemirror/view";
import { LRLanguage } from "@codemirror/language";
import { StateField } from "@codemirror/state";

export interface ClickValuePayload {
  value: string;
  type: string;
  range: [number, number];
  click: { x: number; y: number };
}

export interface LanguageDefinition {
  id: string;
  name: string;
  languageSupport: LRLanguage;
  theme: any[];
  highlighter?: {
    createHighlighter: (options?: any) => any;
  };
  completionSource?: {
    source: (context: any, options: any) => any;
  };
  stateConfig?: {
    stateField: StateField<any>;
    updateState: (view: EditorView, options: any) => void;
  };
  clickHandler?: {
    handler: (event: MouseEvent, view: EditorView, options: any) => ClickValuePayload | null;
  };
  fileExtension: string;
}