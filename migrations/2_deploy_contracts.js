var SafeMath = artifacts.require("./SafeMath.sol");
var ERC20Token = artifacts.require("./ERC20Token.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, ERC20Token);
  deployer.deploy(ERC20Token, 10000000, "Zastrin Token", 2, "ZTOK");
};
