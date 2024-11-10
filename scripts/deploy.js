async function main() {
    const PaymentContract = await ethers.getContractFactory("PaymentContract");
    const paymentContract = await PaymentContract.deploy();
    await paymentContract.deployed();

    console.log("PaymentContract deployed to:", paymentContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
