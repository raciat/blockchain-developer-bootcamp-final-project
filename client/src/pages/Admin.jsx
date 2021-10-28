import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Input, Button } from 'antd';
import * as web3Actions from '../actions/web3';

class Admin extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(values) {
    const { supplierAddress, supplierName } = values;
    this.props.addSupplier(supplierAddress, supplierName);
    this.formRef.current.resetFields();
  }
  
  render() {
    const { isAdmin } = this.props;

    if (!isAdmin) { return null; }

    return (
      <div>
        <h2>Admin</h2>

        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={this.handleFormSubmit} ref={this.formRef}>
          <Form.Item label="Supplier address" name="supplierAddress" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Supplier name" name="supplierName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Add Supplier
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

Admin.propTypes = {
  accounts: PropTypes.array,
  isAdmin: PropTypes.bool,
  addSupplier: PropTypes.func,
};

export default connect(
  (state) => ({
    accounts: state.web3.accounts,
    isAdmin: state.web3.isAdmin,
  }),
  (dispatch) => bindActionCreators(web3Actions, dispatch),
)(Admin);
