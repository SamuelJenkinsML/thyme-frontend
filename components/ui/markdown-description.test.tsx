import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MarkdownDescription } from "./markdown-description";

describe("MarkdownDescription", () => {
  it("renders an H1 heading", () => {
    const { container } = render(<MarkdownDescription># Hello world</MarkdownDescription>);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toBe("Hello world");
  });

  it("renders links with target=_blank and rel=noopener", () => {
    const { container } = render(
      <MarkdownDescription>[click](https://example.com)</MarkdownDescription>,
    );
    const a = container.querySelector("a");
    expect(a?.getAttribute("href")).toBe("https://example.com");
    expect(a?.getAttribute("target")).toBe("_blank");
    expect(a?.getAttribute("rel")).toContain("noopener");
  });

  it("renders fenced code blocks", () => {
    const md = "```\nconst x = 1;\n```";
    const { container } = render(<MarkdownDescription>{md}</MarkdownDescription>);
    const pre = container.querySelector("pre");
    expect(pre).not.toBeNull();
    const code = pre?.querySelector("code");
    expect(code?.textContent).toContain("const x = 1;");
  });

  it("renders GFM tables", () => {
    const md = `| h1 | h2 |\n| --- | --- |\n| a | b |`;
    const { container } = render(<MarkdownDescription>{md}</MarkdownDescription>);
    expect(container.querySelector("table")).not.toBeNull();
    expect(container.querySelector("thead")).not.toBeNull();
    expect(container.querySelector("tbody")).not.toBeNull();
  });

  // ----- XSS -----

  it("strips raw <script> tags", () => {
    const { container } = render(
      <MarkdownDescription>{`<script>alert(1)</script>`}</MarkdownDescription>,
    );
    // Critical XSS guarantee: no <script> element in the rendered tree.
    expect(container.querySelector("script")).toBeNull();
  });

  it("does not leak script tags when mixed with regular text", () => {
    // Defence in depth: even adjacent to safe content, scripts are stripped.
    const { container } = render(
      <MarkdownDescription>{`Hello\n\n<script>alert(1)</script>\n\nWorld`}</MarkdownDescription>,
    );
    expect(container.querySelector("script")).toBeNull();
    // "Hello" and "World" paragraphs survive even though the script block is gone.
    expect(container.textContent).toContain("Hello");
    expect(container.textContent).toContain("World");
  });

  it("strips javascript: URLs from links", () => {
    const md = `[click](javascript:alert(1))`;
    const { container } = render(<MarkdownDescription>{md}</MarkdownDescription>);
    const a = container.querySelector("a");
    // Either the anchor is stripped entirely or its href is sanitised away —
    // both outcomes are safe. The XSS guarantee is that no anchor with a
    // `javascript:` href reaches the DOM.
    if (a) {
      const href = a.getAttribute("href") ?? "";
      expect(href.toLowerCase()).not.toMatch(/^javascript:/);
    }
  });

  it("strips onerror handlers from raw <img> tags", () => {
    const { container } = render(
      <MarkdownDescription>{`<img src="x" onerror="alert(1)">`}</MarkdownDescription>,
    );
    expect(container.querySelector("img[onerror]")).toBeNull();
  });
});
