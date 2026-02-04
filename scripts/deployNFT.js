import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createPublicClient, createWalletClient, getContract, http } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readArtifact(relativePath) {
  const p = path.join(__dirname, "..", relativePath);
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

async function main() {
  const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is missing in .env");
  }

  const account = privateKeyToAccount(PRIVATE_KEY);

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(RPC_URL),
  });

  const walletClient = createWalletClient({
    account,
    chain: hardhat,
    transport: http(RPC_URL),
  });

  console.log("Deployer:", account.address);

  const artifact = readArtifact("artifacts/contracts/Week4NFT.sol/Week4NFT.json");

  // deploy
  const deployHash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    args: [],
  });

  const deployReceipt = await publicClient.waitForTransactionReceipt({ hash: deployHash });

  const nftAddress = deployReceipt.contractAddress;
  console.log("Deploy tx:", deployHash);
  console.log("Week4NFT deployed to:", nftAddress);

  // contract instance
  const nft = getContract({
    address: nftAddress,
    abi: artifact.abi,
    client: { public: publicClient, wallet: walletClient },
  });

  const uris = [
    "ipfs://QmExampleToken1/1.json",
    "ipfs://QmExampleToken2/2.json",
    "ipfs://QmExampleToken3/3.json",
  ];

  for (const uri of uris) {
    const hash = await nft.write.mint([account.address, uri]);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Minted:", uri, "tx:", receipt.transactionHash);
  }

  console.log("Done minting 3 NFTs");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});