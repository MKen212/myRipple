"use strict";

// Script 07 - Monitor Incoming Payments

// Connect to Testnet via WebSocket
const socket = new WebSocket("wss://s.altnet.rippletest.net/");

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

// Setup Array to hold awaiting messages
const AWAITING = {};

// Handle responses received to WebSocket messages sent
const handleResponse = function(data) {
  // Check the response includes an ID
  if(!Object.prototype.hasOwnProperty.call(data, "id")) {
    console.error("Response received without ID: ", data);
    return;
  }
  // Check if waiting for response ID
  if (Object.prototype.hasOwnProperty.call(AWAITING, data.id)) {
    // Run 
    AWAITING[data.id].resolve(data);
  } else {
    console.warn(`Response to un-awaited request with ID: ${data.id}`);
  }
};

let autoID = 0;  // ID number
// Function to load WebSocket Request into a Promise
function apiRequest(message) {
  if (!Object.prototype.hasOwnProperty.call(message, "id")) {
    message.id = `autoID_${autoID++}`;
  }
  
  let resolveHolder;
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
  console.log(`${tx.transaction.TransactionType} transaction sent by ${tx.transaction.Account} / Result: ${tx.meta.TransactionResult} in ledger ${tx.ledger_index} / Transaction validated?: ${tx.validated}`);
};

// Setup Array to hold WebSocket Handlers
const WS_HANDLERS = {
  "response": handleResponse,
  "transaction": logTx
  // Fill this out with your handlers in the following format:
  // "type": function(event) { /* handle event of this type */ }
};


// Demonstrate API Functionality
async function pingpong() {
  console.log("Ping...");
  const response = await apiRequest({command: "ping"});
  console.log("Pong...", response);
}

// Demonstrate Account Info
async function accInfo() {
  console.log("Get Acc Info...");
  const request = {
    "command": "account_info",
    "account": "rww9WLeWwviNvAJV3QeRCof3kJLomPnaNw",
    "strict": true,
    "ledger_index": "current",
    "queue": true
  };
  const response = await apiRequest(request);
  console.log("Received Acc Info...", response);
}

// Demonstrate subscription to account transactions
async function doSubscribe() {
  const subResponse = await apiRequest({
    "command": "subscribe",
    "accounts": ["rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"]
  });
  if (subResponse.status === "success") {
    console.log("Successfully Subscribed!");
  } else {
    console.error("Error Subscribing: ", subResponse);
  }
}


socket.addEventListener("message", (event) => {
  // console.log(event);
  const parsedData = JSON.parse(event.data);
  if(Object.prototype.hasOwnProperty.call(WS_HANDLERS, parsedData.type)) {
    // Call the mapped handler
    WS_HANDLERS[parsedData.type](parsedData);
  } else {
    console.log("Unhandled message from Server:", event);
  }
});

socket.addEventListener("open", (event) => {
  console.log("Connected!");
  pingpong();
  accInfo();
  doSubscribe();
});

