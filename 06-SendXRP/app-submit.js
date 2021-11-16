"use strict";

// Script 06 - Sending XRP - submit version
/* NOTE this version uses the submit() method to submit a transaction so requires additional steps to wait for validation */

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
    // Make connection for transaction
    await client.connect();
  
    // Once connected prepare the transaction  
    console.log("\n[Working] Transaction Being Prepared...");
    const preparedTx = await client.autofill({
      "TransactionType": "Payment",
      "Account": wallet.classicAddress,
      "Amount": xrpl.xrpToDrops("20"),  // Same as Amount: 20000000
      "Destination": "rhacBEhAdTBeuwcXe5ArVnX8Kwh886poSo"
    });

    // Hard-code wait to test check below
    // preparedTx.LastLedgerSequence = 22772696;

    // Show the preparation results
    const maxLedgerVersion = preparedTx.LastLedgerSequence;
    console.log("Prepared transaction instructions:", preparedTx);
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
    const tx = await client.submit(txBlob);
    
    // Show the TENTATIVE submission results
    console.log(tx);
    console.log("Tentative Result:", tx.result.engine_result);
    console.log("Tentative Result Message:", tx.result.engine_result_message);
    
    // Subscribe to Transaction and Ledger
    console.log(`\n[Working] Subscribing...`);
    let hasFinalStatus = false;
    await client.request({
      "command": "subscribe",
      "accounts": [process.env.XRPL_ADDRESS],
      "streams": ["ledger"]
    });

    // Wait for Validation
    console.log(`\n[Working] Awaiting Transaction Result...`);
    client.connection.on("transaction", (event) => {
      if (event.transaction.hash === txHash) {
        // Show the event results
        console.log("Transaction has executed!");
        hasFinalStatus = true;
      }
    });

    // Check if maxLedgerVersion has already passed
    client.on("ledgerClosed", (ledger) => {
      // console.log(ledger);
      if (ledger.ledger_index > maxLedgerVersion && !hasFinalStatus) {
        // If maxLedgerVersion is passed advise about transaction expiry
        console.log("Ledger Version", ledger.ledger_index, "was validated.");
        console.log("If the transaction has not succeeded by now, it's expired!");
        hasFinalStatus = true;
      }
    });

    // Wait until hasFinalStatus is true
    while (!hasFinalStatus) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Get copy of the transaction
    console.log(`\n[Working] Getting Completed Transaction...`);
    const txCompleted = await client.request({
      "command": "tx",
      "transaction": txHash,
      "min_ledger": earliestLedgerVersion
    });
  
    // Show the transaction results
    // console.log(txCompleted);
    console.log("Transaction hash:", txCompleted.result.hash);
    console.log("Transaction result:", txCompleted.result.meta.TransactionResult);
    console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(txCompleted.result.meta), null, 2));

  } catch (error) {
    console.error(`[Error]: ${error}`);
  }

  // Disconnect from server
  client.disconnect();
}

// Call above function
main();
