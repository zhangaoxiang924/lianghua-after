import React, {Component} from 'react'
import { Modal, Form, Select, Spin } from 'antd'
import {axiosAjax} from '../../../public/index'
const FormItem = Form.Item
const Option = Select.Option
let timeout
let currentValue

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

    getAuthorList = (value, callback) => {
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
        }
        currentValue = value

        const getList = () => {
            this.setState({
                searching: true
            })
            axiosAjax(`post`, `/author/showauthorlist`, {
                value: value,
                currentPage: 1,
                pageSize: 500
            }, (res) => {
                this.setState({
                    searching: false
                })
                if (currentValue === value) {
                    const result = res.obj.inforList
                    const data = []
                    result.forEach((r) => {
                        data.push({
                            value: r.passportId,
                            text: r.nickName
                        })
                    })
                    callback(data)
                }
            })
        }
        timeout = setTimeout(getList, 300)
    }

    handleChange = (value) => {
        this.setState({
            value,
            data: []
        })
        this.getAuthorList(value, data => this.setState({ data }))
    }

    render () {
        const { visible, onCancel, onCreate, form } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18, offset: 1}
        }
        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>)
        return (
            <Modal
                visible={visible}
                title="新增专栏作者"
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form>
                    <p style={{color: 'black', margin: '0 0 10px 10px'}}>输入作者姓名或手机号进行搜索：</p>
                    <FormItem
                        {...formItemLayout}
                        label="专栏作者"
                    >
                        {getFieldDecorator('passportId', {
                            initialValue: this.state.value,
                            rules: [{ required: true, message: '请选择专栏作者！' }]
                        })(
                            <Select
                                showSearch
                                style={{width: '100%'}}
                                placeholder='请输入作者姓名或手机号'
                                defaultActiveFirstOption={false}
                                notFoundContent={this.state.searching ? <Spin size="small" /> : null}
                                showArrow={true}
                                filterOption={false}
                                onSearch={this.handleChange}
                            >
                                {options}
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CollectionCreateForm)
