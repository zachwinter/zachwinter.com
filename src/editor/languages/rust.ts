import { EditorView, type DecorationSet, ViewUpdate } from "@codemirror/view";
import { ViewPlugin, Decoration } from "@codemirror/view";
import { LRLanguage, syntaxHighlighting } from "@codemirror/language";
import { rust } from "@codemirror/lang-rust";
import { styleTags, tags } from "@lezer/highlight";
import { type LanguageDefinition } from "../types/language";
import { createTheme } from "../themes/theme-factory";

// Define Rust syntax highlighting
const rustHighlighting = styleTags({
  "Function/VariableName": tags.function(tags.variableName),
  "Function/Identifier": tags.function(tags.variableName),
  "Type/VariableName": tags.typeName,
  "Type/Identifier": tags.typeName,
  "Macro/Identifier": tags.macroName,
  "MacroRules/Identifier": tags.definitionKeyword,
  "Attribute/Identifier": tags.annotation,
  "Derive/Identifier": tags.annotation,
  
  // Basic types
  "bool i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64": tags.typeName,
  "str String char": tags.typeName,
  
  // Keywords
  "self super": tags.self,
  "Self": tags.typeName,
  "async await": tags.keyword,
  "break continue": tags.controlKeyword,
  "else if match": tags.controlKeyword,
  "for in": tags.controlKeyword,
  "loop while": tags.controlKeyword,
  "return": tags.controlKeyword,
  "const static": tags.definitionKeyword,
  "extern": tags.modifier,
  "fn": tags.definitionKeyword,
  "impl": tags.definitionKeyword,
  "let mut": tags.definitionKeyword,
  "move": tags.modifier,
  "pub": tags.modifier,
  "ref": tags.modifier,
  "struct enum type": tags.definitionKeyword,
  "trait": tags.definitionKeyword,
  "unsafe": tags.modifier,
  "use": tags.keyword,
  "where": tags.modifier,
  "crate": tags.namespace,
  "mod": tags.module,
  "macro_rules!": tags.definitionKeyword,
  
  // Literals
  "StringNumber": tags.string,
  "Character": tags.character,
  "Boolean": tags.bool,
  
  // Other
  "Lifetime": tags.labelName,
  "Comment": tags.comment,
  "Documentation": tags.docComment,
  "MacroDelimiter": tags.bracket,
  "Delimiter": tags.bracket
});

// Create Rust-specific highlighter for special elements like macros and attributes
export function createRustHighlighter(options?: any) {
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
        
        // Highlight Rust-specific macros (like println!, vec!, etc)
        const macroRegex = /\w+!\s*[({\[]/g;
        let match;
        while ((match = macroRegex.exec(doc)) !== null) {
          // Find the end of the macro call
          const endPos = match.index + match[0].length - 1;
          decorations.push(
            Decoration.mark({
              class: "cm-rust-macro"
            }).range(match.index, endPos)
          );
        }
        
        // Highlight Rust attributes (like #[derive(Debug)])
        const attributeRegex = /#\[.*?\]/g;
        while ((match = attributeRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-rust-attribute"
            }).range(match.index, match.index + match[0].length)
          );
        }
        
        // Highlight lifetime annotations
        const lifetimeRegex = /'[a-zA-Z_][a-zA-Z0-9_]*/g;
        while ((match = lifetimeRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-rust-lifetime"
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

// Rust language definition implementing the LanguageDefinition interface
export const rustLanguageDefinition: LanguageDefinition = {
  id: "rust",
  name: "Rust",
  languageSupport: rust(), // Using the official Rust language support from CodeMirror
  theme: createTheme({
    overrides: {
      // Rust-specific theme overrides
      ".cm-variable": { color: "var(--white-60)" },
      ".cm-keyword": { color: "var(--pink)" },
      ".cm-control": { color: "var(--blue)", fontWeight: "900" },
      ".cm-type": { color: "var(--purple)", fontWeight: "900" },
      ".cm-number": { color: "var(--green)" },
      ".cm-string": { color: "var(--yellow)" },
      ".cm-comment": { color: "var(--dark-gray)", fontStyle: "italic" },
      ".cm-operator": { color: "var(--blue)" },
      ".cm-function": { color: "var(--blue)" },
      
      // Rust-specific elements
      ".cm-rust-macro": {
        color: "var(--orange)",
        fontWeight: "bold"
      },
      ".cm-rust-attribute": {
        color: "var(--purple-50)",
        fontStyle: "italic"
      },
      ".cm-rust-lifetime": {
        color: "var(--pink-70)",
        fontStyle: "italic"
      }
    }
  }),
  highlighter: {
    createHighlighter: createRustHighlighter
  },
  completionSource: {
    source: (context: any, options: any) => {
      // Rust-specific completions could go here
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

      if (nodeType === "Number" || /^\d*\.?\d+f?(u\d+|i\d+)?$/i.test(nodeText)) {
        return {
          value: nodeText,
          type: "number",
          range: [node.from, node.to],
          click: { x: event.clientX, y: event.clientY }
        };
      }

      if (nodeType === "VariableName" || nodeType === "Identifier") {
        // Rust-specific identifier handling could go here
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
  fileExtension: ".rs"
};