const Burner = artifacts.require('Burner')

module.exports = async function (deployer) {
  await deployer.deploy(Burner)
}
