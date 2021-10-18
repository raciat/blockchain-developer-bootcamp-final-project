import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  /* eslint-disable no-underscore-dangle */
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__;
  const enhancer = (!devTools) ? applyMiddleware(thunk)
    : compose(applyMiddleware(thunk), devTools({ name: 'Precious Stones Mint' }));

  const store = createStore(rootReducer, initialState, enhancer);
  return { store };
}
