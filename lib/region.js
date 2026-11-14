const metadataUrl = "http://169.254.169.254/latest";
const cacheDuration = 5 * 60 * 1000;
let cachedRegion;
let cacheExpires = 0;

export async function fetchMetadataRegion(fetchImpl = fetch) {
  const tokenResponse = await fetchImpl(`${metadataUrl}/api/token`, {
    method: "PUT",
    headers: { "X-aws-ec2-metadata-token-ttl-seconds": "60" },
    signal: AbortSignal.timeout(500),
    cache: "no-store",
  });
  if (!tokenResponse.ok) throw new Error(`IMDS token request returned ${tokenResponse.status}`);
  const token = await tokenResponse.text();
  if (!token) throw new Error("IMDS returned an empty token");

  const response = await fetchImpl(`${metadataUrl}/dynamic/instance-identity/document`, {
    headers: { "X-aws-ec2-metadata-token": token },
    signal: AbortSignal.timeout(500),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`IMDS identity request returned ${response.status}`);
  const document = await response.json();
  if (typeof document.region !== "string" || !document.region.trim()) {
    throw new Error("IMDS identity document did not contain a region");
  }
  return document.region.trim();
}

export async function getRegion(env = process.env) {
  const configured = env.AWS_REGION?.trim() || env.AWS_DEFAULT_REGION?.trim();
  if (configured) return configured;

  if (!cachedRegion || Date.now() >= cacheExpires) {
    cacheExpires = Date.now() + cacheDuration;
    cachedRegion = fetchMetadataRegion().catch((error) => {
      console.warn(`AWS region unavailable: ${error.message}`);
      return null;
    });
  }
  return cachedRegion;
}
