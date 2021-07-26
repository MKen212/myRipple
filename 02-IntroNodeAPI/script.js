"use strict";

// Script 02 - Getting Transaction Information

const RippleAPI = require("ripple-lib").RippleAPI;

const api = new RippleAPI({
  server: "wss://s1.ripple.com"  // mainnet Public Server
  // server: "ws://localhost:6006"  // mainnet Local Server
  // server: "wss://s.altnet.rippletest.net/"  // testnet Public Server
});

api.connect().then(() => {
  const myAddress = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
  console.log(`Getting Account info for: ${myAddress}`);
  return api.getAccountInfo(myAddress);
}).then((info) => {
  console.log(info);
  console.log("getAccountInfo done.");
}).then(() => {
  return api.disconnect();
}).then(() => {
  console.log("Done & disconnected");
}).catch(console.error);
