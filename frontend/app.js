const TOKEN_ADDRESS = "0x0165878a594ca255338adfa4d48449f69242eb8f";
const NFT_ADDRESS = "0x0000000000000000000000000000000000000000"; 

let provider, signer, tokenContract, nftContract;

const connectBtn = document.getElementById("connectBtn");
const accountSpan = document.getElementById("account");
const balanceSpan = document.getElementById("balance");
const networkSpan = document.getElementById("network");
const statusText = document.getElementById("status");

const petNameInput = document.getElementById("petName");
const goalInput = document.getElementById("goal");
const durationInput = document.getElementById("duration");
const createBtn = document.getElementById("createBtn");

// 1. ПОДКЛЮЧЕНИЕ КОШЕЛЬКА
connectBtn.onclick = async () => {
    if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
    }

    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        
        const userAddress = await signer.getAddress();
        const network = await provider.getNetwork();

        accountSpan.textContent = `${userAddress.substring(0, 6)}...${userAddress.substring(38)}`;
        networkSpan.textContent = network.name;
        connectBtn.textContent = "CONNECTED";
        connectBtn.style.background = "#ffffff";

        tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
        nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);

        await updateBalance();
        updateStatus("Connected to MetaMask");
    } catch (error) {
        console.error(error);
        updateStatus("Connection failed");
    }
};

async function updateBalance() {
    try {
        const userAddr = await signer.getAddress();
        const balance = await tokenContract.balanceOf(userAddr);
        balanceSpan.textContent = ethers.formatUnits(balance, 18);
    } catch (err) {
        console.error("Balance update failed", err);
    }
}

createBtn.onclick = async () => {
    if (!nftContract) return alert("Connect wallet first!");

    const name = petNameInput.value;
    const goal = goalInput.value;
    const days = durationInput.value;

    if (!name || !goal || !days) return alert("Fill all fields");

    try {
        updateStatus("Pending transaction...");
        
        // Переводим ETH в Wei и дни в секунды
        const goalWei = ethers.parseEther(goal);
        const durationSec = parseInt(days) * 86400;

        const tx = await nftContract.createPetCampaign(name, goalWei, durationSec);
        
        updateStatus("Transaction sent! Waiting for block...");
        await tx.wait();
        
        updateStatus(`Success! Campaign "${name}" created.`);
        clearForm();
    } catch (error) {
        console.error(error);
        updateStatus("Transaction failed: " + error.reason);
    }
};

const searchInput = document.getElementById("searchInput");
searchInput.oninput = () => {
    const query = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".pet-card");

    cards.forEach(card => {
        const name = card.querySelector("h3").textContent.toLowerCase();
        const rarity = card.querySelector(".rarity").textContent.toLowerCase();
        
        if (name.includes(query) || rarity.includes(query)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
};

function updateStatus(msg) {
    if (statusText) statusText.textContent = msg;
}

function clearForm() {
    petNameInput.value = "";
    goalInput.value = "";
    durationInput.value = "";
}

if (window.ethereum) {
    window.ethereum.on('accountsChanged', () => window.location.reload());
    window.ethereum.on('chainChanged', () => window.location.reload());
}