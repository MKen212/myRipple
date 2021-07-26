/* global ripple */
"use strict";

// Script 01 - Getting Ledger Information from Mainnet and Testnet

const mainnet = new ripple.RippleAPI({
  server: "wss://s1.ripple.com"
  // server: "ws://localhost:6006"
});

// Get Ledger Info from Mainnet
(async function(api) {
  await api.connect();

  let response = await api.getLedger({
    includeTransactions: true
  });
  console.log(response);

  // Convert Total Drops to XRP
  console.log("Total XRP: " + api.dropsToXrp(response.totalDrops));

})(mainnet);


const testnet = new ripple.RippleAPI({
  server: "wss://s.altnet.rippletest.net/"
});

// Get Ledger Info from Testnet
(async function(api) {
  await api.connect();
  let response = await api.getLedger({
    includeTransactions: true
  });
  console.log(response);
})(testnet);


// Get Transaction Info
(async function(api) {
  await api.connect();
  let response = await api.getTransaction("01AAEF23D5190D2413843CADD489AAB9C85D08D56D8A27CD7837291F96955D8A"
  );
  console.log(response);
})(mainnet);