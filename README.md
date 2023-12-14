# SimpleDex Smart Contract

This repository contains the source code for a SimpleDex smart contract written in Solidity. SimpleDex is a decentralized exchange (DEX) that allows users to buy and sell ERC-20 tokens using Ether. It uses OpenZeppelin contracts for ERC-20 interactions, access control, and safe Ether handling.

## Features

- **Buy Token Functionality:** Users can purchase ERC-20 tokens by sending Ether to the contract. The contract calculates the amount of tokens to send based on the current Ethereum to USD price.

- **Sell Token Functionality:** Users can sell ERC-20 tokens by approving the contract to spend a certain amount of tokens and then calling the `sellToken` function. The contract calculates the amount of Ether to send based on the current Ethereum to USD price.

## Getting Started

Follow these steps to set up and deploy the SimpleDex smart contract:

1. Clone the repository:

   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Deploy the contract:

   ```bash
   npx hardhat run scripts/deploy.js --network [network]
   ```

   Replace `[network]` with the desired Ethereum network (e.g., `rinkeby`, `mainnet`).

## Contract Details

- **Token Address:** The address of the ERC-20 token that users can buy and sell.

- **Vault:** The contract responsible for managing token deposits and withdrawals.

- **Price Oracle:** The contract that provides the Ethereum to USD price.

- **Ether Price:** The current Ethereum to USD price fetched from the price oracle.

## Usage

1. Deploy the SimpleDex contract, providing the ERC-20 token address and the Ethereum to USD price oracle address.

2. Users can send Ether to the contract using the `buyToken` function to purchase ERC-20 tokens.

3. Users can sell ERC-20 tokens by approving the contract to spend tokens and then calling the `sellToken` function.

## Development

To make modifications to the Smart Contract or develop additional features, follow these steps:

1. Make changes to the contract in the `contracts/` directory.

2. Run tests to ensure the modifications do not introduce issues:

   ```bash
   npx hardhat test
   ```

3. Deploy the updated contract to the desired Ethereum network.

## Contributors

- [Your Name]
- [Another Contributor]

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenZeppelin for providing the ERC-20 and Ownable contracts.
- Hardhat for simplifying Ethereum development.

Feel free to contribute to the project and improve the SimpleDex smart contract!