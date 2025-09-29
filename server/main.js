import { Meteor } from "meteor/meteor";
import "../imports/api/wallets.js";
import "../imports/api/mining.js";
import "../imports/api/exchange.js";
import "../imports/api/transfer.js";

Meteor.startup(() => {
  console.log("🚀 Mine App server started...");

  // Boot mining ticker
  Meteor.call("mining.start");
});
