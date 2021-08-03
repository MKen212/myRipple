/* global Big */
"use strict";

// Script 07 - Monitor Incoming Payments

// Connect to Testnet via WebSocket
const socket = new WebSocket("wss://s.altnet.rippletest.net/");
// const socket = new WebSocket("ws://localhost:6006/");


// Replaced with new "open" listener below
// Add "open" event listener
// socket.addEventListener("open", (event) => {
//   console.log("Connected!");
//   const command = {
//     "id": "on_open_ping_1",
//     "command" : "ping"
//   };
//   socket.send(JSON.stringify(command));
// });

// Replaced with new "message" listener below
// Add "message" event listener
// socket.addEventListener("message", (event) => {
//   console.log("Received message from server:", event.data);
// });

// Add "close" event listener
socket.addEventListener("close", (event) => {
  console.log("Disconnected...");
});

// Setup Object to hold awaiting messages
const AWAITING = {};

// Function expression to handle responses received
const handleResponse = function(data) {
  // Check the response includes an ID
  if(!Object.prototype.hasOwnProperty.call(data, "id")) {
    console.error("Response received without ID: ", data);
    return;
  }
  // Check if waiting for response ID
  if (Object.prototype.hasOwnProperty.call(AWAITING, data.id)) {
    // Run resolve promise
    AWAITING[data.id].resolve(data);
  } else {
    console.warn(`Response to un-awaited request with ID: ${data.id}`);
  }
};

let autoID = 0;  // ID number
// Function to load WebSocket Request into a Promise
function apiRequest(message) {
  // If no ID in message then add one
  if (!Object.prototype.hasOwnProperty.call(message, "id")) {
    message.id = `autoID_${autoID++}`;
  }
  
  let resolveHolder;
  // Create Promise
  AWAITING[message.id] = new Promise((resolve, reject) => {
    resolveHolder = resolve;
    try {
      socket.send(JSON.stringify(message));
    } catch (error) {
      reject(error);
    }
  });

  AWAITING[message.id].resolve = resolveHolder;
  console.log(AWAITING);
  return AWAITING[message.id];
}

// Function to log transaction details of a subscribed account
const logTx = function(tx) {
  // console.log(tx);
  // console.log(`${tx.transaction.TransactionType} transaction for A/C: ${tx.transaction.Account} / Result: ${tx.meta.TransactionResult} in ledger ${tx.ledger_index} / Transaction validated?: ${tx.validated}`);
  countXRPReceived(tx, "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe");
};

// Setup Object to hold WebSocket Handlers
const WS_HANDLERS = {
  "response": handleResponse,
  "transaction": logTx
  // Fill this out with your handlers in the following format:
  // "type": function(event) { /* handle event of this type */ }
};


// Demonstrate API Functionality
async function pingPong() {
  console.log("Ping...");
  const message = {
    command: "ping"
  };
  const response = await apiRequest(message);
  console.log("Pong...", response);
}

// Demonstrate Account Info
async function accInfo() {
  console.log("Get Acc Info...");
  const message = {
    "command": "account_info",
    "account": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    "strict": true,
    "ledger_index": "current",
    "queue": true
  };
  const response = await apiRequest(message);
  console.log("Received Acc Info...", response);
}

// Demonstrate subscription to account transactions
async function doSubscribe() {
  const subMessage = {
    "command": "subscribe",
    "accounts": ["rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"]
  };
  const subResponse = await apiRequest(subMessage);
  if (subResponse.status === "success") {
    console.log("Successfully Subscribed!");
  } else {
    console.error("Error Subscribing: ", subResponse);
  }
}


// Functions to report extended differences based on the returned transaction message for the subscribed channel
function countXRPDifference(affectedNodes, address) {
  // console.log(affectedNodes, address);
  /*
  Helper to find an account in an AffectedNodes array and see how much its balance changed, if at all. Fortunately, each account appears at most once in the AffectedNodes array, so we can return as soon as we find it.

  Note: this reports the net balance change. If the address is the sender, the transaction cost is deducted and combined with XRP sent/received
  */

  // Loop through affectedNodes
  for (let i = 0; i < affectedNodes.length; i++) {
    // Check if the transaction modifies an existing ledger entry
    if (Object.prototype.hasOwnProperty.call(affectedNodes[i], "ModifiedNode")) {
      const ledgerEntry = affectedNodes[i].ModifiedNode;
      // Check the ledger entry updates the selected address
      if (ledgerEntry.LedgerEntryType === "AccountRoot" && ledgerEntry.FinalFields.Account === address) {
        // Check PreviousFields.Balance exists as if not then balance did not change
        if (!Object.prototype.hasOwnProperty.call(ledgerEntry.PreviousFields, "Balance")) {
          console.log("XRP Balance did not change!");
        }
        // Balance did change so calculate difference
        const oldBalance = new Big(ledgerEntry.PreviousFields.Balance);
        const newBalance = new Big(ledgerEntry.FinalFields.Balance);
        const diffInDrops = newBalance.minus(oldBalance);
        const diffInXRP = diffInDrops.div(1e6);
        if (diffInXRP.gte(0)) {
          console.log(`Received: ${diffInXRP.toString()} XRP`);
        } else {
          console.log(`Sent: ${diffInXRP.abs().toString()} XRP`);
        }
        return;
      }
    } else if (Object.prototype.hasOwnProperty.call(affectedNodes[i], "CreatedNode")) {
      // Created a ledger entry, so maybe the account just got funded
      const ledgerEntry = affectedNodes[i].CreatedNode;
      // Check the ledger entry updates the selected address
      if (ledgerEntry.LedgerEntryType === "AccountRoot" && ledgerEntry.NewFields.Account === address) {
        const newBalance = new Big(ledgerEntry.NewFields.Balance);
        const diffInXRP = newBalance.div(1e6);
        console.log(`Received: ${diffInXRP.toString()} XRP`);
        return;
      }
    }
  }

  // Catch if address not found in any affected nodes
  console.log("Did not find address in affected nodes");
  return;
}

// Function to show what is received
function countXRPReceived(tx, address) {
  // Check transaction was processed successfully
  if (tx.meta.TransactionResult !== "tesSUCCESS") {
    console.log("Transaction Failed!");
    return;
  }
  if (tx.transaction.TransactionType === "Payment") {
    // Process a payment transaction
    if (tx.transaction.Destination !== address) {
      // Check our address is the payment destination
      console.log("Chosen Address is not the payment destination!");
      return;
    }
    // Check XRP amount was actually delivered
    if (typeof tx.meta.delivered_amount === "string") {
      const amountInDrops = new Big(tx.meta.delivered_amount);
      const amountInXRP = amountInDrops.div(1e6);
      console.log(`Received: ${amountInXRP.toString()} XRP`);
    } else {
      console.log(`Received non-XRP Currency`);
    }
    return;
  } else if (tx.transaction.TransactionType.includes(["PaymentChannelClaim", "PaymentChannelFund", "OfferCreate", "CheckCash", "EscrowFinish"])) {
    countXRPDifference(tx.meta.AffectedNodes, address);
  } else {
    console.log(`Not a currency-delivering transaction type: ${tx.transaction.TransactionType}`);
  }
}

socket.addEventListener("message", (event) => {
  // console.log(event);
  const parsedData = JSON.parse(event.data);
  // Check WS_HANDLERS has a method to process specific type
  if(Object.prototype.hasOwnProperty.call(WS_HANDLERS, parsedData.type)) {
    // Call the mapped handler
    WS_HANDLERS[parsedData.type](parsedData);
  } else {
    console.log("Unhandled message from Server:", event);
  }
});

socket.addEventListener("open", (event) => {
  console.log("Connected!");
  pingPong();
  accInfo();
  doSubscribe();
});

