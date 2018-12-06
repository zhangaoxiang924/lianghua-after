import React, {Component} from 'react'
import { Modal, Form, Input, Radio } from 'antd'
const FormItem = Form.Item

class CollectionCreateForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            description: '',
            loading: true,
            userType: '1'
        }
    }

    render () {
        const { visible, onCancel, onCreate, form, loading } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18, offset: 1}
        }
        return (
            <Modal
                visible={visible}
                title="绑定账号"
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
                confirmLoading={loading}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        className="collection-create-form_last-form-item"
                        label="选择交易所"
                    >
                        {getFieldDecorator('market', {
                            initialValue: '',
                            rules: [{ required: true, message: '请选择一个交易所！' }]
                        })(
                            <Radio.Group>
                                <Radio value="okex">OKEx</Radio>
                                <Radio value="bitmex">BitMEX</Radio>
                                <Radio value="bitfinex">BitFinex</Radio>
                                <Radio value="jex">JEx</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="API Key">
                        {getFieldDecorator('key', {
                            initialValue: '',
                            rules: [{ required: true, message: '请输入账号的API Key！' }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Secret Key">
                        {getFieldDecorator('secret', {
                            initialValue: '',
                            rules: [{ required: true, message: '请输入账号的Secret Key！' }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Passphrase">
                        {getFieldDecorator('passphrase', {
                            initialValue: '',
                            rules: [{ required: true, message: '请输入账号的Passphrase！' }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CollectionCreateForm)
