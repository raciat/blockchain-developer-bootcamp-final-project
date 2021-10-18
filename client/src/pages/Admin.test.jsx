import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Admin from './Admin';

const mockStore = configureStore([thunk]);

describe('pages/Admin', () => {
  test('should render without crashing', () => {
    const store = mockStore({ web3: { isOwner: true } });
    const page = shallow(<Admin store={store} />).dive().dive();

    expect(page.find('div').length).toEqual(1);
  });
});
