// const Web3 = require('web3');
App = {
    web3_provider: null,
    account: '',
    message: '',
    signature: '',
    nonce: '12345',

    //functions
    init: () => {
        return App.init_web3();
    },

    init_web3: async() => {
        if (typeof window.ethereum !== 'undefined') {
            //metamask is installed
            //get the account
            account = await window.ethereum.request({ method: 'eth_requestAccounts' });
            App.web3_provider = window.ethereum
            web3 = new Web3(window.ethereum);

        } else {
            // metamast is not installed
            document.getElementById("fetch_metamask_button").innerHTML = "Install Metamask";
            alert('MetaMask not installed!');
        }
    },

    fetch_account: async() => {
        //get the public address 
        // const public_address = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // console.log(public_address);
        document.getElementById("public_address").value = account;
    },

    sign_message_metamask: async() => {
        const message = `This is to authenticate myself to the portal with Nonce: ${App.nonce}`;
        console.log(message + " to sign up");
        //sign the message
        const signature = await ethereum.request({ method: "personal_sign", params: [message, ethereum.selectedAddress, ""] });
        document.getElementById("signature").innerHTML = "Signature:" +
            signature;

    },
};


window.onload = () => {
    App.init();
}