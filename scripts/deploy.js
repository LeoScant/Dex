import { ethers } from "hardhat";
async function main() {
  const token = await ethers.deployContract("Token", ["myToken”, “myT1", 1000000]);
  console.log("Token address:", await token.getAddress());

  const priceConsumerV3 = await ethers.deployContract("PriceConsumerV3", ['0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419']);
  console.log("PriceConsumerV3 address:", await priceConsumerV3.getAddress());

  const simpleDex = await ethers.deployContract("SimpleDex", [tokenAddress, priceConsumerV3Address]);
  console.log("SimpleDex address:", await simpleDex.getAddress());

  const vault = await ethers.deployContract("Vault", [tokenAddress]);
  console.log("Vault address:", await vault.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });