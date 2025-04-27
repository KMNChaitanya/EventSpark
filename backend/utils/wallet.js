const { ethers } = require('ethers');

const generateWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
};

module.exports = { generateWallet };