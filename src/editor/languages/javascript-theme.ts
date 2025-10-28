import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

// Define JavaScript syntax highlighting style
const jsHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, class: "cm-keyword" },
  { tag: tags.operator, class: "cm-operator" },
  { tag: tags.definitionOperator, class: "cm-definitionOperator" },
  { tag: tags.logicOperator, class: "cm-logicOperator" },
  { tag: tags.arithmeticOperator, class: "cm-arithmeticOperator" },
  { tag: tags.compareOperator, class: "cm-compareOperator" },
  { tag: tags.updateOperator, class: "cm-updateOperator" },
  { tag: tags.typeName, class: "cm-typeName" },
  { tag: tags.typeOperator, class: "cm-typeOperator" },
  { tag: tags.number, class: "cm-number" },
  { tag: tags.string, class: "cm-string" },
  { tag: tags.special(tags.string), class: "cm-string2" },
  { tag: tags.lineComment, class: "cm-comment" },
  { tag: tags.blockComment, class: "cm-comment" },
  { tag: tags.bool, class: "cm-bool" },
  { tag: tags.null, class: "cm-null" },
  { tag: tags.variableName, class: "cm-variableName" },
  { tag: tags.definition(tags.variableName), class: "cm-def" },
  { tag: tags.propertyName, class: "cm-propertyName" },
  { tag: tags.function(tags.variableName), class: "cm-function" },
  { tag: tags.definition(tags.function(tags.variableName)), class: "cm-def cm-function" },
  { tag: tags.labelName, class: "cm-labelName" },
  { tag: tags.bracket, class: "cm-bracket" },
  { tag: tags.escape, class: "cm-escape" },
  { tag: tags.regexp, class: "cm-regexp" },
  { tag: tags.color, class: "cm-color" },
  { tag: tags.tagName, class: "cm-tagName" },
  { tag: tags.attributeName, class: "cm-attributeName" },
  { tag: tags.namespace, class: "cm-namespace" },
  { tag: tags.meta, class: "cm-meta" },
  { tag: tags.separator, class: "cm-separator" },
  { tag: tags.punctuation, class: "cm-punctuation" },
  { tag: tags.processingInstruction, class: "cm-processingInstruction" },
  { tag: tags.inserted, class: "cm-inserted" },
  { tag: tags.deleted, class: "cm-deleted" },
  { tag: tags.changed, class: "cm-changed" },
  { tag: tags.invalid, class: "cm-invalid" }
]);

// Export the JavaScript syntax highlighting theme
export const jsSyntaxHighlighting = syntaxHighlighting(jsHighlightStyle);
