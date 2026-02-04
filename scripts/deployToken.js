import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createPublicClient, createWalletClient, http, parseUnits } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// читаем артефакт hardhat (ABI + bytecode)
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

  // путь артефакта может отличаться регистром файла: Week4token.sol
  const artifact = readArtifact("artifacts/contracts/Week4token.sol/Week4Token.json");

  const initialSupply = parseUnits("1000000", 18); // 1,000,000 токенов

  const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    args: [initialSupply],
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  console.log("Deploy tx:", hash);
  console.log("Week4Token deployed to:", receipt.contractAddress);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});