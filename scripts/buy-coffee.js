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

async function main() {
    //get the example accounts we ll be working with.
    const [owner,tipper,tipper2, tipper3] = await hre.ethers.getSigners();
    
    // we get the contract to deploy
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();

    //deploy the contract
    await buyMeACoffee.deployed();
    console.log("BuyMeACoffee deployed to:", BuyMeACoffee.address);

    //check balance before the coffe purchase.
    const address =[owner.address, tipper.address, buyMeACoffee.address];
    console.log("==start==");
    await printBlances(addresses);

    //buy the owner a few coffees.
    const tip = {value: hre.ethers.utils.parseEther("1")};
    await buyMeACoffee.connect(tipper).buyMeACoffee("carolina", "you re the best!", tip);
    await buyMeACoffee.connect(tipper2).buyMeACoffee("vitto", "amazing teacher", tip);
    await buyMeACoffee.connect(tipper3).buyMeACoffee("kay", "i love my proof of knowledge", tip);

    //check balances adter the coffee purchase.
    console.log("==bought cofffee==");
    await printBlances(addresses);

    //withdraw
    await buyMeACoffee.connect(owner).withdrawTips();

    //check balances after withdrawal.
    console.log("==withdrawTips==");
    await printBlances(address);

    //checkout memos
    console.log("==memos==");
    const memos = await buyMeACoffee.getMemos();
    printMemos(memos);

}

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