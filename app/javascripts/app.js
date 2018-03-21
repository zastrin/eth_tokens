// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import crowdsale_artifacts from '../../build/contracts/Crowdsale.json'
import erc20token_artifacts from '../../build/contracts/ERC20Token.json'

var Crowdsale = contract(crowdsale_artifacts);
var ERC20Token = contract(erc20token_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    Crowdsale.setProvider(web3.currentProvider);
    ERC20Token.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
    });
  },

  refreshBalance: function() {
    var balance = 0;
    ERC20Token.deployed().then(function(instance) {
      instance.balanceOf.call(account).then(function(i) {
        instance.symbol.call().then(function(sym) {
          $("#balance").html(i.toString() + " " + sym);
        });
        instance.owner.call().then(function(owner) {
          $("#token_owner").html("Token owner is " + owner);
        });
      });
    });
    Crowdsale.deployed().then(function(instance) {
      $("#crowdsale_address").html("Crowdsale address is " + instance.address);
    });
  },

  buyTokens: function() {
    var self = this;

    var amount = parseFloat(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    $("#status").html("Initiating transaction... (please wait)");

    console.log(amount);

    var meta;
    Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.buyTokens(receiver, {from: account, value: web3.toWei(amount, 'ether')});
    }).then(function() {
      $("#status").html("Transaction is complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      $("#status").html("Error sending coin; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
