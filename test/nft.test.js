const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Week4NFT", function () {
  let NFT, nft, owner, addr1;

  beforeEach(async function () {
    NFT = await ethers.getContractFactory("Week4NFT");
    [owner, addr1] = await ethers.getSigners();
    nft = await NFT.deploy();
    await nft.waitForDeployment();
  });

  it("mints NFT and sets tokenURI", async function () {
    const tx = await nft.safeMint(owner.address, "ipfs://QmExample/1.json");
    await tx.wait();
    expect(await nft.ownerOf(0)).to.equal(owner.address);
    expect(await nft.tokenURI(0))
      .to.equal("ipfs://QmExample/1.json");
  });

  it("transfers NFT to another account", async function () {
    await nft.safeMint(owner.address, "ipfs://QmExample/2.json");
    await nft["safeTransferFrom(address,address,uint256)"](
      owner.address,
      addr1.address,
      0
    );
    expect(await nft.ownerOf(0)).to.equal(addr1.address);
  });
});