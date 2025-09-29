// imports/api/payout.js
import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http"; // calling Moniepoint API

// 🔑 Moniepoint creds from settings.json
const apiKey = Meteor.settings.private.moniepoint.apiKey;
const secret = Meteor.settings.private.moniepoint.secretKey;
const baseUrl = Meteor.settings.private.moniepoint.baseUrl;

// Example method for transfer
Meteor.methods({
  "transfer.toMoniepoint"(acct, bank, amount) {
    try {
      const response = HTTP.post(`${baseUrl}/transfer`, {
        headers: {
          "Authorization": `Bearer ${apiKey}:${secret}`,
          "Content-Type": "application/json"
        },
        data: {
          accountNumber: acct,
          bankCode: bank,
          amount: amount
        }
      });

      return response.data;
    } catch (err) {
      throw new Meteor.Error("moniepoint-error", err.message);
    }
  }
});
