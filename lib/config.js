export function getConfig(env = process.env) {
  const rawReload = env.RELOAD_SECONDS?.trim();
  let reloadSeconds = 5;

  if (rawReload) {
    if (/^\d+$/.test(rawReload) && Number.isSafeInteger(Number(rawReload))) {
      reloadSeconds = Number(rawReload);
    } else {
      console.warn("Invalid RELOAD_SECONDS; using the default of 5 seconds.");
    }
  }

  return {
    enableAuth: env.ENABLE_AUTH?.trim().toLowerCase() === "true",
    reloadSeconds,
  };
}
