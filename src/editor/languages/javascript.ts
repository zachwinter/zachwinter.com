import { javascriptLanguage as jsLang } from "@codemirror/lang-javascript";
import type { LanguageDefinition } from "../types/language";
import { createTheme } from "../themes/theme-factory";

export const javascriptLanguageDefinition: LanguageDefinition = {
  id: "javascript",
  name: "JavaScript",
  languageSupport: jsLang,
  theme: createTheme({
    // JavaScript-specific theme overrides can be added here via 'overrides' property
  }),
  fileExtension: ".js"
};
