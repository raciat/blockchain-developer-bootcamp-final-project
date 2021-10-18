import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'antd';
import * as web3Actions from '../actions/web3';

class Admin extends Component {
  handleAddSupplier() {
    this.props.addSupplier(this.props.accounts[0], 'Supplier 1');
  }
  
  render() {
    const { isOwner } = this.props;
    
    if (!isOwner) { return null; }

    return (
      <div>
        <h2>Admin</h2>
        <Button onClick={this.handleAddSupplier.bind(this)}>Add Supplier</Button>
      </div>
    );
  }
}

Admin.propTypes = {
  accounts: PropTypes.array,
  isOwner: PropTypes.bool,
  addSupplier: PropTypes.func,
};

export default connect(
  (state) => ({
    accounts: state.web3.accounts,
    isOwner: state.web3.isOwner,
  }),
  (dispatch) => bindActionCreators(web3Actions, dispatch),
)(Admin);
