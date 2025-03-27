const hre = require("hardhat");

async function main() {
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();

    await buyMeACoffee.waitForDeployment();

    console.log("Contract Deployment Object:", buyMeACoffee); // Log full object
    console.log("BuyMeACoffee deployed to:", await buyMeACoffee.getAddress()); // Correct way to get address
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
