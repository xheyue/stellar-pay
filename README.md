# StellarPay

StellarPay is a simple decentralized application (dApp) built with React and Vite that allows users to connect their Freighter wallet, view their XLM balance, and send XLM transactions on the Stellar Testnet.

## Features

- Connect to Freighter Wallet
- Disconnect wallet
- Display connected Stellar wallet address
- Fetch and display XLM balance
- Send XLM on Stellar Testnet
- Validate Stellar recipient addresses
- Validate transaction amounts
- Detect insufficient XLM balance
- Sign transactions using Freighter
- Submit transactions to Stellar Testnet
- Display transaction status
- Display successful transaction hash
- Automatically refresh balance after a successful transaction
- Clear transaction form after success
- Loading states while connecting and sending
- Error handling for invalid transactions

## Technologies Used

- React
- Vite
- JavaScript
- Stellar SDK
- Freighter API
- Stellar Horizon
- Stellar RPC
- CSS

## Network

This project uses the **Stellar Testnet**.

No real XLM is used.

## Installation

Clone the repository:

```bash
git clone https://github.com/xheyue/stellar-pay.git

Open the project directory:

cd stellar-pay

Install dependencies:

npm install

Start the development server:

npm run dev

Open the local development URL shown by Vite in your browser.

How to Use
Install the Freighter wallet browser extension.
Set Freighter to Stellar Testnet.
Open StellarPay.
Click Connect Freighter.
Approve the wallet connection.
Your Stellar address and XLM balance will appear.
Enter a valid Stellar recipient address.
Enter the amount of XLM you want to send.
Click Send XLM.
Approve the transaction in Freighter.
After submission, StellarPay displays the transaction result and transaction hash.
Screenshots
Wallet Connected

Successful Testnet Transaction

Error Handling

StellarPay includes checks for:

Empty recipient addresses
Invalid Stellar addresses
Invalid transaction amounts
Insufficient XLM balance
Wallet connection errors
Transaction signing errors
Transaction submission errors
Development

The project was developed incrementally using Git with meaningful commits for individual features and improvements.

Security

StellarPay never asks users to enter their secret key or recovery phrase.

Transaction signing is handled through the Freighter wallet.

License

This project is for educational purposes.