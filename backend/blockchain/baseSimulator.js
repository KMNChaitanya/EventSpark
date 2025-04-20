const simulateBaseTransaction = async (from, to, amount) => {
    // Simulate a blockchain transaction on Base
    const gasFee = 0.0001; // Fake gas fee in ETH
    const tx = {
      from,
      to,
      amount,
      gasFee,
      success: Math.random() > 0.1, // 90% success rate for simulation
      txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
      timestamp: new Date().toISOString(),
    };
    console.log('Simulated Base Transaction:', tx);
    return tx;
  };
  
  module.exports = { simulateBaseTransaction };