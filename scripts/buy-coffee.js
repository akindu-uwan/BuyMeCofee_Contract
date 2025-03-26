const hre =require("hardhat");

//returns the ether balance of a given address
async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils
}

//logs the ether balance for a list
async function printBlance(addresses){
    let ldx = 0;
    for(const address of addresses){
        console.log('Address ${idx} balance: ', await getBalance(address));
        idx++;
    }
}

//logs the memos stored on-chain from coffee purchases.
async function printMemo(memos) {
    for(const memo of memos) {
        const timestamp = memo.timstamp;
        const tipper = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        console.log('At &{timestamp}, ${tipper} (${tipperAddress}) said: "${message}"' );
    }
}

// This is an async function that will execute our deployment and testing logic.
async function main() {
    // 1. Get example Ethereum accounts (signers) from Hardhat.
    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

    // 2. Load the BuyMeACoffee contract factory.
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");

    // 3. Deploy the contract to the local blockchain.
    const buyMeACoffee = await BuyMeACoffee.deploy();

    // 4. Wait until the contract is fully deployed.
    await buyMeACoffee.deployed();

    // 5. Print the deployed contract's address.
    console.log("BuyMeACoffee deployed to:", buyMeACoffee.address);

    // 6. Check and print ETH balances before any coffee purchases.
    const addresses = [owner.address, tipper.address, buyMeACoffee.address];
    console.log("== Start ==");
    await printBalances(addresses);  // This function will print wallet balances.

    // 7. Define the tip amount (1 ETH in this case).
    const tip = { value: hre.ethers.utils.parseEther("1") };

    // 8. Tipper 1 (tipper) buys a coffee and leaves a message.
    await buyMeACoffee.connect(tipper).buyMeACoffee("Carolina", "You're the best!", tip);

    // 9. Tipper 2 (tipper2) buys a coffee and leaves a message.
    await buyMeACoffee.connect(tipper2).buyMeACoffee("Vitto", "Amazing teacher", tip);

    // 10. Tipper 3 (tipper3) buys a coffee and leaves a message.
    await buyMeACoffee.connect(tipper3).buyMeACoffee("Kay", "I love my proof of knowledge", tip);

    // 11. Check and print ETH balances after the coffee purchases.
    console.log("== Bought Coffee ==");
    await printBalances(addresses);

    // 12. The owner withdraws all tips (money) collected in the contract.
    await buyMeACoffee.connect(owner).withdrawTips();

    // 13. Check and print ETH balances after the withdrawal.
    console.log("== Withdraw Tips ==");
    await printBalances(addresses);

    // 14. Retrieve and print all memos (messages left by tippers).
    console.log("== Memos ==");
    const memos = await buyMeACoffee.getMemos();
    printMemos(memos); // This function will display the messages.
}

// Run the main function and handle errors if any occur.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


//we recommend this pattern to be able to use async/await everywhere
//and properly handle errors.
main()
.then(
    ()=> process.exit(0)
)
.catch(
    (error) => {
        console.error(error);
        process.exit(1);
    }
;)