import { computed, type Ref } from "vue";

export function useFiletypeLanguage(fileType: Ref<string>) {
  const language = computed(() => {
    if (fileType.value === "rs") return "rust";
    if (fileType.value === "ts") return "javascript";
    if (fileType.value === "js") return "javascript";
    if (fileType.value === "py") return "python";
    if (fileType.value === "vue") return "vue";
    return "glsl";
  });

  return language;
}
