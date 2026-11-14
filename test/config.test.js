import test from "node:test";
import assert from "node:assert/strict";
import { getConfig } from "../lib/config.js";
import { fetchMetadataRegion, getRegion } from "../lib/region.js";

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

test("region environment variables take precedence", async () => {
  assert.equal(await getRegion({ AWS_REGION: "us-east-1", AWS_DEFAULT_REGION: "eu-west-1" }), "us-east-1");
  assert.equal(await getRegion({ AWS_REGION: " ", AWS_DEFAULT_REGION: "eu-west-1" }), "eu-west-1");
});

test("metadata lookup uses an IMDSv2 token", async () => {
  const calls = [];
  const fakeFetch = async (url, options) => {
    calls.push({ url, options });
    return calls.length === 1
      ? new Response("token", { status: 200 })
      : Response.json({ region: "ap-southeast-2" });
  };
  assert.equal(await fetchMetadataRegion(fakeFetch), "ap-southeast-2");
  assert.equal(calls[0].options.method, "PUT");
  assert.equal(calls[1].options.headers["X-aws-ec2-metadata-token"], "token");
});

test("metadata errors are not mistaken for a region", async () => {
  await assert.rejects(fetchMetadataRegion(async () => new Response(null, { status: 403 })), /403/);
});
