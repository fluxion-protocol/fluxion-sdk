/**
 * Example: Create a Vesting Schedule
 *
 * This example demonstrates how to:
 * 1. Initialize the Fluxion client
 * 2. Connect a wallet
 * 3. Create a vesting schedule with cliff vesting
 * 4. Query vesting status
 */

import { FluxionClient, DEFAULT_CONFIG, VestingError } from '@fluxion/sdk';

async function main(): Promise<void> {
  const client = new FluxionClient({
    ...DEFAULT_CONFIG.TESTNET,
    fluxionCoreId: 'CDAZOG4V2KAPVBBKCAMHUT367AUGYWYEHD652UOJVER5ERNYGSOROBAN',
  });

  try {
    // Connect wallet
    console.log('🔌 Connecting wallet...');
    const address = await client.connect();
    console.log(`✅ Connected: ${address}\n`);

    // Define vesting schedule
    const vestingSchedule = {
      beneficiary: 'GBRECIPIENT_ADDRESS', // Replace with actual address
      totalAmount: 1000000000n, // 1000 tokens
      cliffAmount: 100000000n, // 100 tokens cliff (vests immediately after cliff)
      cliffTime: BigInt(Math.floor(Date.now() / 1000) + 7776000), // 90 days from now
      endDuration: BigInt(31536000), // 1 year vesting period
      revocable: true,
    };

    // Create vesting schedule
    console.log('📅 Creating vesting schedule...');
    const result = await client.vesting.createVesting(
      vestingSchedule,
      'CBTOKEN_ADDRESS' // Replace with actual token address
    );

    console.log('✅ Vesting schedule created!');
    console.log(`Tx Hash: ${result.txHash}`);

    // Query vesting status
    console.log('\n📊 Checking vesting status...');
    const vestingId = 1n; // Would come from contract event
    try {
      const status = await client.vesting.getVestingStatus(vestingId);
      console.log('Vesting Status:', {
        beneficiary: status.beneficiary,
        totalAmount: status.totalAmount.toString(),
        cliffAmount: status.cliffAmount.toString(),
        releasedAmount: status.releasedAmount.toString(),
        revoked: status.revoked,
      });
    } catch (error) {
      console.warn('Could not fetch vesting status:', error);
    }

    await client.disconnect();
    console.log('\n👋 Disconnected');
  } catch (error: unknown) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
