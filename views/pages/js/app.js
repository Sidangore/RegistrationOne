// const Web3 = require('web3');
App = {
    web3_provider: null,
    account: '0x0',
    message: '0x0',
    signature: '0x0',
    nonce: 12345,

    //functions
    init: () => {
        return App.init_web3();
    },

    init_web3: async() => {
        if (typeof window.ethereum !== 'undefined') {
            //metamask is installed


        } else {
            // metamast is not installed
            document.getElementById("fetch_metamask_button").innerHTML = "Install Metamask";
            alert('MetaMask not installed!');
        }
    },

    fetch_account: async() => {
        const public_address = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // console.log(public_address);
        document.getElementById("public_address").value = public_address;
    }
};


window.onload = () => {
    App.init();
}