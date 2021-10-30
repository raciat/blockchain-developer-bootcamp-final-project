## Avoiding Common Pitfalls and Attacks

### Floating Pragma

[SWC-103](https://swcregistry.io/docs/SWC-103) *Floating Pragma* can be avoided by using specific version of compiler.
A common method is to use the `^` to indicate the lowest compiler version that a contract will work with, but this is dangerous.
To remediate, it is advised to lock the version of compiler to the one that was used for running test suites against the contract.
Therefore, both version of compiler in [Truffle configuration](./truffle-config.js#L100) and pragma in [PreciousStoneToken](./contracts/PreciousStoneToken.sol#L2) smart contract are set to version `0.8.2`.
