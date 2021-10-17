# 💎 Precious Stones Mint

Digital form of gemstones to store characteristics, track origin and history of ownership, and ensure legit source that is ethical.

## Problem

Currently, there is lack of transparency when it comes to precious stones. Origin is often unknown and there is no full history of ownership. Moreover, the characteristic of an asset could be stored so that once verified becomes its integral part, hence doesn't allow to tamper.

## Idea

The idea is to create decentralized market, where everyone can verify origin of gemstones and their characteristics.
As part of this exercise, I will deploy a smart contract to mint NFTs specifically for diamonds which besides typical parameters would keep its clarity, cut, carat and color.
Minting NFTs in the Ethereum using [ERC-721](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/) can be replaced with *ERC-1155* in the future, to issue different tokens per different gems.

- Approved wholesale gemstone **Suppliers** would be able to add their products
- **Dealers** would be able to verify its origin
- **Clients** would be able to verify its origin, history, get familiar with its characteristics and purchase

## How to develop?

### Prerequisite

- Execute `npm install -g truffle` to install Truffle globally to be able to execute it from the command line
- Execute `npm install -g ganache-cli` to install Ganache CLI globally to be able to execute it from the command line
- Execute `npm install` from the project root to install all other dependencies
- Execute `npm run dotenv` to prepare local `.env` file

### Contract Development

- Execute `ganache-cli` 
- Execute `truffle compile` to compile all smart contracts
- Execute `truffle migrate --network development` to deploy smart contracts to local network
- Execute `truffle test` to run unit tests for smart contracts

### UI Development

- Execute `cd client` to change path to main client directory
- Execute `CI=true npm test` to run all unit tests for the UI
- Execute `npm start` to start local development server
- Install [MetaMask browser extension](https://metamask.io/download.html) and use mnemonic provided by `ganache-cli` when started as restore phrase
  - Make sure to switch network to *Localhost:8545*
- Open `http://localhost:3000` to see the result, the page will ask to connect to current wallet's account in MetaMask
- Click *Mint NFT* button to execute a transaction and mint PST token

## How to run?

### Deploying the contract to Ropsten via Infura
- Create new project in [Infura](https://infura.io)
- Copy endpoint URL for Ropsten testnet and set as `INFURA_URL` environment variable in `.env` file
- Copy restore phrase from MetaMask and set as `MNEMONIC` environment variable in `.env` file
- Use [Ropsten Faucet](https://faucet.ropsten.be) to get some Ether for default account in Ropsten testnet, to be able to deploy the smart contract
- Execute `truffle migrate --network ropsten` to deploy smart contracts to Ropsten testnet
- Use [Ropsten Etherscan](https://ropsten.etherscan.io) page to see details of deployed contract using its address

### Running on Heroku

- Create a new app in Heroku (`heroku-20` type of stack)
- Go to *Settings* and add the following *Buildpacks*:
  - `heroku/nodejs`
- Go to *Settings* and add the following *Config Vars*:
  - `REACT_APP_CONTRACT_ADDRESS` (use `PreciousStoneToken` smart contract address after it has been deployed to Ropsten or leave empty to deploy the contract)
  - `INFURA_URL` (use endpoint URL for Ropsten testnet from [Infura](https://infura.io))
  - `MNEMONIC` (use restore phrase from MetaMask)
- Go to *Deploy* and connect app to *GitHub* repository
- Push `master` branch
