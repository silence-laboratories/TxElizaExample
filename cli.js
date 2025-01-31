#!/usr/bin/env node
require('dotenv').config();
const { createUnsignedTx, broadcastTx } = require('./lib');
const { Command } = require('commander');
const program = new Command();

program
  .name('eth-tx')
  .description('Ethereum Transaction CLI Tool')
  .version('1.0.0');

program.command('create-unsigned')
  .description('Create unsigned transaction')
  .requiredOption('-s, --sender <address>', 'Sender address')
  .requiredOption('-r, --receiver <address>', 'Receiver address')
  .requiredOption('-v, --value <eth>', 'Value in ETH')
  .action(async (options) => {
    try {
      const tx = await createUnsignedTx(options.sender, options.receiver, options.value);
      console.log('Unsigned Transaction Hex:', tx.unsignedSerialized);
      console.log('Unsigned Transaction Hash:', tx.unsignedHash);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.command('broadcast')
  .description('Broadcast the saved unsigned transaction with signature')
  .requiredOption('-s, --signature <hex>', 'Signature (130-character hex)')
  .requiredOption('-r, --recid <id>', 'Recovery ID (integer)')
  .action(async (options) => {
    try {
      const txHash = await broadcastTx(options.signature, parseInt(options.recid));
      console.log('Transaction successfully broadcasted:', txHash);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
