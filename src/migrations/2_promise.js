const Promise = artifacts.require("Promise");

module.exports = function(deployer) {
  deployer.deploy(Promise);
};
