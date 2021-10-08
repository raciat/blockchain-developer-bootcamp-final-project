const PreciousStoneToken = artifacts.require("PreciousStoneToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("PreciousStoneToken", function (/* accounts */) {
  it("should assert true", async function () {
    await PreciousStoneToken.deployed();
    return assert.isTrue(true);
  });
});
