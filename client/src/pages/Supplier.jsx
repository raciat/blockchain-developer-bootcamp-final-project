import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Input, Button, Select } from 'antd';
import * as web3Actions from '../actions/web3';
import { COLOR, CLARITY } from '../utils/static';
import { ipfsClient } from '../utils/ipfsClient';

const { Option } = Select;

class Supplier extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = { ipfsImage: null };

    this.uploadImageIPFS = this.uploadImageIPFS.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  componentWillUnmount() {
    this.setState({ ipfsImage: null, uploading: false });
  }

  async uploadImageIPFS(event) {
    event.preventDefault();
    this.setState({ uploading: true });

    const file = event.target.files[0];
    try {
      const ipfsImage = await ipfsClient.add(file);
      if (!ipfsImage || !ipfsImage.path) {
        console.error('An error occurred in uploadImageIPFS() while uploading image to IPFS');
      }

      console.log('Image successfully uploaded to IPFS', ipfsImage.path);
      this.setState({ ipfsImage: ipfsImage.path, uploading: false });
    } catch (error) {
      console.error('An error occurred in uploadImageIPFS() while uploading image to IPFS', error);
    }
  }

  handleFormSubmit(values) {
    const { itemName, color, clarity, cut, caratWeight, price } = values;
    this.props.addItem(itemName, color, clarity, cut, caratWeight, price, this.state.ipfsImage);
    this.formRef.current.resetFields();
    this.setState({ ipfsImage: null, uploading: false });
  }

  render() {
    const { isSupplier } = this.props;
    const { uploading } = this.state;

    if (!isSupplier) { return null; }

    return (
      <div>
        <h2>Supplier</h2>

        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={this.handleFormSubmit} ref={this.formRef}>
          <Form.Item label="Image" name="image" rules={[{ required: true }]}>
            <Input type="file" onChange={this.uploadImageIPFS} />
          </Form.Item>
          <Form.Item label="Name" name="itemName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Color" name="color" rules={[{ required: true }]}>
            <Select>
              {COLOR.map((value, index) => (
                <Option key={index} value={value}>{value}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Clarity" name="clarity" rules={[{ required: true }]}>
            <Select>
              {CLARITY.map((value, index) => (
                <Option key={index} value={value}>{value}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Cut" name="cut" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Weight [ct]" name="caratWeight" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Price [USD]" name="price" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" disabled={uploading}>
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
