"use strict";

// Script 02 - Getting Transaction Information
// NOTE - This version uses Promises with async/await

// Load Env Variables
const Dotenv = require("dotenv");
const dotenvConfig = Dotenv.config();
if (dotenvConfig.error) console.log(dotenvConfig.error);
// console.log(dotenvConfig);

// Load API
const xrpl = require("xrpl");

// Define Servers
const TEST_SERVER = "wss://s.altnet.rippletest.net/";
const MAIN_SERVER = "wss://xrplcluster.com/";
const LOCAL_SERVER = "ws://localhost:6006";

// Define Addresses
let testWallet = undefined;

// Async Function to Connect to TestNet and get data
async function testFunc() {
  const client = new xrpl.Client(TEST_SERVER);
  console.log("Connecting...");
  await client.connect();

  // Fund and retrieve a NEW Testnet wallet
  // const fundResult1 = await client.fundWallet(testWallet);
  // testWallet = fundResult1.wallet;
  // console.log(fundResult1);

  // Fund the NEW Testnet wallet again
  // const fundResult2 = await client.fundWallet(testWallet);
  // console.log(fundResult2);

  // Create a wallet WITHOUT funding
  // testWallet = xrpl.Wallet.generate();
  // console.log(testWallet);

  // Create a wallet from a mnemonic
  // testWallet = xrpl.Wallet.fromMnemonic("insect exotic retreat jump horse claim chef second west gossip bone frown jewel laundry embark");
  // console.log(testWallet);

  // Create a wallet from an existing SEED
  console.log("Getting Wallet...");
  testWallet = xrpl.Wallet.fromSeed(process.env.XRPL_SECRET);
  console.log(testWallet);

  // Fund the Existing Testnet wallet again
  // const fundResult3 = await client.fundWallet(testWallet);
  // console.log(fundResult3);

  // Get Account Information
  console.log(`Getting TESTNET Account info for: ${testWallet.address}`);
  const response = await client.request({
    "command": "account_info",
    "account": testWallet.classicAddress,
    "ledger_index": "validated"
  });
  console.log(response);

  client.disconnect();
  console.log("Disconnected...");
}

// Run the TestNet function
testFunc();


// Async Function to Connect to MainNet and get data
async function mainFunc() {
  const client = new xrpl.Client(MAIN_SERVER);
  console.log("Connecting...");
  await client.connect();

  // Get Account Information
  const mainAddress = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
  console.log(`Getting MAINNET Account info for: ${mainAddress}`);
  const response = await client.request({
    "command": "account_info",
    "account": mainAddress,
    "ledger_index": "validated"
  });
  console.log(response);

  client.disconnect();
  console.log("Disconnected...");
}

// Run the MainNet function
mainFunc();


// Async Function to Connect to LocalNet and get data
async function localFunc() {
  const client = new xrpl.Client(LOCAL_SERVER);
  console.log("Connecting...");
  await client.connect();

  // Get Account Information
  const localAddress = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
  console.log(`Getting LOCALNET Account info for: ${localAddress}`);
  const response = await client.request({
    "command": "account_info",
    "account": localAddress,
    "ledger_index": "validated"
  });
  console.log(response);

  client.disconnect();
  console.log("Disconnected...");
}

// Check if local server exists & connect to get same data
console.log(process.env.RIPPLED_LOCAL_SERVER);

if (process.env.RIPPLED_LOCAL_SERVER === "1") {
  localFunc();
}
