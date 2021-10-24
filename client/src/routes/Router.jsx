import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import * as web3Actions from '../actions/web3';
import Market from '../pages/Market';
import MyTokens from '../pages/MyTokens';
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
      this.props.getIsAdmin();
      this.props.getIsSupplier();
      this.props.getMyBalance();
    }
  }

  render() {
    const { isAdmin, isSupplier, myBalance } = this.props;
    const activeKey = document.location.pathname.substr(1) || 'market';

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[activeKey]} style={{ display: 'flex', justifyContent: 'center' }}>
          <Item key="market">
            <span>Market</span>
            <Link to="/market" />
          </Item>
          {(!!myBalance && myBalance > 0) && (<Item key="my-tokens">
            <span>My Tokens</span>
            <Link to="/my-tokens" />
          </Item>)}
          {isSupplier && (<Item key="supplier">
            <span>Supplier</span>
            <Link to="/supplier" />
          </Item>)}
          {isAdmin && (<Item key="admin">
            <span>Admin</span>
            <Link to="/admin" />
          </Item>)}
        </Menu>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Route exact path="/" component={Market} />
          <Route path="/market" component={Market} />
          <Route path="/my-tokens" component={MyTokens} />
          <Route path="/supplier" component={Supplier} />
          <Route path="/admin" component={Admin} />
        </Content>
      </Layout>
    );
  }
}

Router.propTypes = {
  web3: PropTypes.object,
  isAdmin: PropTypes.bool,
  isSupplier: PropTypes.bool,
  myBalance: PropTypes.number,
  getConnection: PropTypes.func,
  getIsAdmin: PropTypes.func,
  getIsSupplier: PropTypes.func,
  getMyBalance: PropTypes.func,
};

export default connect(
  (state) => ({
    web3: state.web3.web3,
    isAdmin: state.web3.isAdmin,
    isSupplier: state.web3.isSupplier,
    myBalance: state.web3.myBalance,
  }),
  (dispatch) => bindActionCreators(web3Actions, dispatch),
)(Router);
