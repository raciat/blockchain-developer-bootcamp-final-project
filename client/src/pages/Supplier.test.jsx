import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Supplier from './Supplier';

const mockStore = configureStore([thunk]);

describe('pages/Supplier', () => {
  test('should render without crashing', () => {
    const store = mockStore({ web3: { isSupplier: true } });
    const page = shallow(<Supplier store={store} />).dive().dive();

    expect(page.find('div').length).toEqual(1);
  });
});
