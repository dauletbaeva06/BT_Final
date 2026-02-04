const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Week4Token", function () {
  let Token, token, owner, addr1, addr2;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Week4Token");
    [owner, addr1, addr2] = await ethers.getSigners();
    token = await Token.deploy(ethers.parseEther("1000"));
    await token.waitForDeployment();
  });

  it("mints initial supply to deployer", async function () {
    expect(await token.totalSupply())
      .to.equal(ethers.parseEther("1000"));
    expect(await token.balanceOf(owner.address))
      .to.equal(ethers.parseEther("1000"));
  });

  it("transfers tokens between accounts", async function () {
    await token.transfer(addr1.address, ethers.parseEther("100"));
    expect(await token.balanceOf(addr1.address))
      .to.equal(ethers.parseEther("100"));
  });

  it("emits Transfer event", async function () {
    await expect(token.transfer(addr1.address, ethers.parseEther("50")))
      .to.emit(token, "Transfer")
      .withArgs(owner.address, addr1.address, ethers.parseEther("50"));
  });

  it("approves and allows transferFrom", async function () {
    // owner approves addr1
    await token.approve(addr1.address, ethers.parseEther("200"));
    expect(await token.allowance(owner.address, addr1.address))
      .to.equal(ethers.parseEther("200"));

    // addr1 transfers on behalf of owner
    await token.connect(addr1).transferFrom(
      owner.address,
      addr2.address,
      ethers.parseEther("150")
    );
    expect(await token.balanceOf(addr2.address))
      .to.equal(ethers.parseEther("150"));
    // remaining allowance 50
    expect(await token.allowance(owner.address, addr1.address))
      .to.equal(ethers.parseEther("50"));
  });

  it("reverts transfer if balance insufficient", async function () {
    await expect(
      token.connect(addr1).transfer(addr2.address, ethers.parseEther("10"))
    ).to.be.reverted;
  });
});