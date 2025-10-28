// Language-specific exports
import { glslLanguageDefinition } from "./glsl";
import { javascriptLanguageDefinition } from "./javascript";
import { rustLanguageDefinition } from "./rust";
import { pythonLanguageDefinition } from "./python";
import { cppLanguageDefinition } from "./cpp";
import { htmlLanguageDefinition } from "./html";
import { xmlLanguageDefinition } from "./xml";
import { vueLanguageDefinition } from "./vue-lang";

// Register languages
import { LanguageRegistry } from "../language-registry";

export function registerLanguages() {
  // Register GLSL language (already defined)
  LanguageRegistry.register(glslLanguageDefinition);
  // Register JavaScript language
  LanguageRegistry.register(javascriptLanguageDefinition);
  // Register Rust language
  LanguageRegistry.register(rustLanguageDefinition);
  // Register Python language
  LanguageRegistry.register(pythonLanguageDefinition);
  // Register C++ language
  LanguageRegistry.register(cppLanguageDefinition);
  // Register HTML language
  LanguageRegistry.register(htmlLanguageDefinition);
  // Register XML language
  LanguageRegistry.register(xmlLanguageDefinition);
  // Register Vue language
  LanguageRegistry.register(vueLanguageDefinition);
}

export { 
  glslLanguageDefinition, 
  javascriptLanguageDefinition, 
  rustLanguageDefinition,
  pythonLanguageDefinition,
  cppLanguageDefinition,
  htmlLanguageDefinition,
  xmlLanguageDefinition,
  vueLanguageDefinition
};
