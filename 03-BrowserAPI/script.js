/* global ripple */
"use strict";

// Script 03 - Browser API

// console.log(ripple);

const api = new ripple.RippleAPI({
  server: "wss://s1.ripple.com"  // mainnet Public Server
  // server: "ws://localhost:6006"  // mainnet Local Server
  // server: "wss://s.altnet.rippletest.net/"  // testnet Public Server
});

api.connect().then(() => {
  return api.getServerInfo();
}).then((serverInfo) => {
  // Show Server Info
  const htmlContent = `
  <p>Connected to rippled server!</p>
  <table>
    <tr><th>Version</th><td>${serverInfo.buildVersion}</td></tr>
    <tr><th>Ledgers Available</th><td>${serverInfo.completeLedgers}</td></tr>
    <tr><th>Host ID</th><td>${serverInfo.hostID}</td></tr>
    <tr><th>Most Recent Validate Seq</th><td>${serverInfo.validatedLedger.ledgerVersion}</td></tr>
    <tr><th>Most Recent Validate Hash</th><td>${serverInfo.validatedLedger.hash}</td></tr>
    <tr><th>Seconds since last validation</th><td>${serverInfo.validatedLedger.age}</td></tr>
  </table>
  `;
  const content = document.getElementById("content");
  content.innerHTML = htmlContent;
}).then(() => {
  return api.disconnect();
}).catch(console.error);
