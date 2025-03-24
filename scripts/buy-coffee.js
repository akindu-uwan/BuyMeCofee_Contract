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
    }
}