import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'antd';
import * as web3Actions from '../actions/web3';

class Supplier extends Component {
  handleAddItem() {
    this.props.addItem(0, 0, 'diamond', 2, 10000);
  }

  render() {
    const { isSupplier } = this.props;

    if (!isSupplier) { return null; }

    return (
      <div>
        <h2>Supplier</h2>
        <Button onClick={this.handleAddItem.bind(this)}>Add Item</Button>
      </div>
    );
  }
}

Supplier.propTypes = {
  isSupplier: PropTypes.bool,
  addItem: PropTypes.func,
};

export default connect(
  (state) => ({ 
    isSupplier: state.web3.isSupplier,
  }),
  (dispatch) => bindActionCreators(web3Actions, dispatch),
)(Supplier);
