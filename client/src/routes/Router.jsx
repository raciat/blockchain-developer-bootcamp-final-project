import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import * as web3Actions from '../actions/web3';
import Market from '../pages/Market';
import Supplier from '../pages/Supplier';
import Admin from '../pages/Admin';

const { Content } = Layout;
const { Item } = Menu;

class Router extends Component {
  componentDidMount() {
    this.props.getConnection();
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.web3 && this.props.web3) {
      this.fetchData();
    }
  }

  fetchData() {
    if (this.props.web3) {
      this.props.getIsOwner();
      this.props.getIsSupplier();
    }
  }

  render() {
    const { isOwner, isSupplier } = this.props;
    
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Menu theme="dark" mode="horizontal" style={{ display: 'flex', justifyContent: 'center' }}>
          <Item key="market">
            <span>Market</span>
            <Link to='/market' />
          </Item>
          {isSupplier && (<Item key="supplier">
            <span>Supplier</span>
            <Link to='/supplier' />
          </Item>)}
          {isOwner && (<Item key="admin">
            <span>Admin</span>
            <Link to='/admin' />
          </Item>)}
        </Menu>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Route path="/market" component={Market} />
          <Route exact path="/supplier" component={Supplier} />
          <Route exact path="/admin" component={Admin} />
        </Content>
      </Layout>
    );
  }
}

Router.propTypes = {
  web3: PropTypes.object,
  isOwner: PropTypes.bool,
  isSupplier: PropTypes.bool,
  getConnection: PropTypes.func,
  getIsOwner: PropTypes.func,
  getIsSupplier: PropTypes.func,
};

export default connect(
  (state) => ({
    web3: state.web3.web3,
    isOwner: state.web3.isOwner, 
    isSupplier: state.web3.isSupplier,
  }),
  (dispatch) => bindActionCreators(web3Actions, dispatch),
)(Router);
