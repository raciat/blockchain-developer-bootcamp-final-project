# 💎 Precious Stones Mint

Digital form of gemstones to store characteristics, track origin and history of ownership, and ensure legit source that is ethical.

## Problem

Currently, there is lack of transparency when it comes to precious stones. Origin is often unknown and there is no full history of ownership. Moreover, the characteristic of an asset could be stored so that once verified becomes its integral part, hence doesn't allow to tamper.

## Idea

The idea is to create decentralized market, where everyone can verify origin of gemstones and their characteristics.
As part of this exercise, I will deploy a smart contract to mint NFTs specifically for diamonds which besides typical parameters would keep its clarity, cut, carat and color.
Minting NFTs in the Ethereum using [ERC-721](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/) can be replaced with *ERC-1155* in the future, to issue different tokens per different gems.

- Wholesale gemstone **manufacturers and suppliers** would be able to mint tokens for their products
- **Dealers** would be able to verify its origin
- **Clients** would be able to verify its origin, history, get familiar with its characteristics and purchase or sale

## How to develop?

### Prerequisite

- Execute `npm install -g truffle` to install Truffle globally to be able to execute it from the command line
- Execute `npm install -g ganache-cli` to install Ganache CLI globally to be able to execute it from the command line
- Execute `npm install @openzeppelin/contracts` from the project root

### Contract Development

- Execute `ganache-cli` 
- Execute `truffle compile` to compile all smart contracts
- Execute `truffle migrate` to migrate smart contracts
- Execute `truffle test` to run unit tests for smart contracts

### UI Development

- Execute `cd client` to change path to main client directory
- Execute `CI=true npm test` to run all unit tests for the UI
- Execute `npm start` to start local development server
- Install [MetaMask browser extension](https://metamask.io/download.html) and use mnemonic provided by `ganache-cli` when started as seed phrase
  - Make sure to switch network to *Localhost:8545*
- Open `http://localhost:3000` to see the result, it will ask to connect wallet's account
