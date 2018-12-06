import React, {Component} from 'react'
import { Modal, Form, Select, Spin, Input } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

class CollectionCreateForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            data: [],
            value: '',
            description: '',
            loading: true,
            userType: '1',
            searching: false
        }
    }

    handleChange = (value) => {
        this.setState({
            value,
            data: []
        })
    }

    render () {
        const { visible, onCancel, onCreate, form } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 16, offset: 1}
        }
        return (
            <Modal
                visible={visible}
                title="新增新闻主体"
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="主体类型"
                    >
                        {getFieldDecorator('type', {
                            initialValue: this.state.value || '0',
                            rules: [{ required: true, message: '请选择新闻主体！' }]
                        })(
                            <Select
                                notFoundContent={this.state.searching ? <Spin size="small" /> : null}
                                showArrow={true}
                                filterOption={false}
                                onChange={this.handleChange}
                            >
                                <Option key={0}>公众号</Option>
                                <Option key={2}>头条号</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="公众号/网站地址"
                    >
                        {getFieldDecorator('publicId', {
                            initialValue: '',
                            rules: [{ required: true, message: '请填写公众号/网站地址！' }]
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="公众号/网站名称"
                    >
                        {getFieldDecorator('publicName', {
                            initialValue: '',
                            rules: [{ required: true, message: '请填写公众号/网站名称！' }]
                        })(
                            <Input/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CollectionCreateForm)
