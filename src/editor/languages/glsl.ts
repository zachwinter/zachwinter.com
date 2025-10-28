import { EditorView, type DecorationSet, ViewUpdate } from "@codemirror/view";
import { ViewPlugin, Decoration } from "@codemirror/view";
import { LRLanguage, syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { parser as glslParser } from "lezer-glsl";
import { styleTags, tags } from "@lezer/highlight";
import { type LanguageDefinition } from "../types/language";
import {
  uniformCompletionSource,
  uniformKeysState,
  createUniformHighlighter,
  updateEditorUniformKeys
} from "../uniforms/uniforms";

// Use the base theme instead of GLSL-specific classes
import { baseTheme, baseHighlightStyle } from "../themes/base-theme";
import { createTheme } from "../themes/theme-factory";

const glslHighlighting = styleTags({
  "PrimitiveType|TypeName": tags.typeName,
  "VariableName|Identifier": tags.variableName,
  "PreprocDirective": tags.meta,
  "PreprocDirectiveName": tags.keyword,
  "Number": tags.number,
  "String": tags.string,
  "LineComment": tags.lineComment,
  "BlockComment": tags.blockComment,
  "( )": tags.paren,
  "[ ]": tags.squareBracket,
  "{ }": tags.brace,
  ";": tags.separator,
  ",": tags.separator,
  "ArithOp": tags.arithmeticOperator,
  "CompareOp": tags.compareOperator,
  "UpdateOp": tags.updateOperator,
  "BinaryExpression|Expression": tags.operator,
  "AssignmentExpression": tags.definitionOperator,
  "ReturnStatement": tags.controlKeyword,
  "IfStatement": tags.controlKeyword,
  "ForStatement": tags.controlKeyword,
  "WhileStatement": tags.controlKeyword,
  "for|For": tags.controlKeyword,
  "if|If": tags.controlKeyword,
  "while|While": tags.controlKeyword,
  "return|Return": tags.controlKeyword,
  "FieldExpression": tags.propertyName
});

// Create GLSL-specific theme using the theme factory
export const glslTheme = createTheme({
  overrides: {
    // GLSL-specific overrides for base theme classes
    ".cm-variable": { color: "var(--white-60)" },
    ".cm-keyword": { color: "var(--gray)" },
    ".cm-control": { color: "var(--blue)", fontWeight: "900" },
    ".cm-type": { color: "var(--purple)", fontWeight: "900" },
    ".cm-number": { color: "var(--blue)" },
    ".cm-comment": { color: "var(--dark-gray)", fontStyle: "italic" },
    ".cm-preprocessor": { color: "var(--purple-50)" },
    
    // GLSL-specific overrides for uniform handling (this stays language-specific)
    ".cm-uniform .cm-variable": {
      color: "var(--pink)",
      borderRadius: "1rem",
      padding: "0 .5rem",
      fontSize: ".75rem",
      fontWeight: "900",
      border: "1px solid var(--pink-50)"
    },
    ".cm-main-function .cm-variable": {
      color: "var(--white)",
      fontWeight: "bold",
      fontStyle: "italic"
    },
    ".cm-builtin .cm-variable": {
      color: "var(--white)",
      fontWeight: "900",
      fontStyle: "italic"
    },
    ".cm-util-function .cm-variable": {
      color: "var(--orange)",
      fontWeight: "900",
      borderBottom: `2px solid var(--pink)`
    },
    ".cm-builtin-function .cm-variable": {
      color: "var(--green)"
    }
  }
});

export function createGLSLHighlighter(options?: any) {
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
        const mainRegex = /\bmain\b(?=\s*\()/g;
        let match;
        while ((match = mainRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-main-function"
            }).range(match.index, match.index + match[0].length)
          );
        }

        // Highlight gl_* built-in variables
        const glBuiltinRegex = /\bgl_\w+/g; // Fixed: was gls_ but should be gl_ for GLSL built-ins
        while ((match = glBuiltinRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-builtin"
            }).range(match.index, match.index + match[0].length)
          );
        }

        const utilFunctionRegex = /\bk_\w+/g;
        while ((match = utilFunctionRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-util-function"
            }).range(match.index, match.index + match[0].length)
          );
        }

        const builtinFunctions = [
          "sin",
          "cos",
          "tan",
          "asin",
          "acos",
          "atan",
          "pow",
          "exp",
          "log",
          "sqrt",
          "abs",
          "sign",
          "floor",
          "ceil",
          "fract",
          "mod",
          "min",
          "max",
          "clamp",
          "mix",
          "step",
          "smoothstep",
          "length",
          "distance",
          "dot",
          "cross",
          "normalize",
          "reflect",
          "refract",
          "texture2D",
          "texture",
          "dFdx",
          "dFdy",
          "fwidth"
        ];

        const builtinPattern = builtinFunctions.map(fn => fn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
        const builtinFuncRegex = new RegExp(`\\b(${builtinPattern})\\b`, "g");
        while ((match = builtinFuncRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: "cm-builtin-function"
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

const parser = glslParser.configure({
  props: [glslHighlighting]
});

const languageData = {
  commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
  indentOnInput: /^\s*(?:case |default:|{|}|#)$/,
  closeBrackets: {
    stringPrefixes: []
  }
};

export const glslLanguage = LRLanguage.define({
  name: "glsl",
  parser,
  languageData
});

// Create the GLSL language definition implementing the LanguageDefinition interface
export const glslLanguageDefinition: LanguageDefinition = {
  id: "glsl",
  name: "GLSL (OpenGL Shading Language)",
  languageSupport: glslLanguage,
  theme: glslTheme,
  highlighter: {
    createHighlighter: createGLSLHighlighter
  },
  completionSource: {
    source: (context: any, options: any) => {
      const uniformKeys = options?.uniformKeys || [];
      return uniformCompletionSource(uniformKeys)(context);
    }
  },
  stateConfig: {
    stateField: uniformKeysState,
    updateState: (view: EditorView, options: any) => {
      const newUniformKeys = options?.uniformKeys || [];
      updateEditorUniformKeys(view, newUniformKeys);
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

      if (nodeType === "Number" || /^\d*\.?\d+f?$/.test(nodeText)) {
        return {
          value: nodeText,
          type: "number",
          range: [node.from, node.to],
          click: { x: event.clientX, y: event.clientY }
        };
      }

      if (nodeType === "VariableName" || nodeType === "Identifier") {
        const uniformKeys = options?.uniformKeys || [];
        return {
          value: nodeText,
          type: uniformKeys.includes(nodeText) ? "uniform" : "identifier",
          range: [node.from, node.to],
          click: { x: event.clientX, y: event.clientY }
        };
      }

      return null;
    }
  },
  fileExtension: ".glsl"
};