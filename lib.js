const axios = require("axios");

const HIBP_BREACH_ENDPOINT = "https://monitor.firefox.com/hibp/breaches";
const REMOTE_SETTINGS_ENDPOINT = "https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/fxmonitor-breaches/records";

module.exports = {
  HIBP_BREACH_ENDPOINT,
  REMOTE_SETTINGS_ENDPOINT,
  getMissingBreaches
};

async function getMissingBreaches() {
  const hibpBreaches = await fetchHIBP();
  const remoteSettingsBreaches = await fetchRemoteSettings();
  const missingBreaches = hibpBreaches.filter(breach => !remoteSettingsBreaches.has(breach.Name));
  if (missingBreaches.length) {
    const err = new Error("Missing breaches");
    err.missingBreaches = missingBreaches;
    throw err;
  }
  // return missingBreaches;
}

async function fetchHIBP() {
  const res = await axios.get(HIBP_BREACH_ENDPOINT);
  return res.data.filter(breach => isActiveBreach(breach));
}

async function fetchRemoteSettings() {
  const res = await axios.get(REMOTE_SETTINGS_ENDPOINT);
  return new Set(res.data.data.map(breach => breach.Name));
}

function isActiveBreach(breach) {
  return breach.Domain !== "" &&
    breach.IsVerified &&
    !breach.IsRetired &&
    !breach.IsSpamList &&
    !breach.IsFabricated;
}
