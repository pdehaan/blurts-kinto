const axios = require("axios");

module.exports = {
  getMissingBreaches
};

async function getMissingBreaches() {
  const hibpBreaches = await fetchHIBP();
  const remoteSettingsBreaches = await fetchRemoteSettings();

  return hibpBreaches.filter(breach => !remoteSettingsBreaches.has(breach.Name));
}

async function fetchHIBP() {
  const res = await axios.get("https://monitor.firefox.com/hibp/breaches");
  return res.data.filter(breach => !isIgnoredBreach(breach));
}

async function fetchRemoteSettings() {
  const res = await axios.get("https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/fxmonitor-breaches/records");
  return new Set(res.data.data.map(breach => breach.Name));
}

function isIgnoredBreach(breach) {
  return !(breach.Domain !== "" && breach.IsVerified && !breach.IsFabricated && !breach.IsRetired && !breach.IsSpamList);
}
