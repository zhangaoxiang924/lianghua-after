import React, {Component} from 'react'
import { Modal, Form, Select, Spin, Input, Radio } from 'antd'
import {postAjax} from '../../../../public/index'
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
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
            searching: false,
            type: 1
        }
    }

    componentDidMount () {
        this.getAuthorList('', data => this.setState({ data }))
    }

    typeOnChange = (e) => {
        this.setState({
            type: e.target.value
        })
    }

    getAuthorList = (value, callback) => {
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
        }
        currentValue = value

        const getList = () => {
            postAjax(`post`, `/market/tickers/market/collect_list`, {
                // value: value,
                // currentPage: 1,
                // pageSize: 500
            }, (res) => {
                this.setState({
                    searching: false
                })
                if (currentValue === value) {
                    const result = res.data
                    const data = []
                    console.log(result)
                    result.forEach((r, i) => {
                        data.push({
                            value: r,
                            text: r
                        })
                    })
                    callback(data)
                }
            })
        }
        timeout = setTimeout(getList, 300)
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
                title="新增交易所"
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="交易所名称"
                    >
                        {getFieldDecorator('coinId', {
                            initialValue: selectedData.id ? {key: selectedData.market, label: selectedData.market} : {key: '', label: ''},
                            rules: [{ required: true, message: '请选择交易所！' }]
                        })(
                            <Select
                                disabled={selectedData.id ? 1 : 0}
                                labelInValue
                                showSearch
                                style={{width: '100%'}}
                                placeholder='请输入交易所名'
                                defaultActiveFirstOption={false}
                                notFoundContent={this.state.searching ? <Spin size="small" /> : '未查询到相关内容'}
                                showArrow={true}
                                filterOption={true}
                            >
                                {options}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="交易所别名"
                    >
                        {getFieldDecorator('alias', {
                            initialValue: selectedData.alias ? selectedData.alias : '',
                            rules: [{ required: false }]
                        })(
                            <Input placeholder="交易所别名"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="添加类型"
                    >
                        {getFieldDecorator('type', {
                            initialValue: selectedData.id ? selectedData.type : 1,
                            rules: [{ required: true, message: '请选择类型！' }]
                        })(
                            <RadioGroup disabled={selectedData.id ? 1 : 0} onChange={this.typeOnChange}>
                                <Radio value={1}>前三交易对占比</Radio>
                                <Radio value={2}>24H 成交额占比</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="排序">
                        {getFieldDecorator('rank', {
                            rules: [{
                                required: true, message: '请输入排序号!'
                            }, {
                                pattern: /^\d+$/, message: '只能输入数字'
                            }],
                            initialValue: selectedData.rank === '' ? '' : selectedData.rank
                        })(
                            <Input placeholder="排序值越小, 顺序越靠前" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CollectionCreateForm)
