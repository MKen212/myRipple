"use strict";

// Script 04 - WebSocket API

// Get HTML elements
const content = document.getElementById("content");

// Websocket Message to send
const message = {
  "id": 2,
  "command": "account_info",
  "account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
  "strict": true,
  "ledger_index": "current",
  "queue": true
};

// Mainnet Account: rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn
// Testnet Account: rww9WLeWwviNvAJV3QeRCof3kJLomPnaNw

// Response Objects
let responseObjectM = [];
let responseObjectL = [];

// Connect to Mainnet
const socketM = new WebSocket("wss://s2.ripple.com");

socketM.onopen = function(event) {
  console.log("[open] Connection established to Mainnet");
  console.log("Sending to Mainnet server");
  socketM.send(JSON.stringify(message));
};

socketM.onmessage = function(event) {
  responseObjectM = JSON.parse(event.data);
  console.log("[message] Data received from Mainnet server:");
  console.log(responseObjectM);
  showContent("MAINNET", responseObjectM);
};

socketM.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[close] Mainnet connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log('[close] Mainnet connection died');
  }
};

socketM.onerror = function(error) {
  console.error(`[error] Mainnet: ${error.message}`);
  content.innerHTML += "<p>Connection to MAINNET failed!</p>";
};


// Connect to Localnet
const socketL = new WebSocket("ws://localhost:6006");

socketL.onopen = function(event) {
  console.log("[open] Connection established to Localnet");
  console.log("Sending to Localnet server");
  socketL.send(JSON.stringify(message));
};

socketL.onmessage = function(event) {
  responseObjectL = JSON.parse(event.data);
  console.log("[message] Data received from Localnet server:");
  console.log(responseObjectL);
  showContent("LOCALNET", responseObjectL);
};

socketL.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[close] Localnet connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log('[close] Localnet connection died');
  }
};

socketL.onerror = function(error) {
  console.error(`[error] Localnet: ${error.message}`);
  content.innerHTML += "<p>Connection to LOCALNET failed!</p>";
};


// Function to show content in HTML form
function showContent(type, response) {
  const htmlContent =`
  <p>Connected to rippled ${type} server!</p>
  <table>
    <tr><th>Account</th><td>${response.result.account_data.Account}</td></tr>
    <tr><th>Balance</th><td>${response.result.account_data.Balance}</td></tr>
    <tr><th>Previous Txn ID</th><td>${response.result.account_data.PreviousTxnID}</td></tr>
  </table>
  <br />
  `;
  content.innerHTML += htmlContent;
}
