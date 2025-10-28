import { EditorView, type DecorationSet, ViewUpdate } from "@codemirror/view";
import { ViewPlugin, Decoration } from "@codemirror/view";

export function createCommentLineHighlighter() {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = this.buildDecorations(update.view);
        }
      }

      buildDecorations(view: EditorView) {
        const decorations: any[] = [];
        const doc = view.state.doc;

        for (let i = 1; i <= doc.lines; i++) {
          const line = doc.line(i);
          const text = line.text.trim();
          if (text === "") {
            decorations.push(
              Decoration.line({
                class: "cm-empty-line"
              }).range(line.from)
            );
          } else if (text.startsWith("//") || text.startsWith("/*") || text.includes("*/")) {
            decorations.push(
              Decoration.line({
                class: "cm-comment-line"
              }).range(line.from)
            );
          }
        }

        decorations.sort((a, b) => a.from - b.from);
        return Decoration.set(decorations);
      }
    },
    {
      decorations: v => v.decorations
    }
  );
}
