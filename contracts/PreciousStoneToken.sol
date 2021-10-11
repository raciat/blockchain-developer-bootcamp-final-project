// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PreciousStoneToken is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
  enum Color { D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z }
  
  enum Clarity { Flawless, InternallyFlawless, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3 }
  
  struct Diamond {
    Color color;
    Clarity clarity;
    string cut;
    uint caratWeigh;
  }
  
  constructor() ERC721("PreciousStoneToken", "PST") {}

  function safeMint(address to, uint256 tokenId) public onlyOwner {
    _safeMint(to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }
}
