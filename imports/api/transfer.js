import { Meteor } from "meteor/meteor";
import axios from "axios";

// 🔐 Pull secret key from settings.json
const MONIEPOINT_KEY = Meteor.settings.moniepointKey || "test-key";

Meteor.methods({
  async "transfer.toMoniepoint"(acct, bank, amt) {
    try {
      // Simulate live Moniepoint call
      const response = await axios.post(
        "https://api.moniepoint.com/v1/transfer",
        {
          account_number: acct,
          bank_code: bank,
          amount: amt
        },
        {
          headers: {
            Authorization: `Bearer ${MONIEPOINT_KEY}`
          }
        }
      );

      console.log(`💸 Transfer initiated → ${acct} | ₦${amt}`);
      return response.data;
    } catch (err) {
      console.error("❌ Transfer failed", err.message);
      throw new Meteor.Error("transfer-failed", err.message);
    }
  }
});
