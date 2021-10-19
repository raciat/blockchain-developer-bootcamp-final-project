import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from 'antd';
import * as web3Actions from '../actions/web3';
import { COLOR, CLARITY } from '../utils/static';

class Market extends Component {
  componentDidMount() {
    this.fetchData();
  }
  
  componentDidUpdate (prevProps) {
    if (!prevProps.web3 && this.props.web3) {
      this.fetchData();
    }
  }
  
  fetchData() {
    if (this.props.web3) {
      this.props.getAvailableItems();
    }
  }

  renderItems(availableItems) {
    if (availableItems.length === 0) { return null; }

    const itemsElements = availableItems.map((item, index) => (
      <Card key={index} style={{ width: '20%', float: 'left' }}>
        Price: {item.price}<br />
        Supplier: {item.supplier.supplierName}<br />
        Weight (carat): {item.gem.caratWeight}<br />
        Cut: {item.gem.cut}<br />
        Color: {COLOR[item.gem.color]}<br />
        Clarity: {CLARITY[item.gem.clarity]}<br />
      </Card>
    ));

    return <ul style={{ marginTop: '50px' }}>{itemsElements}</ul>;
  }

  render() {
    const { availableItems } = this.props;
    
    return (
      <div>
        <h2>Market</h2>
        {availableItems && availableItems.length > 0 && this.renderItems(availableItems)}
      </div>
    );
  }
}

Market.propTypes = {
  web3: PropTypes.object,
  availableItems: PropTypes.array,
  getAvailableItems: PropTypes.func,
};

export default connect(
  (state) => ({ 
    web3: state.web3.web3, 
    availableItems: state.web3.availableItems,
  }),
  (dispatch) => bindActionCreators(web3Actions, dispatch),
)(Market);
