import { EditorView, type DecorationSet, ViewUpdate } from "@codemirror/view";
import { ViewPlugin, Decoration } from "@codemirror/view";
import { LRLanguage } from "@codemirror/language";
import { StreamLanguage } from "@codemirror/language";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { styleTags, tags } from "@lezer/highlight";
import { type LanguageDefinition } from "../types/language";
import { createTheme } from "../themes/theme-factory";

// Define Vue-specific syntax highlighting for elements not covered by the default parser
const vueHighlighting = styleTags({
  "ComponentName": tags.tagName,
  "DirectiveName": tags.keyword,
  "SlotName": tags.propertyName,
  "PropName": tags.labelName
});

// Create Vue-specific highlighter for special elements
export function createVueHighlighter(options?: any) {
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
        
        // Highlight Vue directives (like v-if, v-for, v-model, etc.)
        const directiveRegex = /(v-|@|:|#)[a-zA-Z][a-zA-Z0-9-]*/g;
        let match;
        while ((match = directiveRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-vue-directive"
            }).range(match.index, match.index + match[0].length)
          );
        }
        
        // Highlight Vue component names (PascalCase)
        const componentRegex = /\b[A-Z][a-zA-Z0-9]*[a-z][a-zA-Z0-9]*\b/g;
        while ((match = componentRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-vue-component"
            }).range(match.index, match.index + match[0].length)
          );
        }
        
        // Highlight Vue template expressions {{ }}
        const templateExprRegex = /\{\{[^}]*\}\}/g;
        while ((match = templateExprRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-vue-template-expression"
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

// Vue language definition implementing the LanguageDefinition interface
export const vueLanguageDefinition: LanguageDefinition = {
  id: "vue",
  name: "Vue",
  languageSupport: html(), // Using HTML as base since Vue is HTML-based with JS expressions
  theme: createTheme({
    overrides: {
      // Vue-specific theme overrides
      ".cm-variable": { color: "var(--white-60)" },
      ".cm-keyword": { color: "var(--pink)" },
      ".cm-control": { color: "var(--blue)", fontWeight: "900" },
      ".cm-type": { color: "var(--purple)", fontWeight: "900" },
      ".cm-number": { color: "var(--green)" },
      ".cm-string": { color: "var(--yellow)" },
      ".cm-comment": { color: "var(--dark-gray)", fontStyle: "italic" },
      ".cm-operator": { color: "var(--blue)" },
      ".cm-function": { color: "var(--blue)" },
      
      // Vue-specific elements
      ".cm-tag": { color: "var(--blue)" },
      ".cm-attribute": { color: "var(--purple)" },
      ".cm-vue-directive": {
        color: "var(--orange)",
        fontWeight: "bold"
      },
      ".cm-vue-component": {
        color: "var(--green)",
        fontWeight: "bold"
      },
      ".cm-vue-template-expression": {
        background: "var(--black-20)",
        borderRadius: "0.2rem",
        padding: "0 0.2rem"
      }
    }
  }),
  highlighter: {
    createHighlighter: createVueHighlighter
  },
  completionSource: {
    source: (context: any, options: any) => {
      // Vue-specific completions could go here
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
        // Check if it's a Vue directive
        if (nodeText.startsWith('v-') || nodeText.startsWith('@') || nodeText.startsWith(':') || nodeText.startsWith('#')) {
          return {
            value: nodeText,
            type: "directive",
            range: [node.from, node.to],
            click: { x: event.clientX, y: event.clientY }
          };
        }
        
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
  fileExtension: ".vue"
};