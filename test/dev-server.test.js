import test from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveRequestFile } from "../scripts/dev-server.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

test("the preview server resolves app directories to their index pages", () => {
  assert.equal(resolveRequestFile(root, "/"), join(root, "index.html"));
  assert.equal(resolveRequestFile(root, "/games/bloom/"), join(root, "games", "bloom", "index.html"));
  assert.equal(resolveRequestFile(root, "/games/color-splash/"), join(root, "games", "color-splash", "index.html"));
});

test("the preview server rejects missing and escaping paths", () => {
  assert.equal(resolveRequestFile(root, "/missing/"), null);
  assert.equal(resolveRequestFile(root, "/../package.json"), null);
});
