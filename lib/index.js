const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// File to store unsigned transaction details
const TX_FILE = path.join(__dirname, 'unsignedTx.json');

async function createUnsignedTx(sender, receiver, value) {
  const provider = new ethers.InfuraProvider(
    process.env.NETWORK || 'sepolia',
    process.env.INFURA_API_KEY
  );

  const { chainId } = await provider.getNetwork();
  const parsedValue = ethers.parseEther(value);
  const nonce = await provider.getTransactionCount(sender, 'latest');

  const tx = ethers.Transaction.from({
    to: receiver,
    value: parsedValue,
    gasLimit: 21000,
    gasPrice: ethers.parseUnits('20', 'gwei'),
    nonce,
    chainId,
  });
  // Save the unsigned transaction data to a file
  const txData = {
    unsignedSerialized: tx.unsignedSerialized,
  };

  fs.writeFileSync(TX_FILE, JSON.stringify(txData, null, 1));

  return tx;
}

async function broadcastTx(signature, recId) {
  const provider = new ethers.InfuraProvider(
    process.env.NETWORK || 'sepolia',
    process.env.INFURA_API_KEY
  );

  try {
    // Read the unsigned transaction data from the file
    if (!fs.existsSync(TX_FILE)) {
      throw new Error('No unsigned transaction found. Please create one first.');
    }

    const txData = JSON.parse(fs.readFileSync(TX_FILE, 'utf-8'));
    const unsignedTxHex = txData.unsignedSerialized;

    // Parse the unsigned transaction
    const tx = ethers.Transaction.from(unsignedTxHex);

    // Extract and assign the signature
    const sig = {
      r: '0x' + signature.slice(0, 64),
      s: '0x' + signature.slice(64, 128),
      v: recId,
    };

    tx.signature = sig;

    console.log('Signed Transaction Hex:', tx.serialized);

    // Broadcast the signed transaction
    const txResponse = await provider.broadcastTransaction(tx.serialized);
    console.log('Transaction Broadcasted!');
    console.log('Transaction Hash:', txResponse.hash);

    // Clean up the file after broadcasting
    fs.unlinkSync(TX_FILE);
    console.log('Unsigned transaction file removed.');

    return txResponse.hash;
  } catch (error) {
    throw new Error(`Failed to broadcast transaction: ${error.message}`);
  }
}

module.exports = { createUnsignedTx, broadcastTx };
