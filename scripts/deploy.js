const hre = require("hardhat");

async function main() {
  const ChatApp = await hre.ethers.getContractFactory("BlogApp");
  const chatApp = await ChatApp.deploy();

  await chatApp.deployed();

  console.log(` Contract Address: ${chatApp.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
