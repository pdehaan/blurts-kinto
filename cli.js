#!/usr/bin/env node

const lib = require("./lib");

main();

async function main() {
  try {
    await lib.getMissingBreaches();
    console.log("RemoteSettings is up to date!");
  } catch (err) {
    console.info(err.message);
    console.error(JSON.stringify(err.missingBreaches, null, 2));
    process.exitCode = 1;
    return;
  }
}
