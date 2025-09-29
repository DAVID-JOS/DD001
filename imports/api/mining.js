import { Meteor } from "meteor/meteor";

let miningInterval;

Meteor.methods({
  "mining.start"() {
    if (miningInterval) return "⛏ Mining already running";

    miningInterval = Meteor.setInterval(() => {
      Meteor.call("wallets.all", (err, wallets) => {
        if (err) return;
        wallets.forEach(w => {
          Meteor.call("wallets.updateBalance", w.address, 200); // 200 SKD/sec
        });
        console.log("⛏ Mined +200 SKD for each wallet");
      });
    }, 1000);

    return "⛏ Mining started";
  },

  "mining.stop"() {
    if (miningInterval) {
      Meteor.clearInterval(miningInterval);
      miningInterval = null;
      return "⛏ Mining stopped";
    }
    return "⛏ Mining was not running";
  }
});
