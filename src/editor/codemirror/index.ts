import { keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, dropCursor } from "@codemirror/view";
import { lintGutter, setDiagnostics } from "@codemirror/lint";
import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import { bracketMatching, indentOnInput, LanguageSupport } from "@codemirror/language";
import { defaultKeymap, indentWithTab, history, historyKeymap } from "@codemirror/commands";
import { EditorView } from "@codemirror/view";
import { highlightWhitespace } from "@codemirror/view";
import { preserveTabsConfig, createTabHighlighter } from "./tabs";
import { type ClickValuePayload, type LanguageDefinition } from "../types/language";
import { createCommentLineHighlighter } from "./comments";
import { LanguageRegistry } from "../language-registry";
export interface ErrorObject {
  message: string;
  line?: number;
  severity?: "error" | "warning" | "info";
}

export type OnClickValueHandler = (payload: ClickValuePayload) => void;
export type UpdateHandler = (update: any) => void;

export interface EditorConfig {
  target: HTMLElement;
  content?: string;
  languageId: string;
  languageOptions?: any; // Options that are language-specific (e.g., uniformKeys for GLSL)
  onClick?: OnClickValueHandler;
  onUpdate?: UpdateHandler;
}

export function buildExtensions(config: EditorConfig) {
  const { languageId, languageOptions, onClick, onUpdate } = config;
  const languageDef = LanguageRegistry.get(languageId);

  if (!languageDef) {
    throw new Error(`Language "${languageId}" is not registered`);
  }

  function click(event: MouseEvent, view: EditorView): boolean {
    if (!onClick) return false;

    // Use the language-specific click handler if available, otherwise use default
    if (languageDef.clickHandler) {
      const payload = languageDef.clickHandler.handler(event, view, languageOptions);
      if (payload) {
        onClick(payload);
        return true;
      }
    } else {
      // Default click handler - try to detect basic elements like numbers
      const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
      if (!pos) return false;

      const tree = view.state.tree;
      const node = tree.resolveInner(pos);
      const nodeText = view.state.doc.sliceString(node.from, node.to);
      const nodeType = node.type.name;

      if (nodeType === "Number" || /^\d*\.?\d+f?$/.test(nodeText)) {
        onClick({
          value: nodeText,
          type: "number",
          range: [node.from, node.to],
          click: { x: event.clientX, y: event.clientY }
        });
        return true;
      }

      // For identifiers, use default behavior
      onClick({
        value: nodeText,
        type: "identifier",
        range: [node.from, node.to],
        click: { x: event.clientX, y: event.clientY }
      });
      return true;
    }
  }

  const extensions = [
    lineNumbers(),
    history(),
    bracketMatching(),
    lintGutter(),
    preserveTabsConfig,
    highlightActiveLine(),
    highlightActiveLineGutter(),
    dropCursor(),
    closeBrackets(),
    indentOnInput(),
    highlightWhitespace(),
    createTabHighlighter(),
    // Add language-specific completion if available
    ...(languageDef.completionSource
      ? [
          autocompletion({
            override: [languageDef.completionSource.source]
          })
        ]
      : []),
    // Add language support and theme
    languageDef.languageSupport,
    languageDef.theme,
    // Add language-specific highlighter if available
    ...(languageDef.highlighter ? [languageDef.highlighter.createHighlighter(languageOptions)] : []),
    createCommentLineHighlighter(),
    keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
    EditorView.updateListener.of(onUpdate || (() => {})),
    EditorView.domEventHandlers({ click }),
    // Add language-specific state if available
    ...(languageDef.stateConfig && languageDef.stateConfig.stateField ? [languageDef.stateConfig.stateField] : [])
  ];

  return extensions;
}

export default class GenericEditor {
  private editor: EditorView;
  private target: HTMLElement;
  private languageId: string;
  private languageOptions: any;
  private onClickHandler: OnClickValueHandler | null;
  private onUpdateHandler: UpdateHandler | null;

  constructor(config: EditorConfig) {
    this.target = config.target;
    this.languageId = config.languageId;
    this.languageOptions = config.languageOptions || {};
    this.onClickHandler = config.onClick || null;
    this.onUpdateHandler = config.onUpdate || null;

    this.editor = new EditorView({
      parent: this.target,
      doc: config.content || "",
      extensions: buildExtensions(config)
    });
  }

  // Update the content
  setContent(content: string) {
    this.editor.dispatch({
      changes: {
        from: 0,
        to: this.editor.state.doc.length,
        insert: content
      }
    });
  }

  // Get current content
  getContent(): string {
    return this.editor.state.doc.toString();
  }

  // Update language and refresh editor extensions (requires editor recreation)
  setLanguage(languageId: string, languageOptions?: any) {
    this.languageId = languageId;
    this.languageOptions = languageOptions || this.languageOptions;

    // Rebuild the editor with new language
    this.editor.destroy();
    this.editor = new EditorView({
      parent: this.target,
      doc: this.getContent(),
      extensions: buildExtensions({
        target: this.target,
        languageId,
        languageOptions: this.languageOptions,
        onClick: this.onClickHandler,
        onUpdate: this.onUpdateHandler || (() => {})
      })
    });
  }

  // Update language options (e.g., uniform keys for GLSL)
  setLanguageOptions(options: any) {
    this.languageOptions = options;

    // Try to update state without recreating editor if possible
    const languageDef = LanguageRegistry.get(this.languageId);
    if (languageDef?.stateConfig?.updateState) {
      try {
        languageDef.stateConfig.updateState(this.editor, options);
        return; // Successfully updated state, no need to recreate editor
      } catch (e) {
        console.warn("Failed to update language state, falling back to editor recreation:", e);
      }
    }

    // Fallback to recreating the editor with new options
    this.setLanguage(this.languageId, options);
  }

  getLanguageOptions(): any {
    return this.languageOptions;
  }

  // Set error diagnostics
  setErrors(errors: ErrorObject[]) {
    const diagnostics = this.createDiagnostics(errors);
    this.editor.dispatch(setDiagnostics(this.editor.state, diagnostics));
  }

  // Clear all error diagnostics
  clearErrors() {
    this.editor.dispatch(setDiagnostics(this.editor.state, []));
  }

  // Focus the editor
  focus() {
    this.editor.focus();
  }

  // Get the EditorView instance (for advanced usage)
  getEditorView(): EditorView {
    return this.editor;
  }

  // Destroy the editor
  destroy() {
    this.editor?.destroy?.();
  }

  // Convert error objects to CodeMirror diagnostics
  private createDiagnostics(errors: ErrorObject[]) {
    return errors.map(error => {
      const line = Math.max(1, error.line || 1);
      const lineInfo = this.editor.state.doc.line(Math.min(line, this.editor.state.doc.lines));

      return {
        from: lineInfo.from,
        to: lineInfo.to,
        severity: error.severity || "error",
        message: error.message
      };
    });
  }
}
