// Константы (проверь адрес NFT в DEPLOYMENT.md)
const TOKEN_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Week4Token
const NFT_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";   // Week4NFT

let provider, signer, tokenContract, nftContract;

const connectBtn = document.getElementById("connectBtn");
const balanceSpan = document.getElementById("balance");
const accountSpan = document.getElementById("account"); 

const petNameInput = document.getElementById("petName");
const goalInput = document.getElementById("goal");
const durationInput = document.getElementById("duration");
const createBtn = document.getElementById("createBtn");

// 1.CONNECTS WALLET
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

        connectBtn.textContent = `${userAddress.substring(0, 4)}...${userAddress.substring(38)}`;
        connectBtn.style.background = "#ffffff";
        connectBtn.style.color = "#000000";

        tokenContract = new ethers.Contract(TOKEN_ADDRESS, window.TOKEN_ABI, signer);
        nftContract = new ethers.Contract(NFT_ADDRESS, window.NFT_ABI, signer);

        await updateBalance();
        console.log("Connected successfully");
    } catch (error) {
        console.error("Connection failed", error);
    }
};

// 2.UPDATES PBT
async function updateBalance() {
    try {
        const userAddr = await signer.getAddress();
        const balance = await tokenContract.balanceOf(userAddr);
        balanceSpan.textContent = parseFloat(ethers.formatUnits(balance, 18)).toFixed(2);
    } catch (err) {
        console.error("Balance update failed", err);
    }
}

// 3.(SERVICES)
if (createBtn) {
    createBtn.onclick = async () => {
        if (!nftContract) return alert("Please connect wallet first!");

        const name = petNameInput.value;
        const goal = goalInput.value;
        const days = durationInput.value;

        if (!name || !goal || !days) return alert("Please fill all fields");

        try {
            const goalWei = ethers.parseEther(goal);
            const durationSec = parseInt(days) * 86400;

            const tx = await nftContract.createPetCampaign(name, goalWei, durationSec);
            alert("Transaction sent! Waiting for confirmation...");
            
            await tx.wait();
            alert(`Success! Campaign for "${name}" is live.`);
            
            petNameInput.value = "";
            goalInput.value = "";
            durationInput.value = "";
            
            await updateBalance();
        } catch (error) {
            console.error(error);
            alert("Error: " + (error.reason || "Transaction failed"));
        }
    };
}

// 4.(SEARCH BAR)
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.oninput = () => {
        const query = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll(".pet-card");

        cards.forEach(card => {
            const name = card.querySelector("h3").textContent.toLowerCase();
            const rarity = card.querySelector(".rarity") ? card.querySelector(".rarity").textContent.toLowerCase() : "";
            
            card.style.display = (name.includes(query) || rarity.includes(query)) ? "block" : "none";
        });
    };
}

document.getElementById("sendSupportBtn").onclick = () => {
    const subject = document.getElementById("supportSubject").value;
    const message = document.getElementById("supportMessage").value;

    if (!subject || !message) {
        alert("Please fill in both the subject and your question.");
        return;
    }

    console.log("Support Ticket Sent:", { subject, message });
    alert("Your message has been received! We will get back to you soon.");
    
    document.getElementById("supportSubject").value = "";
    document.getElementById("supportMessage").value = "";
}; 

if (window.ethereum) {
    window.ethereum.on('accountsChanged', () => window.location.reload());
    window.ethereum.on('chainChanged', () => window.location.reload());
}