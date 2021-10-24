import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MyTokens from './MyTokens';

const mockStore = configureStore([thunk]);

describe('pages/MyTokens', () => {
  test('should render without crashing', () => {
    const store = mockStore({ web3: { myBalance: 0, myTokens: [] } });
    const page = shallow(<MyTokens store={store} />).dive().dive();

    expect(page.find('div').length).toEqual(1);
  });
});
