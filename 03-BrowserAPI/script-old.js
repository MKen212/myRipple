/* global xrpl */
"use strict";

// Script 03 - OLD - Browser API
// NOTE - This version uses .then() and .catch() callbacks

// console.log(xrpl);

// Get HTML elements
const content = document.getElementById("content");


// Get Mainnet Data
const apiMainnet = new xrpl.Client("wss://s1.ripple.com");
apiMainnet.connect().then(() => {
  return apiMainnet.request({
    "id": "main02",
    "command": "server_info"
  });
}).then((serverInfo) => {
  // Show Server Info
  console.log(serverInfo);
  showContent("MAINNET", serverInfo);
}).then(() => {
  return apiMainnet.disconnect();
}).catch((error) => {
  console.error(error);
  content.innerHTML += "<p>Connection to MAINNET failed!</p>";
});


// Get Localnet Data
const apiLocalnet = new xrpl.Client("ws://localhost:6006");
apiLocalnet.connect().then(() => {
  return apiLocalnet.request({
    "id": "local02",
    "command": "server_info"
  });
}).then((serverInfo) => {
  // Show Server Info
  console.log(serverInfo);
  showContent("LOCALNET", serverInfo);
}).then(() => {
  return apiLocalnet.disconnect();
}).catch((error) => {
  console.error(error);
  content.innerHTML += "<p>Connection to LOCALNET failed!</p>";
});

// Get Testnet Data
const apiTestnet = new xrpl.Client("wss://s.altnet.rippletest.net/");
apiTestnet.connect().then(() => {
  return apiTestnet.request({
    "id": "test02",
    "command": "server_info"
  });
}).then((serverInfo) => {
  // Show Server Info
  console.log(serverInfo);
  showContent("TESTNET", serverInfo);
}).then(() => {
  return apiTestnet.disconnect();
}).catch((error) => {
  console.error(error);
  content.innerHTML += "<p>Connection to TESTNET failed!</p>";
});


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
