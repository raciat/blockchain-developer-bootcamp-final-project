// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';

/// @title Mock of AggregatorV3 for testing purpose
/// @author Tomasz Racia
/// @notice This is only a mock
/// @dev Do not deploy it to any network but local
/// @custom:experimental This is an experimental contract
contract AggregatorV3Mock is AggregatorV3Interface {
    uint8 _decimals = 8;
    uint256 _version = 3;
    string _description = 'ETH / USD';

    uint80 _roundId = 36893488147419116637;
    int256 _answer = 406772749646;
    uint256 _startedAt = 1634860686;
    uint256 _updatedAt = 1634860686;
    uint80 _ansIn = 36893488147419116637;

    function decimals() external view override returns (uint8) {
        return _decimals;
    }

    function version() external view override returns (uint256) {
        return _version;
    }

    function description() external view override returns (string memory) {
        return _description;
    }

    function getRoundData(uint80 roundId) public view virtual override returns (uint80, int256, uint256, uint256, uint80) {
        return (roundId, _answer, _startedAt, _updatedAt, _ansIn);
    }

    function latestRoundData() public view virtual override returns (uint80, int256, uint256, uint256, uint80) {
        return (_roundId, _answer, _startedAt, _updatedAt, _ansIn);
    }
}
