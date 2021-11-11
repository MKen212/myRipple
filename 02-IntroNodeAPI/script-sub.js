"use strict";

// Script 02-sub - Subscribe to Ledger Close Events

// Load Env Variables
const Dotenv = require("dotenv");
const dotenvConfig = Dotenv.config();
if (dotenvConfig.error) console.log(dotenvConfig.error);

// Load API
const xrpl = require("xrpl");

// Define Servers
const TEST_SERVER = "wss://s.altnet.rippletest.net/";
const LOCAL_SERVER = "ws://localhost:6006";

async function sub() {
  const client = process.env.RIPPLED_LOCAL_SERVER === "1" ?
    new xrpl.Client(LOCAL_SERVER) :
    new xrpl.Client(TEST_SERVER);
  
  console.log("Connecting...");
  await client.connect();

  // Subscribe to Ledger Events
  console.log(`Subscribing to Ledger Events...`);
  const response = await client.request({
    "command": "subscribe",
    "streams": ["ledger"]
  });
  console.log(response);

  // Display results of Ledger Closed Events
  client.on("ledgerClosed", async(ledger) => {
    console.log(ledger);
  });

}

// Run sub() function
sub();