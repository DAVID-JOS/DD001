import { Meteor } from "meteor/meteor";
import fs from "fs";

const DATA_FILE = "data.json";

// Load wallets
function loadWallets() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Save wallets
function saveWallets(wallets) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(wallets, null, 2));
}

Meteor.methods({
  "wallets.all"() {
    return loadWallets();
  },

  "wallets.insert"(address, balance = 0) {
    let wallets = loadWallets();
    if (wallets.find(w => w.address === address)) {
      throw new Meteor.Error("Wallet already exists");
    }
    wallets.push({ address, balance });
    saveWallets(wallets);
    console.log(`✅ Wallet added: ${address}`);
    return true;
  },

  "wallets.updateBalance"(address, delta) {
    let wallets = loadWallets();
    wallets = wallets.map(w =>
      w.address === address ? { ...w, balance: w.balance + delta } : w
    );
    saveWallets(wallets);
  }
});
