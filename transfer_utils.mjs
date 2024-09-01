import TonWeb from "tonweb";

export const sendTon = async (
  wallet,
  receiverAddress,
  amount,
  message,
  tonweb,
  keyPair,
  seqno
) => {
  //   const seqno = (await wallet.methods.seqno().call()) || 0;
  //   console.log({ seqno });
  const comment = new Uint8Array([
    ...new Uint8Array(4),
    ...new TextEncoder().encode(message),
  ]);
  //   console.log({ comment });
  const payload = comment;
  const result = await wallet.methods
    .transfer({
      secretKey: keyPair.secretKey,
      toAddress: receiverAddress,
      amount: TonWeb.utils.toNano(amount),
      seqno,
      payload,
      sendMode: 3,
    })
    .send()
    .then((result) => {
      console.log(`Transfer successful: ${seqno}`, { result });
      return result;
    })
    .catch((error) => {
      console.error("Transfer failed:", error);
      throw error;
    });

  //   if (result && result.transaction) {
  //     console.log(
  //       `Transaction successful with hash: ${result.transaction.id.hash}`
  //     );
  //   } else {
  //     console.log("Transaction failed or no hash returned");
  //   }

  return result;
};

export const sendToken = async (
  wallet,
  receiverAddress,
  amount,
  message,
  tonweb,
  keyPair,
  JETTON_MASTER_ADDRESS
) => {
  const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {
    address: JETTON_MASTER_ADDRESS,
  });
  const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(
    new TonWeb.utils.Address(walletAddress)
  );
  const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
    address: jettonWalletAddress,
  });

  console.log(
    "Jetton wallet address:",
    jettonWalletAddress.toString(true, true, true)
  );

  const seqno = (await wallet.methods.seqno().call()) || 0;
  console.log({ seqno });
  const comment = new Uint8Array([
    ...new Uint8Array(4),
    ...new TextEncoder().encode(message),
  ]);
  const payload = await jettonWallet.createTransferBody({
    jettonAmount: TonWeb.utils.toNano(amount),
    toAddress: new TonWeb.utils.Address(receiverAddress),
    forwardPayload: comment,
    responseAddress: walletAddress,
  });
  const result = await wallet.methods
    .transfer({
      secretKey: keyPair.secretKey,
      toAddress: jettonWalletAddress.toString(true, true, true),
      amount: TonWeb.utils.toNano("0.5"),
      seqno,
      payload,
      sendMode: 3,
    })
    .send();

  if (result && result.transaction) {
    console.log(
      `Transaction successful with hash: ${result.transaction.id.hash}`
    );
  } else {
    console.log("Transaction failed or no hash returned");
  }

  return result;
};
