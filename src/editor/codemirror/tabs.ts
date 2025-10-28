import { EditorView, type DecorationSet, ViewUpdate } from "@codemirror/view";
import { ViewPlugin, Decoration } from "@codemirror/view";

class TabWidget {
  toDOM() {
    const span = document.createElement("span");
    span.textContent = "→";
    span.className = "cm-tab-marker";
    span.style.color = "var(--white-20)";
    span.style.opacity = "0.5";
    span.style.fontSize = "0.8em";
    span.style.display = "inline-block";
    span.style.width = "2ch";
    return span;
  }

  compare(other: TabWidget) {
    return other instanceof TabWidget;
  }

  // Required by Codemirror widget interface
  destroy() {
    // Tab widgets don't need cleanup, but method is required
  }
}

export function createTabHighlighter() {
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
        const doc = view.state.doc.toString();

        // Find all tab characters
        let tabIndex = -1;
        while ((tabIndex = doc.indexOf("\t", tabIndex + 1)) !== -1) {
          // Create a widget decoration for each tab
          const widget = Decoration.widget({
            widget: new TabWidget(),
            side: 0
          });
          decorations.push(widget.range(tabIndex));
        }

        return Decoration.set(decorations);
      }
    },
    {
      decorations: v => v.decorations
    }
  );
}

export const preserveTabsConfig = EditorView.contentAttributes.of({
  "tab-size": "4",
  "white-space": "pre"
});
