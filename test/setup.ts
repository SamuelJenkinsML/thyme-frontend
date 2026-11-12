import "@testing-library/jest-dom/vitest";

import { vi } from "vitest";

// Node's storage globals shadow jsdom storage in Vitest 3 on Node 25 and later.
const dom = (globalThis as unknown as { jsdom: { window: Window } }).jsdom;
vi.stubGlobal("localStorage", dom.window.localStorage);
vi.stubGlobal("sessionStorage", dom.window.sessionStorage);
