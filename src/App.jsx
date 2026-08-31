import { useState } from "react";
import {
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import {
  createTransaction,
  submitTransaction,
} from "./services/rpc";
import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const fetchBalance = async (address) => {
    const response = await fetch(
      `https://horizon-testnet.stellar.org/accounts/${address}`
    );

    if (!response.ok) {
      throw new Error("Could not fetch balance.");
    }

    const account = await response.json();

    const xlmBalance = account.balances.find(
      (item) => item.asset_type === "native"
    );

    setBalance(xlmBalance ? xlmBalance.balance : "0");
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setStatus("");

      const result = await requestAccess();

      console.log("Freighter result:", result);

      if (!result || !result.address) {
        throw new Error("Wallet address was not returned.");
      }

      setWalletAddress(result.address);

      const response = await fetch(
        `https://horizon-testnet.stellar.org/accounts/${result.address}`
      );

      if (!response.ok) {
        throw new Error("Account could not be found.");
      }

      const account = await response.json();

      const xlmBalance = account.balances.find(
        (item) => item.asset_type === "native"
      );

      setBalance(xlmBalance ? xlmBalance.balance : "0");
    } catch (error) {
  console.error(error);
  setStatus("Could not fetch wallet balance.");
} finally {
  setIsConnecting(false);
}
  };

  const disconnectWallet = () => {
  setWalletAddress("");
  setBalance(null);
  setRecipient("");
  setAmount("");
  setStatus("");
  setTransactionHash("");
};

  const sendXLM = async () => {
  setTransactionHash("");

  if (!recipient.trim()) {
    setStatus("Please enter a recipient address.");
    return;
  }

  if (!amount || Number(amount) <= 0) {
    setStatus("Please enter a valid amount.");
    return;
  }

  if (balance !== null && Number(amount) > Number(balance)) {
  setStatus("Insufficient XLM balance.");
  return;
}

  try {
    setIsSending(true);
    setStatus("Preparing transaction...");
  
  

    const transactionXdr = await createTransaction(
      walletAddress,
      recipient.trim(),
      amount
    );

    console.log("Transaction XDR:", transactionXdr);

    setStatus("Transaction created successfully.");

    const signResult = await signTransaction(
      transactionXdr,
      {
        networkPassphrase:
          "Test SDF Network ; September 2015",
      }
    );

    console.log("Freighter result:", signResult);

    if (!signResult || !signResult.signedTxXdr) {
      throw new Error("Freighter did not return a signed transaction.");
    }

    setStatus("Sending transaction to Stellar Testnet...");

const submitResult = await submitTransaction(
  signResult.signedTxXdr
);

console.log("Submit result:", submitResult);

if (submitResult.status === "ERROR") {
  throw new Error(
    submitResult.errorResultXdr ||
    "Transaction was rejected by Stellar."
  );
}

setStatus(
  "Transaction submitted successfully!"
);

console.log(
  "Transaction hash:",
  submitResult.hash
);

setTransactionHash(submitResult.hash);

await fetchBalance(walletAddress);

setRecipient("");
setAmount("");

  } catch (error) {
    console.error("Transaction error:", error);

    setStatus(
      `Transaction failed: ${error.message}`
    );
      } finally {
    setIsSending(false);
  }
};
  return (
    <div className="app">
      <h1>StellarPay</h1>

      <p>Send XLM on Stellar Testnet</p>

      {!walletAddress ? (
        <button
  onClick={connectWallet}
  disabled={isConnecting}
>
  {isConnecting ? "Connecting..." : "Connect Freighter"}
</button>
      ) : (
        <div className="wallet-section">

          <h2>Wallet Connected</h2>

          <div className="address">
            {walletAddress}
          </div>

          <h2>Balance</h2>

          <div className="balance">
            {balance !== null
              ? `${balance} XLM`
              : "Loading..."}
          </div>

          <hr />

          <h2>Send XLM</h2>

          <label>Recipient Address</label>

          <input
            type="text"
            placeholder="G... recipient address"
            value={recipient}
            onChange={(event) =>
              setRecipient(event.target.value)
            }
            disabled={isSending}
          />

          <label>Amount</label>

          <input
            type="number"
            placeholder="Amount in XLM"
            min="0"
            step="0.0000001"
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
            disabled={isSending}
          />

          <button onClick={sendXLM} disabled={isSending}>
  {isSending ? "Sending..." : "Send XLM"}
</button>

          {status && (
  <div
    className={`status ${
      status.toLowerCase().includes("failed") ||
      status.toLowerCase().includes("invalid") ||
      status.toLowerCase().includes("insufficient") ||
      status.toLowerCase().includes("could not")
        ? "status-error"
        : status.toLowerCase().includes("success")
        ? "status-success"
        : ""
    }`}
  >
    {status}
  </div>
)}

          {transactionHash && (
  <div className="transaction-result">
    <h3>Transaction Successful 🎉</h3>

    <p>Transaction Hash:</p>

    <code>{transactionHash}</code>

    <a
      href={`https://stellar.expert/explorer/testnet/tx/${transactionHash}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      View on Stellar Explorer
    </a>
  </div>
)}

          <button onClick={disconnectWallet}>
            Disconnect
          </button>

        </div>
      )}
    </div>
  );
}

export default App;