// Language registry for the generalized editor system
import type { LanguageDefinition } from "./types/language";

export class LanguageRegistry {
  private static languages: Map<string, LanguageDefinition> = new Map();

  static register(languageDefinition: LanguageDefinition) {
    this.languages.set(languageDefinition.id, languageDefinition);
  }

  static get(id: string): LanguageDefinition | undefined {
    return this.languages.get(id);
  }

  static getAll(): LanguageDefinition[] {
    return Array.from(this.languages.values());
  }
}
