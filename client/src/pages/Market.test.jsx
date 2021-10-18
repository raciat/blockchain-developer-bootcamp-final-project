import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Market from './Market';

const mockStore = configureStore([thunk]);

describe('pages/Market', () => {
  test('should render without crashing', () => {
    const store = mockStore({ web3: { availableItems: [] } });
    const page = shallow(<Market store={store} />).dive().dive();

    expect(page.find('div').length).toEqual(1);
  });
});
