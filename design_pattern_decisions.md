## Design Patterns and Decisions

### Inheritance and Interfaces

*PreciousStoneToken* is inheriting from:
- [ERC721](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol) contract. 
ERC721 is a standard for representing ownership of non-fungible tokens, that is, where each token is unique.
This is a perfect way of marking precious stones, each of which is unique.
- [ERC721Enumerable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol) abstract contract that allows on-chain enumeration of all tokens.
It is used for retrieving all tokens owned by a user and presenting on *My Tokens* page.
- [ERC721URIStorage](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol) abstract contract that allows updating token URIs for individual token IDs.
This way it is possible to use IPFS hash as a token ID.
- [Ownable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol) abstract contract that adds basis access control mechanism.
It is used as a security mechanism and also for transferring owned tokens to other Ethereum address.

### Oracles

*PreciousStoneToken* is using off-chain oracles via [Chainlink](https://chain.link). 
It is fetching the price of Ethereum compared to USD to calculate the result price. 
Suppliers are setting the price of precious stones in USD, but clients are purchasing using ETH (wei).
Using [AggregatorV3Interface](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol) it is being done by querying another contract that has already followed the basic request model among many different oracles and data providers. 
This way, the network is using different data providers and oracles so that there is never a single authority point.
Visualization of this contract and other nodes gathering the data can be found at [data.chain.link](https://data.chain.link/ethereum/mainnet/crypto-usd/eth-usd).

### Access Control Design Patterns

Besides securing NFTs using [Ownable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol) abstract contract, *PreciousStoneToken* ensures restricted access by implementing two roles for supply chain: admins and suppliers. 
Only admins can add suppliers, and only suppliers can add new items to the market.
Anyone has access to the market and can purchase items, which also triggers minting an NFT and setting buyer as an owner of minted NFT.
Only owners of NFTs can transfer them to other Ethereum address.
