/* global ripple */
"use strict";

// Script 01 - Getting Ledger Information from Mainnet, Testnet and a local server (if exists)

const mainnet = new ripple.RippleAPI({
  server: "wss://s2.ripple.com/"
});

const testnet = new ripple.RippleAPI({
  server: "wss://s.altnet.rippletest.net/"
});

const localnet = new ripple.RippleAPI({
  server: "ws://localhost:6006"
});

// const transaction = "01AAEF23D5190D2413843CADD489AAB9C85D08D56D8A27CD7837291F96955D8A"
// ;
// const transaction = "3907E408483C39C9D576737CB13C36BD8DC8F556BE0C0F422D036021C72236C6"
// ;

// NOTE: Transaction must be available on Localnet
const transaction = "359D054D4055BB30AD82FBB6AD6228D9E6DEDDE61E9BE7E52846FB27C76DAE29";


// Get Ledger Info from Mainnet
(async function(api) {
  let resultsHTML = "<h3>Mainnet</h3>";

  try {
    await api.connect();

    let response = await api.getLedger({
      includeTransactions: true
    });
    console.log(response);

    // Get Transaction Data
    let transData = await api.getTransaction(transaction);
    console.log(transData);

    resultsHTML += `
      <p>Ledger Version: ${response.ledgerVersion}</p>
      <p>Parent Close Time: ${response.parentCloseTime}</p>
      <p>Total XRP: ${api.dropsToXrp(response.totalDrops)}</p>
      <p>Transaction #${transaction.substr(transaction.length - 4)}: ${transData.outcome.deliveredAmount.value} XRP</p>
    `;
  } catch (error) {
    resultsHTML += `
      <p>Error - No connection to Server!</p>
    `;
  }
  
  displayResults(resultsHTML);  
})(mainnet);

// Get Ledger Info from Localnet
(async function(api) {
  let resultsHTML = "<h3>Localnet</h3>";

  try {
    await api.connect();

    let response = await api.getLedger({
      includeTransactions: true
    });
    console.log(response);

    // Get Transaction Data
    let transData = await api.getTransaction(transaction);
    console.log(transData);

    resultsHTML += `
      <p>Ledger Version: ${response.ledgerVersion}</p>
      <p>Parent Close Time: ${response.parentCloseTime}</p>
      <p>Total XRP: ${api.dropsToXrp(response.totalDrops)}</p>
      <p>Transaction #${transaction.substr(transaction.length - 4)}: ${transData.outcome.deliveredAmount.value} XRP</p>
    `;
  } catch (error) {
    resultsHTML += `
      <p>Error - No connection to Server!</p>
    `;
  }
  
  displayResults(resultsHTML);  
})(localnet);


// Get Ledger Info from Testnet
(async function(api) {
  let resultsHTML = "<h3>Testnet</h3>";

  try {
    await api.connect();

    let response = await api.getLedger({
      includeTransactions: true
    });
    console.log(response);

    resultsHTML += `
      <p>Ledger Version: ${response.ledgerVersion}</p>
      <p>Parent Close Time: ${response.parentCloseTime}</p>
      <p>Total XRP: ${api.dropsToXrp(response.totalDrops)}</p>
    `;
  } catch (error) {
    resultsHTML += `
      <p>Error - No connection to Server!</p>
    `;
  }
  
  displayResults(resultsHTML);  
})(testnet);


// Get Transaction Info
// (async function(api) {
//   await api.connect();
//   let response = await api.getTransaction(transaction);
//   console.log(response);
// })(mainnet);


// Function to display results
function displayResults(resultsHTML) {
  const results = document.getElementById("results");
  const newContent = document.createElement("div");
  resultsHTML += `<hr />`;
  newContent.innerHTML = resultsHTML;
  results.appendChild(newContent);
}
