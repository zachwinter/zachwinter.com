import { EditorView, type DecorationSet, ViewUpdate } from '@codemirror/view'
import { ViewPlugin, Decoration } from '@codemirror/view'
import { LRLanguage, syntaxHighlighting, HighlightStyle, LanguageDescription } from '@codemirror/language'
import { parser as glslParser } from 'lezer-glsl'
import { styleTags, tags } from '@lezer/highlight'
import { baseTheme, baseHighlightStyle } from './base-theme'

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
})

const glslHighlightStyle = HighlightStyle.define([
  { tag: tags.typeName, class: 'glsl-type' },
  { tag: tags.variableName, class: 'glsl-variable' },
  { tag: tags.keyword, class: 'glsl-keyword' },
  { tag: tags.controlKeyword, class: 'glsl-control' },
  { tag: tags.number, class: 'glsl-number' },
  { tag: tags.string, class: 'glsl-string' },
  { tag: tags.lineComment, class: 'glsl-comment' },
  { tag: tags.blockComment, class: 'glsl-comment' },
  { tag: tags.meta, class: 'glsl-preprocessor' },
  { tag: tags.content, class: 'glsl-content' },
  { tag: tags.operator, class: 'glsl-operator' },
  { tag: tags.arithmeticOperator, class: 'glsl-arithmetic' },
  { tag: tags.updateOperator, class: 'glsl-update' },
  { tag: tags.compareOperator, class: 'glsl-compare' },
  { tag: tags.definitionOperator, class: 'glsl-assignment' },
  { tag: tags.propertyName, class: 'glsl-property' }
])

export const glslTheme = [
  EditorView.theme({
    '.glsl-type': { color: 'var(--purple)', fontWeight: '900' },
    '.glsl-variable': { color: 'var(--white-60)' },
    '.glsl-definition': { color: 'var(--blue)', fontWeight: '900' },
    '.glsl-keyword': { color: 'var(--gray)' },
    '.glsl-control': { color: 'var(--blue)', fontWeight: '900' },
    '.glsl-number': { color: 'var(--blue)' },
    '.glsl-comment': { color: 'var(--dark-gray)', fontStyle: 'italic' },
    '.glsl-preprocessor': { color: 'var(--purple-50)' },
    '.glsl-operator': { color: 'var(--pink)' },
    '.glsl-arithmetic': { color: 'var(--purple-80)' },
    '.glsl-update': { color: 'var(--purple-80)' },
    '.glsl-compare': { color: 'var(--purple-80)' },
    '.glsl-assignment': { color: 'var(--purple-80)' },
    '.glsl-property': { color: 'var(--yellow)' },
    '.glsl-content': { color: 'var(--light-gray)' },
    '.cm-uniform .glsl-variable': {
      color: 'var(--pink)',
      borderRadius: '1rem',
      padding: '0 .5rem',
      fontSize: '.75rem',
      fontWeight: '900',
      border: '1px solid var(--pink-50)'
    },
    '.cm-main-function .glsl-variable': {
      color: 'var(--white)',
      fontWeight: 'bold',
      fontStyle: 'italic'
    },
    '.cm-builtin .glsl-variable': {
      color: 'var(--white)',
      fontWeight: '900',
      fontStyle: 'italic'
    },
    '.cm-line': {
      width: 'fit-content',
      marginLeft: '1rem',
      borderRadius: '1rem',
      paddingRight: '.5rem',
      fontSize: '.8rem',
      lineHeight: '1.2rem',
      fontFamily: `"Space Mono", monospace !important`,
      background: 'var(--black)'
    },
    '.cm-line ': {
      color: 'var(--blue)'
    },
    '.cm-line.cm-comment-line': {
      background: 'linear-gradient(to right, var(--black-30),  var(--black-60))',
      borderColor: 'transparent'
    },
    '.cm-line.cm-comment-line *': {
      color: 'var(--white-70)'
    },
    '.cm-line.cm-empty-line': {
      background: 'transparent',
      minHeight: '1.2rem',
      borderStyle: 'dashed',
      borderColor: 'var(--white-10)'
    },
    '.cm-util-function .glsl-variable': {
      color: 'var(--orange)',
      fontWeight: '900',
      borderBottom: `2px solid var(--pink)`
    },
    '.cm-builtin-function .glsl-variable': {
      color: 'var(--green)'
    },
    '.cm-editor': {
      outline: 'none',
      background: 'var(--black)'
    },
    '.cm-editor.cm-focused': {
      outline: 'none'
    },
    '.cm-gutters': {
      background: 'var(--black-30)',
      borderTopRightRadius: '1rem',
      borderBottomRightRadius: '1rem',
      color: 'var(--white-40)',
      border: 'none'
    },
    '.cm-gutters *': {
      background: 'transparent !important',
      fontFamily: `"Space Mono", monospace !important`
    }
  }),
  syntaxHighlighting(glslHighlightStyle)
]

export function createGLSLHighlighter() {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet

      constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view)
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = this.buildDecorations(update.view)
        }
      }

      buildDecorations(view: EditorView) {
        const decorations: any[] = []
        const doc = view.state.doc.toString()
        const mainRegex = /\bmain\b(?=\s*\()/g
        let match
        while ((match = mainRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: 'cm-main-function'
            }).range(match.index, match.index + match[0].length)
          )
        }

        // 2. Highlight gl_* built-in variables - SAME PATTERN AS UNIFORMS
        const glBuiltinRegex = /\bgl_\w+/g
        while ((match = glBuiltinRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: 'cm-builtin'
            }).range(match.index, match.index + match[0].length)
          )
        }

        const utilFunctionRegex = /\bk_\w+/g
        while ((match = utilFunctionRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: 'cm-util-function'
            }).range(match.index, match.index + match[0].length)
          )
        }

        const builtinFunctions = [
          'sin',
          'cos',
          'tan',
          'asin',
          'acos',
          'atan',
          'pow',
          'exp',
          'log',
          'sqrt',
          'abs',
          'sign',
          'floor',
          'ceil',
          'fract',
          'mod',
          'min',
          'max',
          'clamp',
          'mix',
          'step',
          'smoothstep',
          'length',
          'distance',
          'dot',
          'cross',
          'normalize',
          'reflect',
          'refract',
          'texture2D',
          'texture',
          'dFdx',
          'dFdy',
          'fwidth'
        ]

        const builtinPattern = builtinFunctions
          .map((fn) => fn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('|')
        const builtinFuncRegex = new RegExp(`\\b(${builtinPattern})\\b(?=\\s*\\()`, 'g')
        while ((match = builtinFuncRegex.exec(doc)) !== null) {
          decorations.push(
            Decoration.mark({
              class: 'cm-builtin-function'
            }).range(match.index, match.index + match[0].length)
          )
        }

        // SORT decorations by position before creating the set
        decorations.sort((a, b) => a.from - b.from)

        return Decoration.set(decorations)
      }
    },
    {
      decorations: (v) => v.decorations
    }
  )
}

const languageData = {
  commentTokens: { line: '//', block: { open: '/*', close: '*/' } },
  indentOnInput: /^\s*(?:case |default:|\{|\}|#)$/,
  closeBrackets: {
    stringPrefixes: []
  }
}

const parser = glslParser.configure({
  props: [glslHighlighting]
})

export const glslLanguage = LRLanguage.define({
  name: 'glsl',
  parser,
  languageData
})

export interface ThemeOptions {
  // Custom CSS classes to override default theme styles
  overrides?: Record<string, any>

  // Language-specific highlight rules for syntax tags
  tagMappings?: Record<string, string>

  // Custom highlighters for language-specific features (like GLSL uniforms)
  createHighlighter?: () => any
}

export function createTheme(options: ThemeOptions = {}): any[] {
  const { overrides = {}, tagMappings = {}, createHighlighter } = options
  // Create syntax highlighting based on base style with language-specific tag mappings
  const themeHighlightStyle = baseHighlightStyle

  // Create theme with base styles and overrides
  const theme = [
    ...baseTheme,
    EditorView.theme({
      // Apply base styles first
      ...overrides

      // Language-specific adjustments can be added here
    })
  ]

  if (createHighlighter) {
    theme.push(createHighlighter())
  }

  return [...theme, syntaxHighlighting(themeHighlightStyle)]
}
