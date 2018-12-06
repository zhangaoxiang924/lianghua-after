import React, {Component} from 'react'
import { Modal, Form, Select, Spin, Input } from 'antd'
import {axiosAjax} from '../../../../public/index'
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
            axiosAjax(`get`, `/market/tickers/coin/list`, {
                page: 1,
                size: 500,
                order: 'rank',
                sort: 'asc',
                search: value
            }, (res) => {
                this.setState({
                    searching: false
                })
                if (currentValue === value) {
                    const result = res.data.inforList
                    const data = []
                    result.forEach((r) => {
                        data.push({
                            value: r.symbol,
                            text: r.symbol
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
            value: {value: value},
            data: []
        })
        this.getAuthorList(value, data => this.setState({ data }))
    }

    render () {
        const { visible, onCancel, onCreate, form, selectedData } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18, offset: 1}
        }
        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>)
        return (
            <Modal
                visible={visible}
                title="新增推荐币种"
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="虚拟币名称"
                    >
                        {getFieldDecorator('coinId', {
                            initialValue: selectedData.symbol ? {key: selectedData.symbol, label: selectedData.symbol} : {key: '', label: ''},
                            rules: [{ required: true, message: '请选择虚拟币！' }]
                        })(
                            <Select
                                labelInValue
                                showSearch
                                style={{width: '100%'}}
                                placeholder='请输入币种名'
                                disabled={!!selectedData.symbol}
                                defaultActiveFirstOption={false}
                                notFoundContent={this.state.searching ? <Spin size="small" /> : '未查询到相关内容'}
                                showArrow={true}
                                filterOption={false}
                                onSearch={this.handleChange}
                            >
                                {options}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="权重">
                        {getFieldDecorator('weight', {
                            rules: [
                                {required: true, message: '请输入权重!'},
                                {pattern: /^[1-9][0-9]*$/, message: '请输入正整数!'}
                            ],
                            initialValue: selectedData.weight === '' ? '' : selectedData.weight
                        })(
                            <Input placeholder="权重越大, 顺序越靠前" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CollectionCreateForm)
