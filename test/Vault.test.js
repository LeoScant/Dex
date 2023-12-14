// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { ZeroAddress } = ethers;

// let testOwner, other1, other2, other3, vault, vaultAddress, token, tokenAddress;
// const toWei = (x) => ethers.parseEther(x.toString());
// describe('Vault', function () {
//     it("system setup", async function () {
//         [testOwner, other1, other2, other3] = await ethers.getSigners();

//         const Token = await ethers.getContractFactory("Token");
//         token = await Token.deploy("myToken", "myT1", 1000000);
//         tokenAddress = await token.getAddress();
//         expect(tokenAddress).to.be.not.equal(ZeroAddress);
//         expect(tokenAddress).to.match(/0x[0-9a-fA-F]{40}/);

//         const Vault = await ethers.getContractFactory("Vault");
//         vault = await Vault.deploy(tokenAddress);
//         vaultAddress = await vault.getAddress();
//         expect(vaultAddress).to.be.not.equal(ZeroAddress);
//         expect(vaultAddress).to.match(/0x[0-9a-fA-F]{40}/);
//     });

//     it("account distribute some tokens to users", async function () {
//         await token.connect(testOwner).transfer(other1, toWei(100000));
//         await token.connect(testOwner).transfer(other2, toWei(200000));
//         await token.connect(testOwner).transfer(other3, toWei(300000));

//         expect(await token.balanceOf(other1)).to.equal(toWei(100000));
//         expect(await token.balanceOf(other2)).to.equal(toWei(200000));
//         expect(await token.balanceOf(other3)).to.equal(toWei(300000));
//     });

//     it("other1 sends tokens to vault", async function () {
//         await token.connect(other1).approve(vaultAddress, toWei(100000));
//         await vault.connect(other1).deposit(toWei(100000));
//         expect(await token.balanceOf(other1)).to.equal(toWei(0));
//         expect(await token.balanceOf(vaultAddress)).to.equal(toWei(100000));
//         expect(await vault.balanceOf(other1)).to.equal(toWei(100000));
//     })

//     it("other2 sends tokens to vault", async function () {
//         await token.connect(other2).approve(vaultAddress, toWei(100000));
//         await vault.connect(other2).deposit(toWei(100000));
//         expect(await token.balanceOf(other2)).to.equal(toWei(100000));
//         expect(await token.balanceOf(vaultAddress)).to.equal(toWei(200000));
//         expect(await vault.balanceOf(other2)).to.equal(toWei(100000));
//     });

//     it("other3 sends tokens to vault", async function () {
//         await token.connect(other3).approve(vaultAddress, toWei(100000));
//         await vault.connect(other3).deposit(toWei(100000));
//         expect(await token.balanceOf(other3)).to.equal(toWei(200000));
//         expect(await token.balanceOf(vaultAddress)).to.equal(toWei(300000));
//         expect(await vault.balanceOf(other3)).to.equal(toWei(100000));
//     });

//     it("other3 withdraws shares from vault, receives tokens", async function () {
//         expect(await token.balanceOf(other3)).to.equal(toWei(200000));
//         await vault.connect(other3).withdraw(toWei(50000));
//         expect(await token.balanceOf(other3)).to.equal(toWei(250000));
//         expect(await token.balanceOf(vaultAddress)).to.equal(toWei(250000));
//         expect(await vault.balanceOf(other3)).to.equal(toWei(50000));
//     });
// });