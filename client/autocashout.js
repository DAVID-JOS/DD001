import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import { ReactiveVar } from "meteor/reactive-var";
import "./main.html";
import "./main.css";

// Shared state
const walletsState = new ReactiveVar([]);

Template.body.onCreated(function () {
  Meteor.call("wallets.all", (err, res) => {
    if (!err) walletsState.set(res);
  });

  setInterval(() => {
    Meteor.call("wallets.all", (err, res) => {
      if (!err) walletsState.set(res);
    });
  }, 2000);
});

Template.body.helpers({
  wallets() {
    return walletsState.get();
  },
});

// 🔥 Auto Transfer: Wallet SKD → USD → NGN → Moniepoint
Template.body.events({
  "click #transferBtn"() {
    const acct = document.getElementById("acctNum").value;
    if (!acct) return alert("Enter account number!");

    const wallets = walletsState.get();
    if (!wallets.length) return alert("No wallets found!");

    const wallet = wallets[0]; // take first wallet
    if (wallet.balance <= 0) return alert("Wallet empty!");

    const SKD_TO_USD = 2000; // 1 SKD = $2000
    const USD_TO_NGN = 1500; // 1 USD = ₦1500

    const usdValue = wallet.balance * SKD_TO_USD;
    const nairaValue = usdValue * USD_TO_NGN;

    Meteor.call("transfer.toMoniepoint", acct, "MONIEPOINT", nairaValue, (err, res) => {
      if (err) {
        document.getElementById("transferResult").innerText =
          "❌ Transfer failed: " + err.message;
      } else {
        document.getElementById("transferResult").innerText =
          `✅ Sent ₦${nairaValue} from ${wallet.address}`;

        // Reset balance after cash-out
        Meteor.call(
          "wallets.updateBalance",
          wallet.address,
          -wallet.balance
        );
      }
    });
  },
});
