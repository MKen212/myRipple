"use strict";

// Script 09 - Payment Channel Claim

// Load Env Variables
const Dotenv = require("dotenv");
const dotenvConfig = Dotenv.config();
if (dotenvConfig.error) console.log(dotenvConfig.error);
// console.log(process.env);


// Load ripple-lib API
const RippleAPI = require("ripple-lib").RippleAPI;

// Connect to Server
const api = new RippleAPI({
  server: process.env.XRPL_SERVER
});

// Make connection and show account information
// api.connect().then(() => {
//   return api.getAccountInfo(process.env.XRPL_ADDRESS);
// }).then((response) => {
//   console.log(response);
// }).then(() => {
//   api.disconnect();
// }).catch(console.error);


// Make Connection for transaction
api.connect();

// Handle Errors
api.on("error", (errorCode, errorMessage, data) => {
  console.error(`${errorCode} : ${errorMessage}`);
});

// Once connected prepare the transaction
api.on("connected", async () => {
  const preparedTx = await api.prepareTransaction({
    "TransactionType": "PaymentChannelClaim",
    "Account": process.env.XRPL_ADDRESS,
    "Amount": api.xrpToDrops("20"),  // Same as Amount: 20000000
    "Channel": "89ABEAD9FB97EF28C3CAA83FE8AD2E1E187053A2B654108CC54BBC827B0C5FC5",
    "Flags": 2147614720,
  }, {
    // Expire the transaction if it doesn't happen in ~5 mins
    "maxLedgerVersionOffset": 75
  });
  
  // Show the preparation results
  const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion;
  console.log("Prepare Transaction Instructions:", preparedTx.txJSON);
  console.log("Transaction Cost:", preparedTx.instructions.fee, "XRP");
  console.log("Transaction expires after ledger:", maxLedgerVersion);

  // Sign the Transaction
  const signedTx = api.sign(preparedTx.txJSON, process.env.XRPL_SECRET);
  
  // Show the signing results
  const txID = signedTx.id;
  const txBlob = signedTx.signedTransaction;
  console.log("Identifying Hash:", txID);
  console.log("Signed Blob:", txBlob);

  // Get the latest ledger version for processing (next ledger version)
  const earliestLedgerVersion = (await api.getLedgerVersion()) + 1;
  console.log("Earliest Ledger Version:", earliestLedgerVersion);

  // Submit the transaction to the Ledger
  const result = await api.submit(txBlob);
  console.log("Tentative Result Code:", result.resultCode);
  console.log("Tentative Result Message:", result.resultMessage);

  // Wait for Validation
  let hasFinalStatus = false;
  api.request("subscribe", {accounts: [process.env.XRPL_ADDRESS]});
  api.connection.on("transaction", (event) => {
    if (event.transaction.hash === txID) {
      // Show the event results
      console.log("Transaction has executed!", event);
      hasFinalStatus = true;
    }
  });
  api.on("ledger", (ledger) => {
    if (ledger.ledgerVersion > maxLedgerVersion && !hasFinalStatus) {
      // If maxLedgerVersion is passed advise about transaction expiry
      console.log("Ledger Version", ledger.ledgerVersion, "was validated.");
      console.log("If the transaction has not succeeded by now, it's expired!");
      hasFinalStatus = true;
    }
  });

  // Wait until hasFinalStatus
  while (!hasFinalStatus) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Check transaction results
  try {
    // Get copy of the transaction
    const tx = await api.getTransaction(txID, {
      minLedgerVersion: earliestLedgerVersion
    });

    // Show the transaction results
    console.log("Transaction result:", tx.outcome.result);
    console.log("Balance changes:", JSON.stringify(tx.outcome.balanceChanges));
  } catch (error) {
    console.log("Could not get transaction outcome:", error);
  }

  // End connection
  if (hasFinalStatus) {
    api.disconnect();
    console.log("Done & Disconnected.");
  }
});
