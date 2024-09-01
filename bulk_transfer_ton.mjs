import "dotenv/config";
import TonWeb from "tonweb";
import tonwebMnemonic from "tonweb-mnemonic";
import fs from "fs";
import { delay } from "./utils.mjs";
import { sendTon } from "./transfer_utils.mjs";

const { mnemonicToSeed } = tonwebMnemonic;

const jsonFileName = process.argv[2];
const fileData = fs.readFileSync(jsonFileName, "utf-8");
const receiverList = JSON.parse(fileData);

const TON_CENTER_API_KEY = process.env.TON_CENTER_API_KEY;

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
  for (const receiver of receiverList) {
    console.log(`Transferring ${receiver.amount} TON to ${receiver.address}`);
    const result = await sendTon(
      wallet,
      receiver.address,
      receiver.amount,
      receiver.message,
      tonweb,
      keyPair
    );
    console.log(result);
    await delay(2000);
  }
})();
