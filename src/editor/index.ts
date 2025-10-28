// Main exports for @wearekaleidosync/editor
export * from "./codemirror";
export * from "./types/language";
export { LanguageRegistry } from "./language-registry";

// Register default languages
import { registerLanguages } from "./languages";

// Register all default languages
registerLanguages();

// Re-export specific modules for convenience
export * as glsl from "./glsl";
export * as themes from "./themes";
export * as uniforms from "./uniforms";
export * as languages from "./languages";
