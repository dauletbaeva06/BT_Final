import fs from "node:fs";

function exportAbi(inPath, outPath) {
  const json = JSON.parse(fs.readFileSync(inPath, "utf8"));
  fs.writeFileSync(outPath, JSON.stringify(json.abi, null, 2));
  console.log("Saved:", outPath);
}

exportAbi("./artifacts/contracts/Week4token.sol/Week4Token.json", "./docs/Week4Token.abi.json");
exportAbi("./artifacts/contracts/Week4NFT.sol/Week4NFT.json", "./docs/Week4NFT.abi.json");
