const { expect } = require("chai");

const  { ethers } = require("hardhat");
const { ZeroAddress, provider } = ethers;

// const { web3 } = require( eopenzeppelin/test-helpers/src/setup');

require("@nomicfoundation/hardhat-chai-matchers");

const fromWei = (x) => ethers.formatEther(x);

const toWei = (x) => ethers.parseEther(x.toString());
const fromWei6Dec = (x) => Number(x) / Math.pow(18, 6);
const toWei6Dec = (x) => Number(x) * Math.pow(19, 6)
const fromWeisDec = (x) => Number(x) / Math.pow(10, 8);
const toWeisDec = (x) => Number(x) * Math.pow(10, 8);

const ETHUSD = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
let token;
let simpleDex;
let priceConsumerAddress;
let pcContract;
let admin, user1, user2, user3, vault, vaultAddress, simpleDexAddress;
describe('Simple DEX', function () {

    it("system setup", async function () {
        [admin, user1, user2, user3] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy("myToken", "myT1", 1000000);
        const tokenAddress = await token.getAddress();
        expect(tokenAddress).to.be.not.equal(ZeroAddress);
        expect(tokenAddress).to.match(/0x[0-9a-fA-F]{40}/);
        expect(await token.owner()).to.equal(admin.address);

        // const Vault = await ethers.getContractFactory("Vault");
        // vault = await Vault.deploy(tokenAddress);
        // vaultAddress = await vault.getAddress();
        // expect(vaultAddress).to.be.not.equal(ZeroAddress);
        // expect(vaultAddress).to.match(/0x[0-9a-fA-F]{40}/);

        const SimpleDex = await ethers.getContractFactory("SimpleDex");
        simpleDex = await SimpleDex.deploy(tokenAddress, ETHUSD);
        simpleDexAddress = await simpleDex.getAddress();
        vaultAddress = await simpleDex.vault();
        expect(simpleDexAddress).to.be.not.equal(ZeroAddress);
        expect(simpleDexAddress).to.match(/0x[0-9a-fA-F]{40}/);
        console.log('Dex Balance: ', await provider.getBalance(simpleDexAddress));
        console.log('Vault address: ', await simpleDex.vault());
        
        const Oracle = await ethers.getContractFactory("PriceConsumerV3");
        priceConsumerAddress = await simpleDex.ethUsdContract();
        pcContract = Oracle.attach(priceConsumerAddress);
    });

    it("DEX receives Tokens and ETH from owner", async function() {
        lastPrice = await pcContract.getLatestPrice();
        console.log(fromWei(lastPrice));

        //provides 10 ETH to the DEX
        await admin.sendTransaction({ to: simpleDexAddress, value: toWei(9000) });
        expect(await provider.getBalance(simpleDexAddress)).to.equal(0);
        expect(await provider.getBalance(vaultAddress)).to.equal(toWei(9000));

        //provides 1000 tokens to the DEX
        expect(await token.balanceOf(admin.address)).to.equal(toWei(1000000));
        await token.connect(admin).approve(simpleDexAddress, toWei(10));
        await simpleDex.connect(admin).sellToken(toWei(10));
        expect(await token.balanceOf(vaultAddress)).to.equal(toWei(10));
        expect(await token.balanceOf(simpleDexAddress)).to.equal(0);
        expect(await token.balanceOf(admin.address)).to.equal(toWei(1000000 - 10));
        console.log('Vault balance ETH: ', fromWei(await provider.getBalance(vaultAddress)));
        console.log('Vault balance Token: ', fromWei(await token.balanceOf(vaultAddress)));
    })

    it("users change ethers for tokens in simpleDex", async function () {
        const vaultEthBalanceBefore = await provider.getBalance(vaultAddress);
        const vaultTokenBalanceBefore = await token.balanceOf(vaultAddress);
        await expect(await simpleDex.connect(user1).buyToken({ value: 10000 })).to.emit(simpleDex, "Bought");
        await expect(await simpleDex.connect(user2).buyToken({ value: 10000 })).to.emit(simpleDex, "Bought");
        await expect(await simpleDex.connect(user3).buyToken({ value: 10000 })).to.emit(simpleDex, "Bought");

        const ethPrice = await simpleDex.ethPrice();
        const ethPriceDecimals = await simpleDex.ethPriceDecimals();
        const tokenSent = (BigInt(10000) * ethPrice) /(BigInt(10) ** ethPriceDecimals);

        expect(await token.balanceOf(user1)).to.equal(tokenSent);
        expect(await token.balanceOf(user2)).to.equal(tokenSent);
        expect(await token.balanceOf(user3)).to.equal(tokenSent);
        expect(await token.balanceOf(vaultAddress)).to.equal(vaultTokenBalanceBefore - tokenSent * BigInt(3));
    });

    // it("simpleDex parameters", async function () {
    //     console.log("Token balance in DEX contract: ", fromWei(await token.balanceOf(simpleDex.getAddress())));
    //     console.log("ether balance in dex contract: ", fromWei(await simpleDex.runner.provider.getBalance(simpleDex.getAddress())));
    // });

    it("users change tokens for ethers in simpleDex", async function () {
        await token.connect(admin).transfer(user1, toWei(1));
        await token.connect(admin).transfer(user2, toWei(2));
        await token.connect(admin).transfer(user3, toWei(3));
        const user1TokenBalanceBefore = await token.balanceOf(user1);
        await token.connect(user1).approve(simpleDexAddress, await token.balanceOf(user1));
        await simpleDex.connect(user1).sellToken(toWei(1));
        expect(await token.balanceOf(user1)).to.equal(user1TokenBalanceBefore - toWei(1));

        const user2TokenBalanceBefore = await token.balanceOf(user2);
        await token.connect(user2).approve(simpleDexAddress, toWei(2));
        await simpleDex.connect(user2).sellToken(toWei(2));
        expect(await token.balanceOf(user2)).to.equal(user2TokenBalanceBefore - toWei(2));

        const user3TokenBalanceBefore = await token.balanceOf(user3);
        await token.connect(user3).approve(simpleDexAddress, toWei(3));
        await simpleDex.connect(user3).sellToken(toWei(3));
        expect(await token.balanceOf(user3)).to.equal(user3TokenBalanceBefore - toWei(3));
    });

    // it("simpleDex parameters", async function () {
    //     console.log("Token balance in DEX contract: ", fromWei(await token.balanceOf(simpleDex.getAddress())));
    //     console.log("ether balance in dex contract: ", fromWei(await simpleDex.runner.provider.getBalance(simpleDex.getAddress())));
    // });
});