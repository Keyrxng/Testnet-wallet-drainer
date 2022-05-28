const TokenDrainer = artifacts.require('TokenDrainer')

module.exports = async function (deployer) {
  await deployer.deploy(TokenDrainer)
}
