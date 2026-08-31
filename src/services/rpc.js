import {
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  Account,
  BASE_FEE,
  StrKey,
} from "@stellar/stellar-sdk";

const server = new Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

export async function createTransaction(
  walletAddress,
  recipient,
  amount
) {
    if (!StrKey.isValidEd25519PublicKey(recipient)) {
    throw new Error("Please enter a valid Stellar address.");
  }

  const accountData = await server
    .accounts()
    .accountId(walletAddress)
    .call();

  const account = new Account(
    walletAddress,
    accountData.sequence
  );

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: recipient,
        asset: Asset.native(),
        amount: amount.toString(),
      })
    )
    .setTimeout(180)
    .build();

  return transaction.toXDR();
}

export async function submitTransaction(signedTxXdr) {
  const response = await fetch(
    "https://soroban-testnet.stellar.org",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "sendTransaction",
        params: {
          transaction: signedTxXdr,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `RPC request failed: ${response.status}`
    );
  }

  const data = await response.json();

  console.log("RPC response:", data);

  if (data.error) {
    throw new Error(
      data.error.message ||
      "Transaction submission failed."
    );
  }

  return data.result;
}