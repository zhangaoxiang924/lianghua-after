/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'
import {Form, message, Spin} from 'antd'
import {getTopicContentList} from '../../actions/others/specialTopic.action'
import EditableTable from './EditableTable/EditableTable'

import {axiosPost} from '../../public/index'
import './index.scss'

// const FormItem = Form.Item

class SpecialTopicSend extends Component {
    state = {
        loading: true,
        contentList: []
    }
    componentWillMount () {
        const {location} = this.props
        if (location.query.id) {
            this.doSearch('init', {})
        } else {
            this.setState({
                loading: false
            })
        }
    }

    // 获取内容列表
    doSearch (type, data) {
        const {dispatch, pageData, location} = this.props
        let sendData = {
            id: location.query.id,
            pageSize: 500,
            currentPage: pageData.currentPage
        }
        sendData = {...sendData, ...data}
        dispatch(getTopicContentList(type, sendData, (data) => {
            this.setState({
                loading: false
            })
        }))
    }

    // 提交
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                values.topic = {
                    id: this.props.location.query.id
                }
                values.contentList = this.state.contentList
                axiosPost('/topic/add', values, (res) => {
                    if (res.code === 1) {
                        message.success('操作成功！')
                        hashHistory.push('/specialTopic-list')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 内容格式化
    createMarkup = (str) => {
        return {__html: str}
    }

    render () {
        // const {getFieldDecorator} = this.props.form
        const {list, location} = this.props
        // const formItemLayout = {
        //     labelCol: {span: 1},
        //     wrapperCol: {span: 15, offset: 1}
        // }

        return <div className="specialTopic-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    {this.state.loading ? '' : <EditableTable
                        backButton
                        query={location.query.id}
                        dataList={list}
                        update={true}
                        getData={(data) => { this.setState({contentList: data}) }}
                    />}
                </Form>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        pageData: state.specialTopicInfo.pageData,
        list: state.specialTopicInfo.contentList,
        selectData: state.specialTopicInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(SpecialTopicSend))
