import getWeb3 from '../utils/getWeb3';
import PreciousStoneContract from '../contracts/PreciousStoneToken.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

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
    } catch (error) {
      console.error('Failed to load web3, accounts, or contract. Check console for details.', error);
    }
  };
}

export function getIsOwner() {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { accounts, contract } = web3;
    const isOwner = await contract.methods.isOwner(accounts[0]).call();
    dispatch(setIsOwner(isOwner));
  };
}

export function getIsSupplier() {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { accounts, contract } = web3;
    const isSupplier = await contract.methods.isSupplier(accounts[0]).call();
    dispatch(setIsSupplier(isSupplier));
  };
}

export function getAvailableItems() {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { contract } = web3;
    const availableItems = await contract.methods.getAvailableItems().call();
    dispatch(setAvailableItems(availableItems));
  };
}

export function addSupplier(supplierAddress, supplierName) {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { accounts, contract } = web3;
    await contract.methods
      .addSupplier(supplierAddress, supplierName)
      .send({ from: accounts[0] });
  };
}

export function addItem(color, clarity, cut, caratWeight, price) {
  return async (dispatch, getState) => {
    const web3 = getState().web3;
    const { accounts, contract } = web3;
    await contract.methods
      .addItem(color, clarity, cut, caratWeight, price)
      .send({ from: accounts[0] });
  };
}
