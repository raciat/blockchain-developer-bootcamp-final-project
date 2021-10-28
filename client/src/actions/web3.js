import { message } from 'antd';
import { toWei } from 'web3-utils';
import getWeb3 from '../utils/getWeb3';
import { ipfsClient, getFromIPFS } from '../utils/ipfsClient';
import PreciousStoneContract from '../contracts/PreciousStoneToken.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

export const WEB3_ACTION_TYPES = {
  WEB3_CONNECT: 'WEB3_CONNECT',
  WEB3_IS_ADMIN: 'WEB3_IS_ADMIN',
  WEB3_IS_SUPPLIER: 'WEB3_IS_SUPPLIER',
  WEB3_MY_BALANCE: 'WEB3_MY_BALANCE',
  WEB3_AVAILABLE_ITEMS: 'WEB3_AVAILABLE_ITEMS',
  WEB3_MY_TOKENS: 'WEB3_MY_TOKENS',
};

export const setConnection = data => ({
  type: WEB3_ACTION_TYPES.WEB3_CONNECT,
  data,
});

export const setIsAdmin = data => ({
  type: WEB3_ACTION_TYPES.WEB3_IS_ADMIN,
  data,
});

export const setIsSupplier = data => ({
  type: WEB3_ACTION_TYPES.WEB3_IS_SUPPLIER,
  data,
});

export const setMyBalance = data => ({
  type: WEB3_ACTION_TYPES.WEB3_MY_BALANCE,
  data,
});

export const setAvailableItems = data => ({
  type: WEB3_ACTION_TYPES.WEB3_AVAILABLE_ITEMS,
  data,
});

export const setMyTokens = data => ({
  type: WEB3_ACTION_TYPES.WEB3_MY_TOKENS,
  data,
});

export function getConnection() {
  return async (dispatch) => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PreciousStoneContract.networks[networkId] || PreciousStoneContract.networks[5777];
      const contractAddress = CONTRACT_ADDRESS ? CONTRACT_ADDRESS : deployedNetwork && deployedNetwork.address;
      const instance = new web3.eth.Contract(PreciousStoneContract.abi, contractAddress);

      dispatch(setConnection({ web3, accounts, contract: instance }));
    } catch (e) {
      console.error('Failed to load web3, accounts, or contract', e);
      message.error('Failed to load web3, accounts, or contract - check console for details');
    }
  };
}

export function getIsAdmin() {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { accounts, contract } = web3;

    try {
      const isAdmin = await contract.methods.isAdmin(accounts[0]).call();
      dispatch(setIsAdmin(isAdmin));
    } catch (e) {
      console.error('An error occurred in isAdmin()', e);
      message.error('An error occurred while getting info about admin access right');
    }
  };
}

export function getIsSupplier() {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { accounts, contract } = web3;

    try {
      const isSupplier = await contract.methods.isSupplier(accounts[0]).call();
      dispatch(setIsSupplier(isSupplier));
    } catch (e) {
      console.error('An error occurred in isSupplier()', e);
      message.error('An error occurred while getting info about supplier access right');
    }
  };
}

export function getMyBalance() {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { accounts, contract } = web3;

    try {
      const myBalance = await contract.methods.balanceOf(accounts[0]).call();
      dispatch(setMyBalance(parseInt(myBalance, 10)));
    } catch (e) {
      console.error('An error occurred in getMyBalance()', e);
      message.error('An error occurred while getting info about balance');
    }
  };
}

export function getAvailableItems() {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { contract } = web3;

    try {
      const availableItems = await contract.methods.getAvailableItems().call();

      const items = [];
      for await (const item of availableItems) {
        const { sku, ipfsHash, priceUsd, priceWei, tokenId, supplier } = item;
        if (!ipfsHash) { continue; }
        const ipfsData = await getFromIPFS(ipfsHash);
        const itemData = {
          sku, ipfsHash, priceUsd, priceWei, tokenId, supplierName: supplier.supplierName,
          ...ipfsData, image: 'https://ipfs.io/ipfs/' + ipfsData.image,
        };
        items.push(itemData);
      }

      dispatch(setAvailableItems(items));
    } catch (e) {
      console.error('An error occurred in getAvailableItems()', e);
      message.error('An error occurred while fetching list of available items');
    }
  };
}

export function addSupplier(supplierAddress, supplierName) {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { accounts, contract } = web3;

    try {
      await contract.methods
        .addSupplier(supplierAddress, supplierName)
        .send({ from: accounts[0] });

      message.success('Supplier successfully added');
    } catch (e) {
      console.error('An error occurred in addSupplier()', e);
      message.error('An error occurred while adding a supplier');
    }
  };
}

export function addItem(history, itemName, color, clarity, cut, caratWeight, priceUsd, image) {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { accounts, contract } = web3;

    const metaData = { itemName, color, clarity, cut, caratWeight, image };
    const ipfsResult = await ipfsClient.add(JSON.stringify(metaData));
    if (!ipfsResult || !ipfsResult.path) {
      console.error('An error occurred in addItem() while uploading to IPFS');
      message.error('An error occurred while uploading to IPFS');
      return;
    }
    console.log('Metadata successfully uploaded to IPFS', ipfsResult.path);

    try {
      await contract.methods
        .addItem(ipfsResult.path, priceUsd)
        .send({ from: accounts[0] });

      await history.push('/market');
      console.log('Item successfully added');
      message.success('Item successfully added');
    } catch (e) {
      console.error('An error occurred in addItem()', e);
      message.error('An error occurred while adding an item');
    }
  };
}

export function buyItem(history, sku, priceWei) {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { accounts, contract } = web3;

    try {
      await contract.methods
        .buyItem(sku)
        .send({ from: accounts[0], value: toWei(priceWei, 'wei') });

      await history.push('/my-tokens');
      message.success('Item successfully purchased');
    } catch (e) {
      console.error('An error occurred in buyItem()', e);
      message.error('An error occurred while purchasing an item');
    }
  };
}

export function getMyTokens(balance) {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { accounts, contract } = web3;
    const tokens = [];

    try {
      for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(accounts[0], tokenIndex).call();
        const tokenURI = await contract.methods.tokenURI(tokenId).call();
        const ipfsHash = tokenURI.replace('https://ipfs.io/ipfs/', '');
        const ipfsData = await getFromIPFS(ipfsHash);

        tokens.push({ ...ipfsData, image: 'https://ipfs.io/ipfs/' + ipfsData.image, tokenId });
      }

      dispatch(setMyTokens(tokens));
    } catch (e) {
      console.error('An error occurred in getMyTokens()', e);
      message.error('An error occurred while fetching list of your tokens');
    }
  };
}

export function transferToken(ethAddress, tokenId) {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { accounts, contract } = web3;

    try {
      await contract.methods
        .transferFrom(accounts[0], ethAddress, tokenId)
        .send({ from: accounts[0] });

      message.success('Token successfully transferred');
    } catch (e) {
      console.error('An error occurred in transferToken()', e);
      message.error('An error occurred while transferring a token');
    }
  };
}
