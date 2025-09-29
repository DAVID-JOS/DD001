import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import "./main.html";
import "./main.css";

// ✅ Reactive dict for UI state
import { ReactiveVar } from "meteor/reactive-var";
const walletsState = new ReactiveVar([]);

Template.body.onCreated(function () {
  // Load wallets initially
  Meteor.call("wallets.all", (err, res) => {
    if (!err) walletsState.set(res);
  });

  // Poll wallets every 2s (to see mining updates)
  setInterval(() => {
    Meteor.call("wallets.all", (err, res) => {
      if (!err) walletsState.set(res);
    });
  }, 2000);
});

// ✅ Helpers to show wallets
Template.body.helpers({
  wallets() {
    return walletsState.get();
  },
});

// ✅ Events
Template.body.events({
  // Add new wallet
  "click #addWallet"() {
    const address = document.getElementById("walletAddress").value;
    if (!address) return alert("Enter wallet address!");
    Meteor.call("wallets.insert", address, 0, (err) => {
      if (err) alert("❌ " + err.message);
      else alert("✅ Wallet added");
    });
  },

  // Convert USD → NGN
  "click #convertToNaira"() {
    const usd = parseFloat(document.getElementById("usdAmount").value);
    if (!usd) return alert("Enter USD amount!");
    Meteor.call("exchange.usdToNgn", usd, (err, res) => {
      if (!err) {
        document.getElementById("exchangeResult").innerText =
          `💱 ${usd} USD = ₦${res}`;
      } else {
        alert("❌ " + err.message);
      }
    });
  },

  // Transfer to Moniepoint
  "click #transferBtn"() {
    const acct = document.getElementById("acctNum").value;
    const bank = document.getElementById("bankCode").value;
    const amt = parseFloat(document.getElementById("amountNGN").value);

    if (!acct || !bank || !amt) return alert("Fill in all transfer details!");

    Meteor.call("transfer.toMoniepoint", acct, bank, amt, (err, res) => {
      if (err) {
        document.getElementById("transferResult").innerText =
          "❌ Transfer failed: " + err.message;
      } else {
        document.getElementById("transferResult").innerText =
          "✅ Transfer response: " + JSON.stringify(res);
      }
    });
  },
});
