/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Icon, Row, Col, Button, Table } from 'antd'
import {getUserList, changeUserStatus, setUserSearch, setUserPage, setPostPage, setReviewPage} from '../../actions/useless/userPost.action'
import {userState} from '../../public/config'
import './user.scss'
import { Link } from 'react-router'
import IconItem from '../../components/icon/icon'
let columns = []
class UserIndex extends Component {
    /* constructor () {
        super()

        this.state = {
            'searchQuery': '',
            'currPage': 1,
            'pageSize': 10,
            'totalCount': 0
        }
    } */

    componentWillMount () {
        this.doSearch({})

        columns = [{
            title: '发帖用户信息',
            key: 'name',
            render: (text, record) => (<div className="user-info">
                <div className="img-box"><img src={record.userIcon} /></div>
                <div>{record.nickName}</div>
            </div>)
        }, {
            title: '发帖数 ',
            dataIndex: 'postsCount',
            key: 'postsCount'
        }, {
            title: '评论数 ',
            dataIndex: 'replyCount',
            key: 'replyCount'
        }, {
            title: '状态',
            key: 'lastTime',
            render: (item) => (<div>
                {userState[item.status]}
            </div>)
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                <Link className="mr10" onClick={() => this.resetPageData()} to={{pathname: '/postUser-detail', query: {userName: item.userName, userId: item.userId}}}>详情</Link>
                <a className="mr10" onClick={() => this.changeStatus(item)} href="javascript:void(0)">{!item.status ? '启用' : '禁用'}</a>
            </div>)
        }]
    }

    componentWillUnmount () {
        const {dispatch} = this.props
        let _pageData = {
            'currPage': 1,
            'pageSize': 10,
            'totalCount': 0
        }
        dispatch(setUserSearch({'searchQuery': ''}))
        dispatch(setUserPage(_pageData))
    }

    resetPageData () {
        const {dispatch} = this.props
        let _data = {
            'currPage': 1,
            'pageSize': 10,
            'totalCount': 0
        }
        dispatch(setPostPage(_data))
        dispatch(setReviewPage(_data))
    }

    // 搜索
    doSearch (data) {
        const {dispatch, search, pageData} = this.props
        let sendData = !data ? {'nickName': search.searchQuery, 'page': pageData.currPage} : {'nickName': search.searchQuery, 'page': pageData.currPage, ...data}
        dispatch(getUserList(sendData))
    }

    // 禁用/启用
    changeStatus (item) {
        const {dispatch} = this.props
        let _data = {
            'userId': item.userId,
            'operate': !item.status ? '1' : '0'
        }
        dispatch(changeUserStatus(_data, () => {
            this.doSearch()
        }))
    }

    // 分页
    changePage (page) {
        this.props.dispatch(setUserPage({'currPage': page}))
        this.doSearch({'page': page})
    }
    render () {
        const {list, pageData, search, dispatch} = this.props
        return <div className="postUser-index">
            <Row>
                <Col span={5}>
                    <Input
                        value={search.searchQuery}
                        onChange={(e) => dispatch(setUserSearch({'searchQuery': e.target.value}))}
                        placeholder="请输入发帖昵称"
                        prefix={<Icon type="search" />}
                    />
                </Col>
                <Col offset={1} span={2}>
                    <Button type="primary" onClick={() => this.doSearch({'page': 1})}><IconItem type="icon-search"/>搜索</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.userPostInfo.list,
        search: state.userPostInfo.search,
        pageData: state.userPostInfo.pageData
    }
}

export default connect(mapStateToProps)(UserIndex)
