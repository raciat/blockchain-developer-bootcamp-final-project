import React, { Component } from 'react';
import PreciousStoneContract from '../contracts/PreciousStoneToken.json';
import getWeb3 from '../utils/getWeb3';

import './App.css';

class App extends Component {
  state = { txHash: null, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PreciousStoneContract.networks[networkId];
      const instance = new web3.eth.Contract(PreciousStoneContract.abi, deployedNetwork && deployedNetwork.address);

      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };
  
  mintNft = async () => {
    const { web3, accounts, contract } = this.state;

    const nonce = await web3.eth.getTransactionCount(accounts[0]);

    const response = await contract.methods.safeMint(accounts[0], nonce).send({ from: accounts[0] });

    this.setState({ txHash: response.transactionHash });
  }

  render() {
    const { web3, txHash } = this.state;
    
    if (!web3) { return <div className="App"><h1>Loading...</h1></div>; }
    
    return (
      <div className="App">
        <h1>Precious Stones Mint</h1>
        {txHash && (
          <div>
            You successfully minted a token!<br />
            Transaction hash: {txHash}<br /><br />
          </div>
        )}
        
        <div>
          <button onClick={this.mintNft.bind(this)}>Mint NFT</button>
        </div>
      </div>
    );
  }
}

export default App;
