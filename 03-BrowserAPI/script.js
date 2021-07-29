/* global ripple */
"use strict";

// Script 03 - Browser API

// console.log(ripple);

// Get HTML elements
const content = document.getElementById("content");

// Get Mainnet Data
const apiMainnet = new ripple.RippleAPI({
  server: "wss://s1.ripple.com"  // mainnet Public Server
});

apiMainnet.connect().then(() => {
  return apiMainnet.getServerInfo();
}).then((serverInfo) => {
  // Show Server Info
  showContent("MAINNET", serverInfo);
}).then(() => {
  return apiMainnet.disconnect();
}).catch((error) => {
  console.error(error);
  content.innerHTML += "<p>Connection to MAINNET failed!</p>";
});


const apiLocalnet = new ripple.RippleAPI({
  server: "ws://localhost:6006"  // mainnet Local Server
});
apiLocalnet.connect().then(() => {
  return apiLocalnet.getServerInfo();
}).then((serverInfo) => {
  // Show Server Info
  showContent("LOCALNET", serverInfo);
}).then(() => {
  return apiLocalnet.disconnect();
}).catch((error) => {
  console.error(error);
  content.innerHTML += "<p>Connection to LOCALNET failed!</p>";
});

const apiTestnet = new ripple.RippleAPI({
  server: "wss://s.altnet.rippletest.net/"  // testnet Public Server
});

apiTestnet.connect().then(() => {
  return apiTestnet.getServerInfo();
}).then((serverInfo) => {
  // Show Server Info
  showContent("TESTNET", serverInfo);
}).then(() => {
  return apiTestnet.disconnect();
}).catch((error) => {
  console.error(error);
  content.innerHTML += "<p>Connection to TESTNET failed!</p>";
});

// Function to show content in HTML form
function showContent(type, serverInfo) {
  const htmlContent =`
  <p>Connected to rippled ${type} server!</p>
  <table>
    <tr><th>Version</th><td>${serverInfo.buildVersion}</td></tr>
    <tr><th>Ledgers Available</th><td>${serverInfo.completeLedgers}</td></tr>
    <tr><th>Host ID</th><td>${serverInfo.hostID}</td></tr>
    <tr><th>Most Recent Validate Seq</th><td>${serverInfo.validatedLedger.ledgerVersion}</td></tr>
    <tr><th>Most Recent Validate Hash</th><td>${serverInfo.validatedLedger.hash}</td></tr>
    <tr><th>Seconds since last validation</th><td>${serverInfo.validatedLedger.age}</td></tr>
  </table>
  <br />
  `;
  content.innerHTML += htmlContent;
}
