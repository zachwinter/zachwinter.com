import { EditorView } from '@codemirror/view'
import { HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'

export const baseTheme = [
  EditorView.theme({
    // Semantic color categories (language-agnostic)
    '.cm-keyword': { color: 'var(--gray)' },
    '.cm-control': { color: 'var(--blue)', fontWeight: '100' },
    '.cm-type': { color: 'var(--purple)', fontWeight: '100' },
    '.cm-variable': { color: 'var(--white-70)' },
    '.cm-number': { color: 'var(--blue)' },
    '.cm-string': { color: 'var(--yellow)' },
    '.cm-comment': { color: 'var(--dark-gray)', fontStyle: 'italic' },
    '.cm-preprocessor': { color: 'var(--purple-50)' },
    '.cm-operator': { color: 'var(--pink)' },
    '.cm-arithmetic': { color: 'var(--purple-80)' },
    '.cm-update': { color: 'var(--purple-80)' },
    '.cm-compare': { color: 'var(--purple-80)' },
    '.cm-assignment': { color: 'var(--purple-80)' },
    '.cm-property': { color: 'var(--yellow)' },
    '.cm-function': { color: 'var(--green)', fontWeight: 'bold' },
    '.cm-builtin': { color: 'var(--white)' }, // Used for built-in functions/variables

    '.cm-highlightSpace': {
      opacity: 0.1
    },
    // Editor base styles (applicable to all languages)
    '.cm-line': {
      width: 'fit-content',
      marginLeft: '1rem',
      borderRadius: '1rem',
      fontWeight: '100',
      paddingRight: '.5rem',
      fontSize: '.8rem',
      lineHeight: '1.2rem',
      fontFamily: `"Space Mono", monospace !important`,
      background: 'var(--black)'
    },
    '.cm-gutters': {
      background: 'var(--black-30)',
      borderTopRightRadius: '1rem',
      borderBottomRightRadius: '1rem',
      fontSize: '.5rem',
      color: 'var(--white-40)',
      display: 'none',
      border: 'none'
    },
    '.cm-gutters *': {
      background: 'transparent !important',
      fontFamily: `"Space Mono", monospace !important`
    },
    '.cm-editor': {
      outline: 'none',
      background: 'var(--black)'
    }
  })
]

export const baseHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, class: 'cm-keyword' },
  { tag: tags.controlKeyword, class: 'cm-control' },
  { tag: tags.typeName, class: 'cm-type' },
  { tag: tags.variableName, class: 'cm-variable' },
  { tag: tags.number, class: 'cm-number' },
  { tag: tags.string, class: 'cm-string' },
  { tag: tags.lineComment, class: 'cm-comment' },
  { tag: tags.blockComment, class: 'cm-comment' },
  { tag: tags.meta, class: 'cm-preprocessor' },
  { tag: tags.operator, class: 'cm-operator' },
  { tag: tags.arithmeticOperator, class: 'cm-arithmetic' },
  { tag: tags.updateOperator, class: 'cm-update' },
  { tag: tags.compareOperator, class: 'cm-compare' },
  { tag: tags.definitionOperator, class: 'cm-assignment' },
  { tag: tags.propertyName, class: 'cm-property' },
  { tag: tags.function(tags.variableName), class: 'cm-function' }
])
