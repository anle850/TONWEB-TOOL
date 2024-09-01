import "dotenv/config";
import TonWeb from "tonweb";
import tonwebMnemonic from "tonweb-mnemonic";
import fs from "fs";
import { delay } from "./utils.mjs";
import { sendTon } from "./transfer_utils.mjs";

const { mnemonicToSeed } = tonwebMnemonic;

const jsonFileName = process.argv[2];
const fileData = fs.readFileSync(jsonFileName, "utf-8");
const walletList = JSON.parse(fileData);

const TON_CENTER_API_KEY = process.env.TON_CENTER_API_KEY;
const RECEIVER_ADDRESS = process.env.RECEIVER_ADDRESS;

const tonweb = new TonWeb(
  new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC", {
    apiKey: TON_CENTER_API_KEY,
  })
);

let wallet;
let walletAddress;
let keyPair;

const init = async () => {
  const seed = await mnemonicToSeed(process.env.MNEMONIC.split(" "));
  keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);
  const WalletClass = tonweb.wallet.all["v4R2"];
  wallet = new WalletClass(tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0,
  });

  walletAddress = await wallet.getAddress();
};

(async () => {
  await init();
  for (const wallet of walletList) {
    console.log(`Transferring ${wallet.amount} TON to ${RECEIVER_ADDRESS}`);
    const result = await sendTon(
      wallet,
      RECEIVER_ADDRESS,
      wallet.amount,
      wallet.message,
      tonweb,
      keyPair
    );
    console.log(result);
    await delay(2000);
  }
})();
