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

- Execute `truffle develop`
  - Alternative to execute `ganache-cli` in a separate tab
- Execute `truffle compile` to compile all smart contracts
- Execute `truffle migrate --network develop` to deploy smart contracts to local network
  - Alternative to execute `truffle migrate --network development` if using `ganache-cli`
- Execute `truffle test` to run unit tests for smart contracts

### MetaMask wallet for Development

- Install [MetaMask browser extension](https://metamask.io/download.html) and open it
- Create a new network:
  - Name: `Truffle Develop`
  - RPC URL: `http://127.0.0.1:9545/`
  - Chain ID: `1337`
- Import some accounts from Truffle using their private keys
- Alternative to use mnemonic as restore phrase, which is provided if using `ganache-cli`

### UI Development

- Execute `cd client` to change path to main client directory
- Execute `CI=true npm test` to run all unit tests for the UI
- Execute `npm start` to start local development server
- Open `http://localhost:3000` to see the result, the page will ask to connect to current wallet's account in MetaMask
- Execute some operations, MetaMask wallet will be opened automatically to sign the transaction
  - Hint: in case of `the tx doesn't have the correct nonce` error, open MetaMask, go to *My Accounts*, then *Settings*, then *Advanced* and click on *Reset Account*

## How to run?

### Deploying the contract to Rinkeby via Infura
- Create new project in [Infura](https://infura.io)
- Use [Rinkeby Faucet](https://faucet.rinkeby.io/) to get some Ether for default account in Rinkeby testnet, to be able to deploy the smart contract
  - Hint: use Twitter to publish a post with your Ethereum address, Facebook doesn't work
- Compile and deploy via Truffle:
  - Copy endpoint URL for Rinkeby testnet and set as `INFURA_URL` environment variable in `.env` file
  - Copy restore phrase from MetaMask and set as `MNEMONIC` environment variable in `.env` file
  - Execute `truffle migrate --network rinkeby` to deploy smart contracts to Rinkeby testnet
- Compile and deploy via [Remix](https://remix.ethereum.org/):
  - Copy content of `PreciousStoneToke.sol` and paste into Remix on the first tab called *File Explorer*
  - Compile the code on the second tab called *Solidity Compiler*
  - Open MetaMask, select Rinkeby network and proper account with some test ether there, and click *Connect*
  - Open third tab called *Deploy and run transactions*:
    - Choose *Injected Web3* environment
    - Select proper account (make sure it is connected to Remix in MetaMask)
    - Select proper contract (*PreciousStoneToken*)
    - Hit *Deploy*
- Deployment script will ask for `priceFeedAddress` constructor parameter - use contract address for *ETH/USD* price feed from [the list](https://docs.chain.link/docs/ethereum-addresses/) (e.g. `0x8A753747A1Fa494EC906cE90E9f37563A8AF630e` for Rinkeby)
- Use [Rinkeby Etherscan](https://rinkeby.etherscan.io) page to see details of deployed contract using its address

### Running on Heroku

- Create a new app in Heroku (`heroku-20` type of stack)
- Go to *Settings* and add the following *Buildpacks*:
  - `heroku/nodejs`
- Go to *Settings* and add the following *Config Vars*:
  - `REACT_APP_CONTRACT_ADDRESS` (use `PreciousStoneToken` smart contract address after it has been deployed to Rinkeby or leave empty to deploy the contract)
  - `INFURA_URL` (use endpoint URL for Rinkeby testnet from [Infura](https://infura.io))
  - `MNEMONIC` (use restore phrase from MetaMask)
- Go to *Deploy* and connect app to *GitHub* repository
- Push `master` branch
