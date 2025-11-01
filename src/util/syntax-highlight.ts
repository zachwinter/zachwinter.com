import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'

// Register common languages
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)

// Simple Nord-inspired color scheme
export const defaultColorScheme: Record<string, string> = {
  keyword: '#81A1C1', // Blue
  built_in: '#88C0D0', // Cyan
  type: '#8FBCBB', // Teal
  literal: '#B48EAD', // Purple
  number: '#B48EAD', // Purple
  string: '#A3BE8C', // Green
  comment: '#616E88', // Gray (dim)
  function: '#88C0D0', // Cyan
  class: '#8FBCBB', // Teal
  variable: '#D8DEE9', // Light gray
  operator: '#81A1C1', // Blue
  punctuation: '#D8DEE9', // Light gray
  default: '#D8DEE9' // Light gray (default text)
}

export interface CharWithColor {
  char: string
  color: string
}

/**
 * Parse highlight.js HTML output into character-color pairs
 * Uses DOMParser because we're not monsters who parse HTML with regex
 */
function parseHighlightedHTML(html: string, colorScheme: Record<string, string>): CharWithColor[] {
  const result: CharWithColor[] = []

  // Use the browser's actual HTML parser like civilized people
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
  const container = doc.body.firstChild as HTMLElement

  if (!container) {
    return html.split('').map(char => ({ char, color: colorScheme.default }))
  }

  // Walk the DOM tree and extract text with colors
  function walkNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Plain text node
      const text = node.textContent || ''
      for (const char of text) {
        result.push({ char, color: colorScheme.default })
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement

      // Check if this is a highlight span
      if (element.tagName === 'SPAN' && element.className) {
        // Extract token type from class (e.g., "hljs-keyword" -> "keyword")
        const classes = element.className.split(' ')
        let tokenType = 'default'

        for (const cls of classes) {
          if (cls.startsWith('hljs-')) {
            tokenType = cls.replace('hljs-', '').replace(/_/g, '-')
            break
          }
        }

        const color = colorScheme[tokenType] || colorScheme.default
        const text = element.textContent || ''

        for (const char of text) {
          result.push({ char, color })
        }
      } else {
        // Recursively walk children
        for (const child of Array.from(node.childNodes)) {
          walkNode(child)
        }
      }
    }
  }

  for (const child of Array.from(container.childNodes)) {
    walkNode(child)
  }

  return result
}

/**
 * Highlight a line of code and return character-color pairs
 */
export function highlightLine(
  line: string,
  language: string,
  colorScheme: Record<string, string> = defaultColorScheme
): CharWithColor[] {
  try {
    const result = hljs.highlight(line, { language })
    return parseHighlightedHTML(result.value, colorScheme)
  } catch (e) {
    // If highlighting fails, return plain text
    return line.split('').map(char => ({
      char,
      color: colorScheme.default
    }))
  }
}

/**
 * Highlight multiple lines of code
 */
export function highlightCode(
  code: string,
  language: string,
  colorScheme: Record<string, string> = defaultColorScheme
): CharWithColor[][] {
  const lines = code.split('\n')
  return lines.map(line => highlightLine(line, language, colorScheme))
}
