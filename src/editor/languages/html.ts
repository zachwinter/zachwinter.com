import { EditorView, type DecorationSet, ViewUpdate } from "@codemirror/view";
import { ViewPlugin, Decoration } from "@codemirror/view";
import { syntaxHighlighting } from "@codemirror/language";
import { html } from "@codemirror/lang-html";
import { styleTags, tags } from "@lezer/highlight";
import { type LanguageDefinition } from "../types/language";
import { createTheme } from "../themes/theme-factory";

// Define HTML-specific syntax highlighting for elements not covered by the default parser
const htmlHighlighting = styleTags({
  "Doctype": tags.documentMeta,
  "TagName": tags.tagName,
  "AttributeName": tags.labelName,
  "AttributeValue": tags.string,
  "Comment": tags.comment,
  "SelfClosing": tags.modifier,
  "UnquotedAttributeValue": tags.string
});

// Create HTML-specific highlighter for special elements
export function createHtmlHighlighter(options?: any) {
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
        
        // Highlight HTML custom elements (web components) - elements with hyphens
        const customElementRegex = /<\/?[a-z][a-z0-9]*-[a-z0-9-]*\b/g;
        let match;
        while ((match = customElementRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-html-custom-element"
            }).range(match.index, match.index + match[0].length)
          );
        }
        
        // Highlight script and style tags specially
        const scriptStyleRegex = /<(script|style)[^>]*>[\s\S]*?<\/\1>/g;
        while ((match = scriptStyleRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-html-embedded"
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

// HTML language definition implementing the LanguageDefinition interface
export const htmlLanguageDefinition: LanguageDefinition = {
  id: "html",
  name: "HTML",
  languageSupport: html(), // Using the official HTML language support from CodeMirror
  theme: createTheme({
    overrides: {
      // HTML-specific theme overrides
      ".cm-variable": { color: "var(--white-60)" },
      ".cm-keyword": { color: "var(--pink)" },
      ".cm-control": { color: "var(--blue)", fontWeight: "900" },
      ".cm-type": { color: "var(--purple)", fontWeight: "900" },
      ".cm-number": { color: "var(--green)" },
      ".cm-string": { color: "var(--yellow)" },
      ".cm-comment": { color: "var(--dark-gray)", fontStyle: "italic" },
      ".cm-operator": { color: "var(--blue)" },
      ".cm-function": { color: "var(--blue)" },
      
      // HTML-specific elements
      ".cm-tag": { color: "var(--blue)" },
      ".cm-attribute": { color: "var(--purple)" },
      ".cm-propertyName": { color: "var(--orange)" },
      ".cm-html-custom-element": {
        color: "var(--pink)",
        fontWeight: "bold"
      },
      ".cm-html-embedded": {
        borderLeft: "2px solid var(--dark-gray)"
      }
    }
  }),
  highlighter: {
    createHighlighter: createHtmlHighlighter
  },
  completionSource: {
    source: (context: any, options: any) => {
      // HTML-specific completions could go here
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

      if (nodeType === "Number" || /^\d+\.?\d*$/i.test(nodeText)) {
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
  fileExtension: ".html"
};