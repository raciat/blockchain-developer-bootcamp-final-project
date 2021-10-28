import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, Button, Image, Col, Row } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { fromWei } from 'web3-utils';
import { withRouter } from 'react-router-dom';
import * as web3Actions from '../actions/web3';

class Market extends Component {
  constructor(props) {
    super(props);
    const { history } = props;
    this.handleBuy = this.handleBuy.bind(this, history);
  }

  componentDidMount() {
    this.fetchData();
  }
  
  componentDidUpdate(prevProps) {
    if (!prevProps.web3 && this.props.web3) {
      this.fetchData();
    }
  }
  
  fetchData() {
    if (this.props.web3) {
      this.props.getAvailableItems();
    }
  }

  async handleBuy(history, sku, priceWei) {
    await this.props.buyItem(history, sku, priceWei);
    this.props.getMyBalance();
  }

  renderItems(availableItems) {
    if (availableItems.length === 0) { return null; }

    const itemsElements = availableItems.map((item, index) => (
      <Col className="gutter-row" xs={24} sm={12} md={12} lg={8} xl={6} key={index}>
        <Card>
          <Image width={200} height={200} src={item.image} preview={false} />

          <p>
            Name: {item.itemName}<br />
            Price: {item.priceUsd} USD ({Number(fromWei(item.priceWei, 'ether')).toFixed(4)} ETH)<br />
            Supplier: {item.supplierName}<br />
            Weight: {item.caratWeight} ct<br />
            Cut: {item.cut}<br />
            Color: {item.color}<br />
            Clarity: {item.clarity}<br />
          </p>

          <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => this.handleBuy(item.sku, item.priceWei)}>
            Buy
          </Button>
        </Card>
      </Col>
    ));

    return (
      <Row gutter={[16, 24]}>
        {itemsElements}
      </Row>
    );
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
  history: PropTypes.object,
  web3: PropTypes.object,
  availableItems: PropTypes.array,
  getAvailableItems: PropTypes.func,
  buyItem: PropTypes.func,
  getMyBalance: PropTypes.func,
};

export default withRouter(connect(
  (state) => ({ 
    web3: state.web3.web3, 
    availableItems: state.web3.availableItems,
  }),
  (dispatch) => bindActionCreators(web3Actions, dispatch),
)(Market));
