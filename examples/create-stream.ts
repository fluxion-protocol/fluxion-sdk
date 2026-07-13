/**
 * Example: Create a Fluxion Payment Stream
 *
 * This example demonstrates how to:
 * 1. Initialize the Fluxion client
 * 2. Connect a wallet
 * 3. Create a continuous payment stream
 * 4. Handle errors gracefully
 */

import { FluxionClient, DEFAULT_CONFIG, TransactionError, WalletError } from '@fluxion/sdk';

async function main(): Promise<void> {
  // Step 1: Initialize the client with testnet configuration
  const client = new FluxionClient({
    ...DEFAULT_CONFIG.TESTNET,
    fluxionCoreId: 'CDAZOG4V2KAPVBBKCAMHUT367AUGYWYEHD652UOJVER5ERNYGSOROBAN',
  });

  try {
    // Step 2: Connect to Freighter wallet
    console.log('🔌 Connecting to Freighter wallet...');
    const address = await client.connect();
    console.log(`✅ Connected with address: ${address}`);

    // Step 3: Create a new payment stream
    console.log('\n💰 Creating payment stream...');
    const now = Math.floor(Date.now() / 1000);

    const result = await client.streams.createStream({
      recipient: 'GBDUMMY_RECIPIENT_ADDRESS', // Replace with actual recipient
      depositAmount: 500000000n, // 500 tokens (7 decimals = 500_000_000 stroops)
      startTime: BigInt(now + 3600), // Start in 1 hour
      stopTime: BigInt(now + 2592000), // Stop in 30 days
      tokenAddress: 'CBDUSDCABCD1234567890ABCDEF', // Replace with actual token
    });

    // Step 4: Display results
    console.log('\n✨ Stream Created Successfully!');
    console.log(`Status: ${result.status}`);
    console.log(`Transaction Hash: ${result.txHash}`);
    if (result.returnValue) {
      console.log(`Return Value: ${result.returnValue}`);
    }

    // Step 5: Query the stream to verify
    console.log('\n📊 Fetching stream details...');
    const streamId = 1n; // Stream ID would come from contract event/return value
    try {
      const streamData = await client.streams.getStream(streamId);
      console.log('Stream Data:', streamData);
    } catch (error) {
      console.warn('Could not fetch stream (may need actual contract ID): ', error);
    }

    // Step 6: Disconnect
    await client.disconnect();
    console.log('\n👋 Disconnected from wallet');
  } catch (error: unknown) {
    // Handle specific error types
    if (error instanceof WalletError) {
      console.error(`❌ Wallet Error: ${error.message}`);
      console.error(`Code: ${error.code}`);
    } else if (error instanceof TransactionError) {
      console.error(`❌ Transaction Error: ${error.message}`);
      console.error(`Code: ${error.code}`);
    } else {
      console.error('❌ Unexpected error:', error);
    }
    process.exit(1);
  }
}

// Run the example
main().catch((error: unknown) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
