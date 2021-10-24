import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from 'antd';
import * as web3Actions from '../actions/web3';

class MyTokens extends Component {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if ((!prevProps.web3 && this.props.web3) || (!prevProps.myBalance && this.props.myBalance)) {
      this.fetchData();
    }
  }

  fetchData() {
    if (this.props.web3 && this.props.myBalance && this.props.myBalance > 0) {
      this.props.getMyTokens(this.props.myBalance);
    }
  }

  renderTokens(myTokens) {
    if (myTokens.length === 0) { return null; }

    const tokenElements = myTokens.map((token, index) => (
      <Card key={index} style={{ width: '20%', float: 'left' }}>
        Name: {token.itemName}<br />
        Weight: {token.caratWeight} ct<br />
        Cut: {token.cut}<br />
        Color: {token.color}<br />
        Clarity: {token.clarity}<br />
      </Card>
    ));

    return <ul style={{ marginTop: '50px' }}>{tokenElements}</ul>;
  }

  render() {
    const { myTokens } = this.props;

    return (
      <div>
        <h2>My Tokens</h2>
        {myTokens && myTokens.length > 0 && this.renderTokens(myTokens)}
      </div>
    );
  }
}

MyTokens.propTypes = {
  web3: PropTypes.object,
  myBalance: PropTypes.number,
  myTokens: PropTypes.array,
  getMyTokens: PropTypes.func,
};

export default connect(
  (state) => ({
    web3: state.web3.web3,
    myBalance: state.web3.myBalance,
    myTokens: state.web3.myTokens,
  }),
  (dispatch) => bindActionCreators(web3Actions, dispatch),
)(MyTokens);
