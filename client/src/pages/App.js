import React, { Component } from 'react';
import PreciousStoneContract from '../contracts/PreciousStoneToken.json';
import getWeb3 from '../utils/getWeb3';

import './App.css';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

class App extends Component {
  state = { txHash: null, web3: null, accounts: null, contract: null, isOwner: false, isSupplier: false };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PreciousStoneContract.networks[networkId] || PreciousStoneContract.networks[5777];
      const contractAddress = CONTRACT_ADDRESS ? CONTRACT_ADDRESS : deployedNetwork && deployedNetwork.address;
      const instance = new web3.eth.Contract(PreciousStoneContract.abi, contractAddress);

      this.setState({ web3, accounts, contract: instance, items: [] }, this.fetchData);
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };
  
  fetchData = async () => {
    await this.isOwner();
    await this.isSupplier();
    await this.getAvailableGems();
  }

  isOwner = async () => {
    const { accounts, contract } = this.state;
    const isOwner = await contract.methods.isOwner(accounts[0]).call();
    this.setState({ isOwner });
    return isOwner;
  }

  isSupplier = async () => {
    const { accounts, contract } = this.state;
    const isSupplier = await contract.methods.isSupplier(accounts[0]).call();
    this.setState({ isSupplier });
    return isSupplier;
  }
  
  addSupplier = async () => {
    const { accounts, contract } = this.state;
    await contract.methods.addSupplier(accounts[0], 'Supplier 1').send({ from: accounts[0] });
  }
  
  addItem = async () => {
    const { accounts, contract } = this.state;
    await contract.methods.addItem(0, 0, 'diamond', 2, 10000).send({ from: accounts[0] });
  }
  
  getAvailableGems = async () => {
    const { contract } = this.state;
    const availableGems = await contract.methods.getAvailableItems().call();
    this.setState({ items: availableGems });
  }
  
  mintNft = async () => {
    const { web3, accounts, contract } = this.state;
    const nonce = await web3.eth.getTransactionCount(accounts[0]);
    const response = await contract.methods.safeMint(accounts[0], nonce).send({ from: accounts[0] });
    this.setState({ txHash: response.transactionHash });
  }
  
  renderItems() {
    const { items } = this.state;

    if (items.length === 0) { return null; }
    
    const itemsElements = items.map((item, index) => (
      <li key={index} style={{ width: '20%', float: 'left' }}>
        Price: {item.price}<br />
        Supplier: {item.supplier.supplierName}<br />
        Weight (carat): {item.gem.caratWeight}<br />
        Cut: {item.gem.cut}<br />
      </li>
    ));
    
    return <ul style={{ marginTop: '50px' }}>{itemsElements}</ul>;
  }

  render() {
    const { web3, txHash, isOwner, isSupplier } = this.state;
    
    if (!web3) { return <div className="App"><h1>Loading...</h1></div>; }
    
    return (
      <div className="App">
        <h1>Precious Stones Mint</h1>
        
        <div>
          Welcome {isOwner ? 'Owner' : isSupplier ? 'Supplier' : 'User'}
        </div>
        
        {txHash && (
          <div>
            You successfully minted a token!<br />
            Transaction hash: {txHash}<br /><br />
          </div>
        )}
        
        <div>
          <button onClick={this.mintNft.bind(this)}>Mint NFT</button>
        </div>

        {this.renderItems()}
      </div>
    );
  }
}

export default App;
