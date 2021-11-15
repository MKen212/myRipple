/* global xrpl */
"use strict";

// Script 03 - Browser API
// NOTE - This version uses Promises with async/await

// console.log(xrpl);

// Get HTML elements
const content = document.getElementById("content");


// Get Mainnet Data
const apiMainnet = new xrpl.Client("wss://s1.ripple.com");
async function mainFunc() {
  try {
    // Connect
    await apiMainnet.connect();
  
    // Get Server Info
    const response = await apiMainnet.request({
      "id": "main01",
      "command": "server_info"
    });
  
    // Show response
    console.log(response);
    showContent("MAINNET", response);

    // Disconnect
    apiMainnet.disconnect();
  } catch (error) {
    // Display any errors
    console.error(error);
    content.innerHTML += "<p>Connection to MAINNET failed!</p>";
  }
}
mainFunc();

// Get Localnet Data
const apiLocalnet = new xrpl.Client("ws://localhost:6006");
async function localFunc() {
  try {
    // Connect
    await apiLocalnet.connect();
  
    // Get Server Info
    const response = await apiLocalnet.request({
      "id": "local01",
      "command": "server_info"
    });
  
    // Show response
    console.log(response);
    showContent("LOCALNET", response);

    // Disconnect
    apiLocalnet.disconnect();

  } catch (error) {
    // Display any errors
    console.error(error);
    content.innerHTML += "<p>Connection to LOCALNET failed!</p>";
  }
}
localFunc();

// Get Testnet Data
const apiTestnet = new xrpl.Client("wss://s.altnet.rippletest.net/");
async function testFunc() {
  try {
    // Connect
    await apiTestnet.connect();
  
    // Get Server Info
    const response = await apiTestnet.request({
      "id": "test01",
      "command": "server_info"
    });
  
    // Show response
    console.log(response);
    showContent("TESTNET", response);

    // Disconnect
    apiTestnet.disconnect();

  } catch (error) {
    // Display any errors
    console.error(error);
    content.innerHTML += "<p>Connection to TESTNET failed!</p>";
  }
}
testFunc();


// Function to show content in HTML form
function showContent(type, serverInfo) {
  const info = serverInfo.result.info;
  const htmlContent =`
  <p>Connected to rippled ${type} server!</p>
  <table>
    <tr><th>Version</th><td>${info.build_version}</td></tr>
    <tr><th>Ledgers Available</th><td>${info.complete_ledgers}</td></tr>
    <tr><th>Host ID</th><td>${info.hostid}</td></tr>
    <tr><th>Most Recent Validate Seq</th><td>${info.validated_ledger.seq}</td></tr>
    <tr><th>Most Recent Validate Hash</th><td>${info.validated_ledger.hash}</td></tr>
    <tr><th>Seconds since last validation</th><td>${info.validated_ledger.age}</td></tr>
  </table>
  <br />
  `;
  content.innerHTML += htmlContent;
}
