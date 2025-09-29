import { Meteor } from "meteor/meteor";

const RATE = 1500; // USD → NGN fixed rate

Meteor.methods({
  "exchange.usdToNgn"(usd) {
    return usd * RATE;
  },
  "exchange.ngnToUsd"(ngn) {
    return ngn / RATE;
  }
});
