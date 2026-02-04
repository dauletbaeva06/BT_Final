const TOKEN_ADDRESS = "0x0165878a594ca255338adfa4d48449f69242eb8f";

let provider, signer, tokenContract;

const connectBtn = document.getElementById("connectBtn");
const accountSpan = document.getElementById("account");
const balanceSpan = document.getElementById("balance");

connectBtn.onclick = async () => {
  if (!window.ethereum) {
    alert("Установите MetaMask");
    return;
  }
  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  const userAddress = await signer.getAddress();
  accountSpan.textContent = userAddress;

  tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);

  await updateBalance();
};

async function updateBalance() {
  const userAddr = accountSpan.textContent;
  const balance = await tokenContract.balanceOf(userAddr);
  balanceSpan.textContent = ethers.formatUnits(balance, 18);
}