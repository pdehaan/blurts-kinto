#!/usr/bin/env node

const lib = require("./lib");

main();

async function main() {
  const missingBreaches = await lib.getMissingBreaches();

  if (missingBreaches.length) {
    console.info("Missing:");
    console.error(JSON.stringify(missingBreaches, null, 2));
    process.exitCode = 1;
    return;
  }
  console.log("RemoteSettings is up to date!");
}
