import { EditorView, type DecorationSet, ViewUpdate } from "@codemirror/view";
import { ViewPlugin, Decoration } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";
import * as glslUtils from "../constants/glsl-util";
import { TYPES, KEYWORDS, MATH } from "../constants/glsl-lang";

export const updateUniformKeys = StateEffect.define<string[]>();
export const uniformKeysState = StateField.define<string[]>({
  create() {
    return [];
  },
  update(value, tr) {
    for (let effect of tr.effects) {
      if (effect.is(updateUniformKeys)) {
        return effect.value;
      }
    }
    return value;
  }
});

export function createUniformHighlighter() {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
      }

      update(update: ViewUpdate) {
        const stateChanged = update.state.field(uniformKeysState) !== update.startState.field(uniformKeysState);

        if (update.docChanged || update.viewportChanged || stateChanged) {
          this.decorations = this.buildDecorations(update.view);
        }
      }

      buildDecorations(view: EditorView) {
        const decorations: any[] = [];
        const doc = view.state.doc.toString();

        let uniformKeys: string[];

        try {
          uniformKeys = view.state.field(uniformKeysState);
        } catch (e) {
          uniformKeys = [];
        }

        if (uniformKeys.length > 0) {
          const pattern = uniformKeys.map(key => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
          const regex = new RegExp(`\\b(${pattern})\\b`, "g");
          let match;

          while ((match = regex.exec(doc)) !== null) {
            const decoration = Decoration.mark({
              class: "cm-uniform"
            }).range(match.index, match.index + match[0].length);

            decorations.push(decoration);
          }
        }

        return Decoration.set(decorations);
      }
    },
    {
      decorations: v => v.decorations
    }
  );
}

export function uniformCompletionSource(uniformKeys: string[] = []) {
  return (context: any) => {
    const word = context.matchBefore(/\w*/);
    if (!word || (word.from === word.to && !context.explicit)) return null;

    const completions = [
      // Legacy uniforms
      { label: "resolution", type: "variable", info: "Screen resolution (vec2: width, height)" },
      { label: "time", type: "variable", info: "Time in seconds" },
      { label: "volume", type: "variable", info: "Audio volume" },
      { label: "stream", type: "variable", info: "Audio stream" },

      // Shadertoy uniforms
      { label: "iResolution", type: "variable", info: "Screen resolution (vec3: width, height, aspect)" },
      { label: "iTime", type: "variable", info: "Time in seconds (Shadertoy)" },
      { label: "iVolume", type: "variable", info: "Audio volume (Shadertoy)" },
      { label: "iStream", type: "variable", info: "Audio stream (Shadertoy)" },

      ...uniformKeys.map(key => ({
        label: key,
        type: "variable",
        info: "Custom uniform"
      })),

      ...TYPES.map(type => ({
        label: type,
        type: "type",
        info: `GLSL type: ${type}`
      })),

      ...KEYWORDS.map(keyword => ({
        label: keyword,
        type: "keyword",
        info: `GLSL keyword: ${keyword}`
      })),

      ...MATH.map(func => ({
        label: func,
        type: "function",
        info: `GLSL function: ${func}`
      })),

      ...Object.keys(glslUtils).map(key => ({
        label: key,
        type: "function",
        info: `Utility function: ${key}`
      }))
    ];

    return {
      from: word.from,
      options: completions
    };
  };
}

export function updateEditorUniformKeys(view: EditorView, uniformKeys: string[]) {
  view.dispatch({
    effects: updateUniformKeys.of(uniformKeys)
  });
}
