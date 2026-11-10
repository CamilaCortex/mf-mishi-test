import test from "node:test";
import assert from "node:assert/strict";

import { cleanText } from "../src/logic.js";

test("cleanText quita espacios sobrantes", () => {
  assert.equal(cleanText("  hola    mundo "), "hola mundo");
  assert.equal(cleanText(undefined), "");
});
