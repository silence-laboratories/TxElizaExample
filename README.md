# TxElizaExample

## Ethereum Transaction CLI Tool

`TxElizaExample` is a command-line tool that allows users to create and broadcast Ethereum transactions. It supports generating unsigned transactions, signing them externally, and broadcasting them to the Ethereum network.

### Features
- Generate an unsigned Ethereum transaction and save it to a file.
- Sign the transaction externally (e.g., using a hardware wallet or other tools).
- Broadcast the signed transaction to the Ethereum network.
- Supports Infura as an Ethereum provider.

## Installation

### Clone the repository and install dependencies:
```sh
$ git clone https://github.com/silence-laboratories/TxElizaExample
$ cd TxElizaExample
$ npm install
```



## Configuration
Create a `.env` file in the root directory and configure the following environment variables:
```ini
INFURA_API_KEY=your_infura_api_key
NETWORK=sepolia  # or any other Ethereum network
```

## Usage

### 1. Create an Unsigned Transaction
```sh
$ eth-tx create-unsigned -s <sender_address> -r <receiver_address> -v <amount_in_eth>
```
Example:
```sh
$ eth-tx create-unsigned -s 0xYourSenderAddress -r 0xReceiverAddress -v 0.1
```
This command will generate an unsigned transaction and save it to `unsignedTx.json`.

### 2. Sign the Transaction Externally
Use an external wallet or signing tool to sign the transaction using the private key of the sender. The signed output should be a 130-character hexadecimal string (R + S) and a recovery ID.

### 3. Broadcast the Signed Transaction
```sh
$ eth-tx broadcast -s <signed_hex> -r <recovery_id>
```
Example:
```sh
$ eth-tx broadcast -s aabbccddeeff... -r 1
```
This will submit the signed transaction to the Ethereum network.

## Notes
- Ensure that the Infura API key is set in the `.env` file.
- The transaction will be stored in `unsignedTx.json` until it is broadcasted.
- After successful broadcasting, the `unsignedTx.json` file is deleted automatically.

