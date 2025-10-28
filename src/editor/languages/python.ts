import { EditorView, type DecorationSet, ViewUpdate } from "@codemirror/view";
import { ViewPlugin, Decoration } from "@codemirror/view";
import { syntaxHighlighting } from "@codemirror/language";
import { python } from "@codemirror/lang-python";
import { styleTags, tags } from "@lezer/highlight";
import { type LanguageDefinition } from "../types/language";
import { createTheme } from "../themes/theme-factory";

// Define Python-specific syntax highlighting for elements not covered by the default parser
const pythonHighlighting = styleTags({
  "Decorator": tags.annotation,
  "Parameter": tags.propertyName,
  "DottedName/Identifier": tags.tagName,
  "DoubleEquals": tags.compareOperator,
  "NotEquals": tags.compareOperator,
  "LessThan": tags.compareOperator,
  "LessEqual": tags.compareOperator,
  "GreaterThan": tags.compareOperator,
  "GreaterEqual": tags.compareOperator
});

// Create Python-specific highlighter for special elements
export function createPythonHighlighter(options?: any) {
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
        
        // Highlight Python decorators (like @property, @staticmethod, etc.)
        const decoratorRegex = /@\w+(?:\.\w+)*/g;
        let match;
        while ((match = decoratorRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-python-decorator"
            }).range(match.index, match.index + match[0].length)
          );
        }
        
        // Highlight f-strings
        const fStringRegex = /f["'].*?["']/g;
        while ((match = fStringRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-python-fstring"
            }).range(match.index, match.index + match[0].length)
          );
        }
        
        // SORT decorations by position before creating the set
        decorations.sort((a, b) => a.from - b.from);
        
        return Decoration.set(decorations);
      }
    },
    {
      decorations: v => v.decorations
    }
  );
}

// Python language definition implementing the LanguageDefinition interface
export const pythonLanguageDefinition: LanguageDefinition = {
  id: "python",
  name: "Python",
  languageSupport: python(), // Using the official Python language support from CodeMirror
  theme: createTheme({
    overrides: {
      // Python-specific theme overrides
      ".cm-variable": { color: "var(--white-60)" },
      ".cm-keyword": { color: "var(--pink)" },
      ".cm-control": { color: "var(--blue)", fontWeight: "900" },
      ".cm-type": { color: "var(--purple)", fontWeight: "900" },
      ".cm-number": { color: "var(--green)" },
      ".cm-string": { color: "var(--yellow)" },
      ".cm-comment": { color: "var(--dark-gray)", fontStyle: "italic" },
      ".cm-operator": { color: "var(--blue)" },
      ".cm-function": { color: "var(--blue)" },
      
      // Python-specific elements
      ".cm-python-decorator": {
        color: "var(--purple-50)",
        fontStyle: "italic"
      },
      ".cm-python-fstring": {
        color: "var(--orange)"
      }
    }
  }),
  highlighter: {
    createHighlighter: createPythonHighlighter
  },
  completionSource: {
    source: (context: any, options: any) => {
      // Python-specific completions could go here
      // For now, we'll return null to use defaults
      return null;
    }
  },
  clickHandler: {
    handler: (event: MouseEvent, view: EditorView, options: any) => {
      const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
      if (!pos) return null;

      const tree = view.state.tree;
      const node = tree.resolveInner(pos);
      const nodeText = view.state.doc.sliceString(node.from, node.to);
      const nodeType = node.type.name;

      if (nodeType === "Number" || /^\d+\.?\d*(j|J)?$/i.test(nodeText)) {
        return {
          value: nodeText,
          type: "number",
          range: [node.from, node.to],
          click: { x: event.clientX, y: event.clientY }
        };
      }

      if (nodeType === "VariableName" || nodeType === "Identifier") {
        return {
          value: nodeText,
          type: "identifier",
          range: [node.from, node.to],
          click: { x: event.clientX, y: event.clientY }
        };
      }

      return null;
    }
  },
  fileExtension: ".py"
};