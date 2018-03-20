// Allows us to use ES6 in our migrations and tests.
require('babel-register')

var bip39 = require("bip39");
var hdkey = require('ethereumjs-wallet/hdkey');
var ProviderEngine = require("web3-provider-engine");
var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
var Web3 = require("web3");
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');

var mnemonic = ""
console.log("Store this 12 word mnemonic for future use: " + mnemonic);
var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

var wallet_hdpath = "m/44'/60'/0'/0/";
var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();
var address = "0x" + wallet.getAddress().toString("hex");

var providerUrl = "https://ropsten.infura.io";
var engine = new ProviderEngine();
// filters
engine.addProvider(new FilterSubprovider());

engine.addProvider(new WalletSubprovider(wallet, {}));
engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
engine.start(); // Required by the provider engine.

console.log(address);
module.exports = {
  networks: {
    "ropsten": {
      network_id: 3,    // Official ropsten network id
      provider: engine, // Use our custom provider
      from: address, // Use the address we derived
      gas: 4600000
    },
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 6600000
    }
  },
  rpc: {
    // Use the default host and port when not using ropsten
    host: "localhost",
    port: 8545
  }
};

