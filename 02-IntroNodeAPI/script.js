"use strict";

// Script 02 - Getting Transaction Information

// Load Env Variables
const Dotenv = require("dotenv");
const dotenvConfig = Dotenv.config();
if (dotenvConfig.error) console.log(dotenvConfig.error);
// console.log(dotenvConfig);

const RippleAPI = require("ripple-lib").RippleAPI;

// Connect to Mainnet and get data
const apiMainnet = new RippleAPI({
  server: "wss://s2.ripple.com"  // mainnet Public Server
});

apiMainnet.connect().then(() => {
  const myAddress = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
  console.log(`Getting MAINNET Account info for: ${myAddress}`);
  return apiMainnet.getAccountInfo(myAddress);
}).then((info) => {
  console.log(info);
  console.log("getAccountInfo done.");
}).then(() => {
  return apiMainnet.disconnect();
}).then(() => {
  console.log("Done & disconnected");
}).catch(console.error);

// Check if local server exists & connect to get same data
console.log(process.env.RIPPLED_LOCAL_SERVER);

if (process.env.RIPPLED_LOCAL_SERVER === "1") {
  const apiLocalnet = new RippleAPI({
    server: "ws://localhost:6006"  // mainnet Local Server
  });

  apiLocalnet.connect().then(() => {
    const myAddress = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
    console.log(`Getting LOCALNET Account info for: ${myAddress}`);
    return apiLocalnet.getAccountInfo(myAddress);
  }).then((info) => {
    console.log(info);
    console.log("getAccountInfo done.");
  }).then(() => {
    return apiLocalnet.disconnect();
  }).then(() => {
    console.log("Done & disconnected");
  }).catch(console.error);
}

// Connect to Testnet and get data
const apiTestnet = new RippleAPI({
  server: "wss://s.altnet.rippletest.net/"  // mainnet Public Server
});

apiTestnet.connect().then(() => {
  const myAddress = "rww9WLeWwviNvAJV3QeRCof3kJLomPnaNw";
  console.log(`Getting TESTNET Account info for: ${myAddress}`);
  return apiTestnet.getAccountInfo(myAddress);
}).then((info) => {
  console.log(info);
  console.log("getAccountInfo done.");
}).then(() => {
  return apiTestnet.disconnect();
}).then(() => {
  console.log("Done & disconnected");
}).catch(console.error);
