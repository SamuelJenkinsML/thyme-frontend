import { codeToHtml } from "shiki";

export async function highlightSource(
  source: string,
  lang: "python" | "yaml",
): Promise<string> {
  return codeToHtml(source, {
    lang,
    theme: "material-theme-palenight",
    transformers: [
      {
        pre(node) {
          node.properties.class = "shiki-pre";
          return node;
        },
      },
    ],
  });
}
