"use strict";

// Script 02 - OLD - Getting Transaction Information
// NOTE - This version uses .then() and .catch() callbacks

// Load Env Variables
const Dotenv = require("dotenv");
const dotenvConfig = Dotenv.config();
if (dotenvConfig.error) console.log(dotenvConfig.error);
// console.log(dotenvConfig);

const xrpl = require("xrpl");

// Define Servers
const apiTestnet =  new xrpl.Client("wss://s.altnet.rippletest.net/");
const apiMainnet = new xrpl.Client("wss://xrplcluster.com/");
const apiLocalnet = new xrpl.Client("ws://localhost:6006");
apiTestnet
// Define Addresses
let testWallet = undefined;

// Connect to Mainnet and get data
apiMainnet.connect().then(() => {
  const myAddress = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
  console.log(`Getting MAINNET Account info for: ${myAddress}`);
  return apiMainnet.request({
    "command": "account_info",
    "account": myAddress,
    "ledger_index": "validated"
  });
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
  apiLocalnet.connect().then(() => {
    const myAddress = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
    console.log(`Getting LOCALNET Account info for: ${myAddress}`);
    return apiLocalnet.request({
      "command": "account_info",
      "account": myAddress,
      "ledger_index": "validated"
    });
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
apiTestnet.connect().then(() => {
  const myAddress = "rww9WLeWwviNvAJV3QeRCof3kJLomPnaNw";
  console.log(`Getting TESTNET Account info for: ${myAddress}`);
  return apiTestnet.request({
    "command": "account_info",
    "account": myAddress,
    "ledger_index": "validated"
  });
}).then((info) => {
  console.log(info);
  console.log("getAccountInfo done.");
}).then(() => {
  return apiTestnet.disconnect();
}).then(() => {
  console.log("Done & disconnected");
}).catch(console.error);
