import { readFileSync } from "node:fs";
import { transformSync } from "esbuild";
import { expect, test } from "vitest";

// Issue #3: CSS is copied unchanged by the build, so syntax warnings must fail verification.
test("styles_css_has_no_syntax_warnings", () => {
  const source = readFileSync("styles.css", "utf8");

  const result = transformSync(source, { loader: "css", logLevel: "silent" });

  expect(result.warnings).toEqual([]);
});
