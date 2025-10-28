import { EditorView, type DecorationSet, ViewUpdate } from "@codemirror/view";
import { ViewPlugin, Decoration } from "@codemirror/view";
import { syntaxHighlighting } from "@codemirror/language";
import { xml } from "@codemirror/lang-xml";
import { styleTags, tags } from "@lezer/highlight";
import { type LanguageDefinition } from "../types/language";
import { createTheme } from "../themes/theme-factory";

// Define XML-specific syntax highlighting for elements not covered by the default parser
const xmlHighlighting = styleTags({
  "Doctype": tags.documentMeta,
  "TagName": tags.tagName,
  "AttributeName": tags.labelName,
  "AttributeValue": tags.string,
  "Comment": tags.comment,
  "ProcessingInst": tags.meta,
  "NamespacePrefix": tags.namespace,
  "NamespaceName": tags.namespace,
  "SelfClosing": tags.modifier
});

// Create XML-specific highlighter for special elements
export function createXmlHighlighter(options?: any) {
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
        
        // Highlight XML namespace prefixes (like xmlns:, xsi:, etc.)
        const namespaceRegex = /xmlns:?[a-z0-9._-]*\s*=\s*["'][^"']*["']/gi;
        let match;
        while ((match = namespaceRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-xml-namespace"
            }).range(match.index, match.index + match[0].length)
          );
        }
        
        // Highlight XML processing instructions (like <?xml version="1.0"?>)
        const processingInstRegex = /<\?[^>]*\?>/g;
        while ((match = processingInstRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-xml-processing"
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

// XML language definition implementing the LanguageDefinition interface
export const xmlLanguageDefinition: LanguageDefinition = {
  id: "xml",
  name: "XML",
  languageSupport: xml(), // Using the official XML language support from CodeMirror
  theme: createTheme({
    overrides: {
      // XML-specific theme overrides
      ".cm-variable": { color: "var(--white-60)" },
      ".cm-keyword": { color: "var(--pink)" },
      ".cm-control": { color: "var(--blue)", fontWeight: "900" },
      ".cm-type": { color: "var(--purple)", fontWeight: "900" },
      ".cm-number": { color: "var(--green)" },
      ".cm-string": { color: "var(--yellow)" },
      ".cm-comment": { color: "var(--dark-gray)", fontStyle: "italic" },
      ".cm-operator": { color: "var(--blue)" },
      ".cm-function": { color: "var(--blue)" },
      
      // XML-specific elements
      ".cm-tag": { color: "var(--blue)" },
      ".cm-attribute": { color: "var(--purple)" },
      ".cm-xml-namespace": {
        color: "var(--pink-70)",
        fontStyle: "italic"
      },
      ".cm-xml-processing": {
        color: "var(--purple-50)",
        fontStyle: "italic"
      }
    }
  }),
  highlighter: {
    createHighlighter: createXmlHighlighter
  },
  completionSource: {
    source: (context: any, options: any) => {
      // XML-specific completions could go here
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
  fileExtension: ".xml"
};