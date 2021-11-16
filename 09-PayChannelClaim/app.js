"use strict";

// Script 09 - Payment Channel Claim

// Load Env Variables
const Dotenv = require("dotenv");
const dotenvConfig = Dotenv.config();
if (dotenvConfig.error) console.log(dotenvConfig.error);
// console.log(process.env);


// Load xrpl.js API
const xrpl = require("xrpl");

// Create a wallet from an existing SEED
console.log("[Working] Getting Wallet...");
const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_SEED);
console.log(`[Wallet] Created for ${wallet.address}`);

// Function to Connect to Server & Process a request/transaction
async function main() {
  const client = new xrpl.Client(process.env.XRPL_SERVER);

  // Handle Connection
  client.on("connected", ()=> {
    console.log(`[Connected] to TestNet.`);
  });

  // Handle Disconnection
  client.on("disconnected", ()=> {
    console.log(`\n[Disconnected] from TestNet.`);
  });

  try {
    // Make Connection for transaction
    await client.connect();

    // Once connected prepare the transaction
    console.log("\n[Working] Transaction Being Prepared...");
    const preparedTx = await client.autofill({
      "TransactionType": "PaymentChannelClaim",
      "Account": wallet.classicAddress,
      "Amount": xrpl.xrpToDrops("50"),  // Same as Amount: 20000000
      "Channel": "909FBF4D7CEC8E8727DD58D57542BB0626E160AE47515B745C11ED1DA72C8054",
      "Flags": 2147614720
    });
    
    // Show the preparation results
    const maxLedgerVersion = preparedTx.LastLedgerSequence;
    console.log("Prepare Transaction Instructions:", preparedTx);
    console.log("Transaction Cost:", xrpl.dropsToXrp(preparedTx.Fee), "XRP");
    console.log("Transaction expires after ledger:", maxLedgerVersion);

    // Sign the Transaction
    console.log(`\n[Working] Transaction Being Signed...`);
    const signedTx = wallet.sign(preparedTx);

    // Show the signing results
    const txHash = signedTx.hash;
    const txBlob = signedTx.tx_blob;
    console.log("Identifying Hash:", txHash);
    console.log("Signed Blob:", txBlob);

    
    // Get the latest ledger version for processing (next ledger version)
    const earliestLedgerVersion = (await client.getLedgerIndex()) + 1;
    console.log("Earliest Ledger Version:", earliestLedgerVersion);

    
    // Submit the transaction to the Ledger
    console.log(`\n[Working] Transaction Submitted...`);
    const tx = await client.submitAndWait(txBlob);
    
    // Show the submission results
    console.log(tx);
    if (tx.result.meta.TransactionResult === "tesSUCCESS") {
      console.log("Transaction SUCCEEDED:", tx.result.meta.TransactionResult);
    } else {
      console.log("Transaction FAILED:", tx.result.meta.TransactionResult);
    }
    console.log("Balance Changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2));

  } catch (error) {
    console.error(`[Error]: ${error}`);
  }

  // Disconnect from server
  client.disconnect();
}

// Call above function
main();
