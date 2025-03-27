const hre = require("hardhat");

// Returns the ether balance of a given address
async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.formatEther(balanceBigInt);
}

// Logs the ether balance for a list of addresses
async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
        console.log(`Address ${idx} balance:`, await getBalance(address));
        idx++;
    }
}

// Logs the memos stored on-chain from coffee purchases
async function printMemos(memos) {
    for (const memo of memos) {
        console.log(
            `At ${memo.timestamp}, ${memo.name} (${memo.from}) said: "${memo.message}"`
        );
    }
}

async function main() {
    // Get example Ethereum accounts (signers)
    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

    // Load and deploy the BuyMeACoffee contract
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();
    await buyMeACoffee.waitForDeployment(); // ✅ Fixed!

    console.log("BuyMeACoffee deployed to:", buyMeACoffee.target); // ✅ Use `.target` instead of `.address`

    // Check and print ETH balances before any coffee purchases
    const addresses = [owner.address, tipper.address, buyMeACoffee.target];
    console.log("== Start ==");
    await printBalances(addresses);

    // Define the tip amount (1 ETH in this case)
    const tip = { value: hre.ethers.parseEther("1") };

    // Tippers buy coffee
    await buyMeACoffee.connect(tipper).buyCoffee("Carolina", "You're the best!", tip);
    await buyMeACoffee.connect(tipper2).buyCoffee("Vitto", "Amazing teacher", tip);
    await buyMeACoffee.connect(tipper3).buyCoffee("Kay", "I love my proof of knowledge", tip);

    // Check and print ETH balances after purchases
    console.log("== Bought Coffee ==");
    await printBalances(addresses);

    // Owner withdraws the collected tips
    await buyMeACoffee.connect(owner).withdrawTips();

    // Check and print ETH balances after withdrawal
    console.log("== Withdraw Tips ==");
    await printBalances(addresses);

    // Retrieve and print all memos
    console.log("== Memos ==");
    const memos = await buyMeACoffee.getMemos();
    await printMemos(memos);
}

// Execute the script and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
