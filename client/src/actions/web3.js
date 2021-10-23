import { message } from 'antd';
import { Buffer } from 'buffer';
import { create } from 'ipfs-http-client';
import { BufferList } from 'bl';
import getWeb3 from '../utils/getWeb3';
import PreciousStoneContract from '../contracts/PreciousStoneToken.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const IPFS_PROJECT_ID = process.env.REACT_APP_IPFS_PROJECT_IT;
const IPFS_PROJECT_SECRET = process.env.REACT_APP_IPFS_PROJECT_SECRET;

const ipfsHeaders = {};
if (IPFS_PROJECT_ID && IPFS_PROJECT_SECRET) {
  ipfsHeaders.authorization = 'Basic ' + Buffer.from(IPFS_PROJECT_ID + ':' + IPFS_PROJECT_SECRET).toString('base64');
}
const ipfsClient = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https', headers: ipfsHeaders });

export const WEB3_ACTION_TYPES = {
  WEB3_CONNECT: 'WEB3_CONNECT',
  WEB3_IS_OWNER: 'WEB3_IS_OWNER',
  WEB3_IS_SUPPLIER: 'WEB3_IS_SUPPLIER',
  WEB3_AVAILABLE_ITEMS: 'WEB3_AVAILABLE_ITEMS',
};

export const setConnection = data => ({
  type: WEB3_ACTION_TYPES.WEB3_CONNECT,
  data,
});

export const setIsOwner = data => ({
  type: WEB3_ACTION_TYPES.WEB3_IS_OWNER,
  data,
});

export const setIsSupplier = data => ({
  type: WEB3_ACTION_TYPES.WEB3_IS_SUPPLIER,
  data,
});

export const setAvailableItems = data => ({
  type: WEB3_ACTION_TYPES.WEB3_AVAILABLE_ITEMS,
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

export function getIsOwner() {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { accounts, contract } = web3;

    try {
      const isOwner = await contract.methods.isOwner(accounts[0]).call();
      dispatch(setIsOwner(isOwner));
    } catch (e) {
      console.error('An error occurred in isOwner()', e);
      message.error('An error occurred while getting info about owner access right');
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

const getFromIPFS = async hashToGet => {
  const content = new BufferList();
  for await (const file of ipfsClient.get(hashToGet)) {
    content.append(file);
  }

  let parsedContent = content.toString();
  parsedContent = parsedContent.slice(parsedContent.indexOf('{'));
  parsedContent = parsedContent.slice(0, parsedContent.indexOf('}') + 1);

  let json = {};
  try {
    json = JSON.parse(parsedContent);
  } catch (e) {}

  return json;
};

export function getAvailableItems() {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { contract } = web3;

    try {
      const availableItems = await contract.methods.getAvailableItems().call();

      const items = [];
      for await (const item of availableItems) {
        const { ipfsHash, price, tokenId, supplier } = item;
        const ipfsData = await getFromIPFS(ipfsHash);
        const itemData = { ipfsHash, price, tokenId, supplierName: supplier.supplierName, ...ipfsData };
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

export function addItem(itemName, color, clarity, cut, caratWeight, price) {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { accounts, contract } = web3;

    const metaData = {
      itemName, color, clarity, cut, caratWeight, price,
    };
    const ipfsResult = await ipfsClient.add(JSON.stringify(metaData));
    if (!ipfsResult || !ipfsResult.path) {
      console.error('An error occurred in addItem() while uploading to IPFS');
      message.error('An error occurred while uploading to IPFS');
      return;
    }

    try {
      await contract.methods
        .addItem(ipfsResult.path, price)
        .send({ from: accounts[0] });

      message.success('Item successfully added');
    } catch (e) {
      console.error('An error occurred in addItem()', e);
      message.error('An error occurred while adding an item');
    }
  };
}
