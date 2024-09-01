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

const getSeqno = async () => {
  return (await wallet.methods.seqno().call()) || 0;
};

(async () => {
  await init();
  let currentSeqno = await getSeqno();
  for (const receiver of receiverList) {
    console.log(`Transferring ${receiver.amount} TON to ${receiver.address}`);
    try {
      const result = await sendTon(
        wallet,
        receiver.address,
        receiver.amount,
        receiver.message,
        tonweb,
        keyPair,
        currentSeqno
      );
      console.log(`Result for ${receiver.address}: ${receiver.amount}`, result);

      // Wait for seqno to update
      let newSeqno;
      do {
        await delay(2000); // Wait for 2 seconds before checking again
        newSeqno = await getSeqno();
      } while (newSeqno === currentSeqno);

      currentSeqno = newSeqno; // Update currentSeqno for the next transaction
    } catch (error) {
      console.error(`Failed to transfer to ${receiver.address}:`, error);
    }
  }
})();
