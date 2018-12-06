/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {hashHistory, Link} from 'react-router'
import {connect} from 'react-redux'
import {Form, Spin, Table, Button, message, Input, Modal} from 'antd'
import {getNewsInMerge} from '../../actions/post/newsMerge.action'
import Cookies from 'js-cookie'

import {cutString, formatDate, axiosAjax} from '../../public/index'
import './index.scss'

// const FormItem = Form.Item
const confirm = Modal.confirm

let columns = []

class NewsMergeEdit extends Component {
    state = {
        loading: true,
        contentList: [],
        codeValue: ''
    }

    componentWillMount () {
        const {location} = this.props
        if (location.query.id) {
            this.doSearch({})
        } else {
            this.setState({
                loading: false
            })
        }

        columns = [{
            title: '文章标题',
            key: 'title',
            render: (text, record) => (record && <div className="columnAuthor-info clearfix">
                <div>
                    <a href={record.url} target="_blank">
                        <span title={record.title} dangerouslySetInnerHTML={this.createMarkup(cutString(record.title, 50))} />
                    </a>
                    {/*
                     {parseInt(record.recommend) === 0 ? '' : <div style={{'display': 'inline-block'}}><span className="newsMerge-status has-publish mr10">置顶（{record.recommend}）</span></div>}
                     */}
                </div>
            </div>)
        }, {
            title: '文章摘要',
            key: 'synopsis',
            render: (record) => {
                if (record && record.synopsis.trim() !== '') {
                    return <h4 dangerouslySetInnerHTML={this.createMarkup(cutString(record.synopsis, 100))} />
                } else {
                    return <span>暂无</span>
                }
            }
        }, {
            title: '发布时间',
            dataIndex: 'publishTime',
            key: 'publishTime',
            render: (record) => {
                if (record.toString().length === 10) {
                    return formatDate(parseInt(record) * 1000)
                } else {
                    return formatDate(parseInt(record))
                }
            }
        }, {
            title: '操作',
            key: 'option',
            render: (record) => {
                return (
                    <div>
                        <a href={record.url} target="_blank" style={{background: '#3dadf2'}} className="mr10 opt-btn">查看</a>
                        <Link
                            to={{
                                pathname: '/post-send',
                                query: {
                                    url: record.url,
                                    webName: location.query.type,
                                    title: record.title,
                                    publishTime: record.publishTime,
                                    coverPic: record.coverPic,
                                    synopsis: record.synopsis,
                                    author: record.author
                                }
                            }}
                            style={{background: '#3dadf2'}}
                            className="mr10 opt-btn"
                            href="javascript:void(0)">
                            编辑
                        </Link>
                    </div>
                )
            }
        }]
    }

    changeImg (e) {
        let str = Math.random().toString(36).substr(2)
        e.target.setAttribute('src', `${window.location.protocol}//${window.location.host}/mgr/merge/verify/img?count=${str}`)
    }

    changeSouGouImg (e) {
        let str = Math.random().toString(36).substr(2)
        e.target.setAttribute('src', `${window.location.protocol}//${window.location.host}/mgr/merge/sougou/verifyimg?count=${str}`)
    }

    changeCode = (e) => {
        this.setState({
            codeValue: e.target.value
        })
    }

    // 获取内容列表
    doSearch (data) {
        const {dispatch, location} = this.props
        const This = this
        let sendData = {
            source: location.query.id,
            webName: location.query.type.indexOf('weixin') !== -1 ? 'weixin' : (location.query.type.indexOf('toutiao') !== -1 ? 'toutiao' : location.query.type),
            currentPage: 1,
            snuid: Cookies.get('snuid') || location.query.snuid || ''
        }
        sendData = {...sendData, ...data}
        dispatch(getNewsInMerge(sendData, (data) => {
            if (data.code === -2) {
                let str = Math.random().toString(36).substr(2)
                confirm({
                    title: '提示',
                    content: <div className="">
                        <span>请输入验证码：</span>
                        <Input onChange={this.changeCode} style={{width: '30%', verticalAlign: 'middle'}} />
                        <img
                            onClick={(e) => this.changeImg(e)}
                            title="点击切换图片"
                            style={{cursor: 'pointer', width: '36%', verticalAlign: 'middle', marginLeft: 15}}
                            src={`/mgr/merge/verify/img?count=${str}`}
                            alt=""
                        />
                    </div>,
                    onOk () {
                        if (This.state.codeValue.trim() === '') {
                            message.error('验证码不能为空！')
                            This.doSearch(data)
                            return false
                        }
                        axiosAjax('POST', '/merge/verify/code', {code: This.state.codeValue}, (res) => {
                            // if (res.code === 1) {
                            //     message.success('验证成功！')
                            //     This.doSearch(data)
                            // } else if (res.code === -1) {
                            //     message.error('验证码输入错误, 请重新输入！')
                            // } else {
                            //     message.error(res.msg)
                            // }
                            This.doSearch(data)
                        })
                    },
                    onCancel () {
                        hashHistory.push({
                            pathname: '/merge-list'
                        })
                    }
                })
            } else if (data.code === -3) {
                let str = Math.random().toString(36).substr(2)
                confirm({
                    title: '提示',
                    content: <div className="">
                        <span>请输入验证码：</span>
                        <Input onChange={this.changeCode} style={{width: '30%', verticalAlign: 'middle'}} />
                        <img
                            onClick={(e) => this.changeSouGouImg(e)}
                            title="点击切换图片"
                            style={{cursor: 'pointer', width: '36%', verticalAlign: 'middle', marginLeft: 15}}
                            src={`/mgr/merge/sougou/verifyimg?count=${str}`}
                            alt=""
                        />
                    </div>,
                    onOk () {
                        if (This.state.codeValue.trim() === '') {
                            message.error('验证码不能为空！')
                            This.doSearch(data)
                            return false
                        }
                        axiosAjax('POST', '/merge/sougou/verifycode', {code: This.state.codeValue}, (res) => {
                            if (res.code === 1) {
                                message.success('验证成功！')
                                Cookies.set('snuid', res.obj)
                                This.doSearch(data)
                            } else {
                                message.error(res.msg)
                                This.doSearch(data)
                            }
                        })
                    },
                    onCancel () {
                        hashHistory.push({
                            pathname: '/merge-list'
                        })
                    }
                })
            } else if (data.code === 1) {
                this.setState({
                    loading: false
                })
            } else {
                message.error(data.msg)
                // This.doSearch(data)
            }
        }))
    }

    // 内容格式化
    createMarkup = (str) => {
        return {__html: str}
    }

    render () {
        const {list} = this.props
        return <div className="newsMerge-index">
            <Spin spinning={this.state.loading} size='large'>
                <Button type="primary" className="cancel" style={{marginBottom: 15}} onClick={() => { hashHistory.goBack() }}>返回</Button>
                <Table pagination={false} bordered dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} />
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        newsMergeInfo: state.newsMergeInfo,
        list: state.newsMergeInfo.contentList,
        search: state.newsMergeInfo.search,
        filter: state.newsMergeInfo.filter,
        pageData: state.newsMergeInfo.pageData,
        numArr: state.newsMergeInfo.numArr
    }
}

export default connect(mapStateToProps)(Form.create()(NewsMergeEdit))
