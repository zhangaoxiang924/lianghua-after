/**
 * Author：tantingting
 * Time：2017/10/13
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Icon, Form, Input } from 'antd'
const FormItem = Form.Item

let uuid = 1

class DynamicFieldSet extends Component {
    constructor (props) {
        super(props)
        let itemCode = []
        let _data = []
        let _thiskeys = [] // 处理后的keys
        if (!this.props.update) {
            itemCode = []
            let item = {}
            item[this.props.params1] = ''
            item[this.props.params2] = ''
            _data.push(item)
            _thiskeys = [1]
        } else {
            let icoTeam = this.props.selectGood.icoTeam
            let _keys = icoTeam || []
            uuid = _keys ? _keys.length : 1
            for (let i = 0; i < _keys.length; i++) {
                // let _k = _keys[i]
                let _k = i + 1
                _data = icoTeam
                itemCode = icoTeam
                _thiskeys.push(_k)
            }
        }
        this.state = {
            keys: _thiskeys,
            lk_itemCode: itemCode,
            data: _data
        }
        this.props.setFieldData(_data)
        this.props.form.getFieldDecorator('keys', { initialValue: _thiskeys })
    }

    // 删除列操作
    remove = (k, index) => {
        const {form} = this.props
        const keys = form.getFieldValue('keys')
        form.setFieldsValue({
            keys: keys.filter(key => key !== k)
        })
        let _data = this.state.data
        _data = [
            ..._data.slice(0, index),
            ..._data.slice(index + 1)
        ]
        this.setState({'data': _data})
        this.props.setFieldData(_data)
        if (!this.props.update) {} else {
            let _itemCode = this.state.lk_itemCode
            if (_itemCode.length > 0) {
                _itemCode = [
                    ..._itemCode.slice(0, index),
                    ..._itemCode.slice(index + 1)
                ]
                this.setState({'lk_itemCode': _itemCode})
            }
        }
    }

    add = () => {
        const {form, params1, params2} = this.props
        uuid++
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(uuid)
        form.setFieldsValue({
            keys: nextKeys
        })
        let _data = this.state.data
        let item = {}
        item[params1] = ''
        item[params2] = ''
        _data = [..._data, item]
        this.setState({data: _data})
        this.props.setFieldData(_data)
    }

    changeData (field, value, index, key) {
        let data = {[field]: value}
        let _data = this.state.data
        let _thisData = _data[index]
        _data = [
            ..._data.slice(0, index),
            {..._thisData, ...data},
            ..._data.slice(index + 1)
        ]
        this.setState({'data': _data})
        this.props.setFieldData(_data)
        // this.props.form.setFieldsValue({[`${field}_${key}`]: value})
    }

    render () {
        const FieldsProps = {
            'formItemLayout': {
                labelCol: {span: 2},
                wrapperCol: {span: 22}
            },
            'formItemGood': {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
            },
            'formItemNum': {
                labelCol: {span: 10},
                wrapperCol: {span: 13}
            }
        }
        let icoTeamInfo = this.props.selectGood.icoTeam

        const {formItemGood, formItemNum, formItemLayout} = FieldsProps
        const { update, form, title, member, desc, params1, params2 } = this.props
        const {getFieldDecorator, getFieldValue} = form
        const keys = getFieldValue('keys')
        return <div>
            <FormItem label={title} {...formItemLayout}>
                <Button disabled={keys.length === 10} type="dashed" onClick={this.add} style={{ width: '43%' }}>
                    <Icon type="plus" />{` 添加${title}`}
                </Button>
            </FormItem>
            {
                keys.map((k, index) => {
                    let itemCode = !update || !this.state.lk_itemCode[index] ? [] : icoTeamInfo[index]
                    return (
                        <Row key={k}>
                            <Col span="5" offset={1}>
                                <FormItem label={`${member} ${index + 1}`} {...formItemGood} required={false}>
                                    {getFieldDecorator(`${params1}_${k}`, {
                                        initialValue: !update ? '' : itemCode[params1],
                                        validateTrigger: ['onChange', 'onBlur'],
                                        rules: [{
                                            required: true,
                                            whitespace: true,
                                            message: '字段不能为空'
                                        }]
                                    })(
                                        <Input onChange={(e) => this.changeData(params1, e.target.value, index, k)} placeholder="请输入相关内容" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span="5">
                                <FormItem label={`${desc}`} {...formItemNum} required={false}>
                                    {getFieldDecorator(`${params2}_${k}`, {
                                        initialValue: !update ? '' : itemCode[params2],
                                        validateTrigger: ['onChange', 'onBlur'],
                                        rules: [
                                            {required: true, whitespace: true, message: '字段不能为空'}
                                        ]
                                    })(
                                        <Input onChange={(e) => this.changeData(params2, e.target.value, index, k)} placeholder="请输入相关内容" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span="1">
                                {keys.length > 0 ? (<Icon style={{fontSize: 30}} className="dynamic-delete-button" type="minus-circle-o" disabled={keys.length === 0} onClick={() => this.remove(k, index)}/>) : null}
                            </Col>
                        </Row>
                    )
                })
            }
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        gameListInfo: state.gameListInfo
    }
}

export default connect(mapStateToProps)(DynamicFieldSet)
