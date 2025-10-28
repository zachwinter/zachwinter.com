import { EditorView, type DecorationSet, ViewUpdate } from "@codemirror/view";
import { ViewPlugin, Decoration } from "@codemirror/view";
import { syntaxHighlighting } from "@codemirror/language";
import { cpp } from "@codemirror/lang-cpp";
import { styleTags, tags } from "@lezer/highlight";
import { type LanguageDefinition } from "../types/language";
import { createTheme } from "../themes/theme-factory";

// Define C++-specific syntax highlighting for elements not covered by the default parser
const cppHighlighting = styleTags({
  "Include": tags.module,
  "IncludePath": tags.string,
  "Define": tags.definitionKeyword,
  "Macro": tags.macroName,
  "TemplateParameter": tags.typeName,
  "Operator": tags.operator
});

// Create C++-specific highlighter for special elements
export function createCppHighlighter(options?: any) {
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
        
        // Highlight C++ preprocessor directives
        const preprocessorRegex = /^[\t ]*#.*$/gm;
        let match;
        while ((match = preprocessorRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-cpp-preprocessor"
            }).range(match.index, match.index + match[0].length)
          );
        }
        
        // Highlight C++ style cast operators (static_cast, dynamic_cast, etc.)
        const castRegex = /(static_cast|dynamic_cast|const_cast|reinterpret_cast)\s*<[^>]*>/g;
        while ((match = castRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-cpp-cast"
            }).range(match.index, match.index + match[0].length)
          );
        }
        
        // Highlight template declarations
        const templateRegex = /template\s*<[^>]*>/g;
        while ((match = templateRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-cpp-template"
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

// C++ language definition implementing the LanguageDefinition interface
export const cppLanguageDefinition: LanguageDefinition = {
  id: "cpp",
  name: "C++",
  languageSupport: cpp(), // Using the official C++ language support from CodeMirror
  theme: createTheme({
    overrides: {
      // C++-specific theme overrides
      ".cm-variable": { color: "var(--white-60)" },
      ".cm-keyword": { color: "var(--pink)" },
      ".cm-control": { color: "var(--blue)", fontWeight: "900" },
      ".cm-type": { color: "var(--purple)", fontWeight: "900" },
      ".cm-number": { color: "var(--green)" },
      ".cm-string": { color: "var(--yellow)" },
      ".cm-comment": { color: "var(--dark-gray)", fontStyle: "italic" },
      ".cm-operator": { color: "var(--blue)" },
      ".cm-function": { color: "var(--blue)" },
      
      // C++-specific elements
      ".cm-cpp-preprocessor": {
        color: "var(--purple-50)",
        fontStyle: "italic"
      },
      ".cm-cpp-cast": {
        color: "var(--orange)",
        fontWeight: "bold"
      },
      ".cm-cpp-template": {
        color: "var(--pink-70)"
      }
    }
  }),
  highlighter: {
    createHighlighter: createCppHighlighter
  },
  completionSource: {
    source: (context: any, options: any) => {
      // C++-specific completions could go here
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

      if (nodeType === "Number" || /^\d+\.?\d*(f|F|l|L|u|U)?$/i.test(nodeText)) {
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
  fileExtension: ".cpp"
};