import test from "node:test";
import assert from "node:assert/strict";
import { getConfig } from "../lib/config.js";

test("configuration defaults and explicit values", () => {
  assert.deepEqual(getConfig({}), { enableAuth: false, reloadSeconds: 5 });
  assert.deepEqual(getConfig({ ENABLE_AUTH: "TRUE", RELOAD_SECONDS: "0" }), { enableAuth: true, reloadSeconds: 0 });
  assert.deepEqual(getConfig({ ENABLE_AUTH: "false", RELOAD_SECONDS: "12" }), { enableAuth: false, reloadSeconds: 12 });
});

test("invalid reload intervals fall back to five seconds", () => {
  for (const value of ["-1", "1.5", "no", "9007199254740992"]) {
    assert.equal(getConfig({ RELOAD_SECONDS: value }).reloadSeconds, 5);
  }
});
