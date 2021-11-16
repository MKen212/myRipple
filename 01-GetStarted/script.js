/* global xrpl */
"use strict";

// Script 01 - Getting Ledger Information from Mainnet, Testnet and a local server (if exists)

const mainnet = new xrpl.Client("wss://xrplcluster.com/");
const testnet = new xrpl.Client("wss://s.altnet.rippletest.net/");
const localnet = new xrpl.Client("ws://localhost:6006");

const RIPPLE_EPOCH = 946684800;  // Ripple Epoch Timestamp in seconds


// Get Ledger Info from Mainnet
(async function(api) {
  let resultsHTML = "<h3>Mainnet</h3>";

  try {
    await api.connect();

    let response = await api.request({
      "id": "main-01",
      "command": "ledger",
      "ledger_index": "validated",
      "transactions": true
    });
    console.log(response);

    // Update Ledger Parent Close Time
    const parentClose = fixDate(new Date((RIPPLE_EPOCH + response.result.ledger.parent_close_time) * 1000));

    // Get Transaction Data
    const transaction = "529180790DB779A19976BD0E4D1428489F5495B522D8D0345AF88DBCF21AF1F9";

    let transData = await api.request({
      "id": "main-02",
      "command": "tx",
      "transaction": transaction
    });
    console.log(transData);

    resultsHTML += `
      <p>Ledger Version: ${response.result.ledger_index}</p>
      <p>Parent Close Time: ${response.result.ledger.parent_close_time} > ${parentClose}</p>
      <p>Total XRP: ${xrpl.dropsToXrp(response.result.ledger.total_coins)}</p>
      <p>Transaction #${transaction.substr(transaction.length - 6)}: ${xrpl.dropsToXrp(transData.result.meta.delivered_amount)} XRP</p>
    `;

  } catch (error) {
    console.error(error); 
    resultsHTML += `
      <p>Error - ${error.message} See Console for more details.</p>
    `;
  }
  
  displayResults(resultsHTML);  
})(mainnet);


// Get Ledger Info from Testnet
(async function(api) {
  let resultsHTML = "<h3>Testnet</h3>";

  try {
    await api.connect();

    let response = await api.request({
      "id": "test-01",
      "command": "ledger",
      "ledger_index": "validated",
      "transactions": true
    });
    console.log(response);

    // Update Ledger Parent Close Time
    const parentClose = fixDate(new Date((RIPPLE_EPOCH + response.result.ledger.parent_close_time) * 1000));

    // Get Transaction Data
    const transaction = "A498E2BDF6DB5558798706B15FB238736E1D1817FF992C6C8F7C97589049B3EA";

    let transData = await api.request({
      "id": "test-02",
      "command": "tx",
      "transaction": transaction
    });
    console.log(transData);

    resultsHTML += `
      <p>Ledger Version: ${response.result.ledger_index}</p>
      <p>Parent Close Time: ${response.result.ledger.parent_close_time} > ${parentClose}</p>
      <p>Total XRP: ${xrpl.dropsToXrp(response.result.ledger.total_coins)}</p>
      <p>Transaction #${transaction.substr(transaction.length - 6)}: ${xrpl.dropsToXrp(transData.result.meta.delivered_amount)} XRP</p>
    `;

  } catch (error) {
    console.error(error); 
    resultsHTML += `
      <p>Error - ${error.message} See Console for more details.</p>
    `;
  }
  
  displayResults(resultsHTML);  
})(testnet);


// Get Ledger Info from Localnet
(async function(api) {
  let resultsHTML = "<h3>Localnet</h3>";

  try {
    await api.connect();

    let response = await api.request({
      "id": "local-01",
      "command": "ledger",
      "ledger_index": "validated",
      "transactions": true
    });
    console.log(response);

    // Update Ledger Parent Close Time
    const parentClose = fixDate(new Date((RIPPLE_EPOCH + response.result.ledger.parent_close_time) * 1000));

    // Get Transaction Data
    /* NOTE: Transaction must be available on Localnet */
    const transaction = "529180790DB779A19976BD0E4D1428489F5495B522D8D0345AF88DBCF21AF1F9";

    let transData = await api.request({
      "id": "local-02",
      "command": "tx",
      "transaction": transaction
    });
    console.log(transData);
    
    resultsHTML += `
      <p>Ledger Version: ${response.result.ledger_index}</p>
      <p>Parent Close Time: ${response.result.ledger.parent_close_time} > ${parentClose}</p>
      <p>Total XRP: ${xrpl.dropsToXrp(response.result.ledger.total_coins)}</p>
      <p>Transaction #${transaction.substr(transaction.length - 6)}: ${xrpl.dropsToXrp(transData.result.meta.delivered_amount)} XRP</p>
    `;

  } catch (error) {
    console.error(error); 
    resultsHTML += `
      <p>Error - ${error.message} See Console for more details.</p>
    `;
  }
  
  displayResults(resultsHTML);  
})(localnet);


// Function to display results
function displayResults(resultsHTML) {
  const results = document.getElementById("results");
  const newContent = document.createElement("div");
  resultsHTML += `<hr />`;
  newContent.innerHTML = resultsHTML;
  results.appendChild(newContent);
}

// Function to fix the output date format
function fixDate(date) {
  return ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
}
