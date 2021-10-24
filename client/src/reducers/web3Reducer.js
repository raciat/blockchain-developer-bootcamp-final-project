import { WEB3_ACTION_TYPES } from '../actions/web3';

export default function web3(state = {}, action = {}) {
  switch (action.type) {
    case WEB3_ACTION_TYPES.WEB3_CONNECT:
      return { ...state, ...action.data };
    case WEB3_ACTION_TYPES.WEB3_IS_ADMIN:
      return { ...state, isAdmin: action.data };
    case WEB3_ACTION_TYPES.WEB3_IS_SUPPLIER:
      return { ...state, isSupplier: action.data };
    case WEB3_ACTION_TYPES.WEB3_MY_BALANCE:
      return { ...state, myBalance: action.data };
    case WEB3_ACTION_TYPES.WEB3_AVAILABLE_ITEMS:
      return { ...state, availableItems: action.data };
    case WEB3_ACTION_TYPES.WEB3_MY_TOKENS:
      return { ...state, myTokens: action.data };
    default:
      return state;
  }
}
