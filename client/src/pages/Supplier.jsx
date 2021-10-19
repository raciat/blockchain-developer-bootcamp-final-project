import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Input, Button, Select } from 'antd';
import * as web3Actions from '../actions/web3';
import { COLOR, CLARITY } from '../utils/static';

const { Option } = Select;

class Supplier extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  handleFormSubmit(values) {
    const { color, clarity, cut, caratWeight, price } = values;
    this.props.addItem(color, clarity, cut, caratWeight, price);
    this.formRef.current.resetFields();
  }

  render() {
    const { isSupplier } = this.props;

    if (!isSupplier) { return null; }

    return (
      <div>
        <h2>Supplier</h2>

        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={this.handleFormSubmit} ref={this.formRef}>
          <Form.Item label="Color" name="color" rules={[{ required: true }]}>
            <Select>
              {COLOR.map((value, index) => (
                <Option key={index} value={index}>{value}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Clarity" name="clarity" rules={[{ required: true }]}>
            <Select>
              {CLARITY.map((value, index) => (
                <Option key={index} value={index}>{value}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Cut" name="cut" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Carat Weight" name="caratWeight" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Add Item
            </Button>
          </Form.Item>
        </Form>
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
