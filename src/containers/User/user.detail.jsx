/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { Row, Col, Button, Tabs } from 'antd'
import defaultImg from './img/default.png'
import './user.scss'
import PostDetail from './user.detail.post'
import ReviewDetail from './user.detail.review'
import {userState} from '../../public/config'
import {addUserPostQuery, changeUserStatus, getUserInfo, setPostPage, setReviewPage} from '../../actions/useless/userPost.action'
const TabPane = Tabs.TabPane

class UserDetail extends Component {
    constructor () {
        super()
        this.state = {
            'postCount': '',
            'reviewCount': ''
        }
    }
    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getUserInfo({'userId': location.query.userId}))
    }

    componentWillUnmount () {
        const {dispatch} = this.props
        let _pageData = {
            'currPage': 1,
            'pageSize': 10,
            'totalCount': 0
        }
        dispatch(setPostPage(_pageData))
        dispatch(setReviewPage(_pageData))
    }

    // 禁用/启用
    changeStatus () {
        const {dispatch, query} = this.props
        let _data = {
            'userId': query.userId,
            'operate': query.status !== '1' ? '1' : '0'
        }
        dispatch(changeUserStatus(_data, () => {
            dispatch(addUserPostQuery({'status': query.status !== '1' ? '1' : '0'}))
        }))
        /* dispatch(changeUserStatus({'id': query.id, 'status': !query.status}, () => {
            dispatch(addUserPostQuery({'status': !query.status}))
        })) */
    }

    setCount (data) {
        let _state = this.state
        this.setState({..._state, ...data})
    }
    render () {
        const {query, location} = this.props
        return <div className="user-detail">
            <Row>
                <Col span={1}>
                    <Button shape="circle" icon="arrow-left" onClick={() => hashHistory.goBack()} />
                </Col>
                <Col span={3}>
                    <div className="lh32">{!query.nickName ? '用户昵称' : query.nickName}</div>
                </Col>
                <Col className="text-right" span={19}>
                    <div className="user-info">
                        <div className="img-box"><img src={!query.userIcon ? defaultImg : query.userIcon} /></div>
                        <div>
                            <div className="text-left mb5">{!query.status ? '禁用' : userState[query.status]}</div>
                            <Button onClick={() => this.changeStatus()}>{query.status !== '1' ? '启用' : '禁用'}该用户</Button>
                        </div>
                    </div>
                </Col>
            </Row>
            <div className="detail-container">
                <Tabs type="card">
                    <TabPane tab={`帖子${this.state.postCount}`} key="1"><PostDetail location={location} setCount={(len) => this.setCount({'postCount': len})} /></TabPane>
                    <TabPane tab={`评论${this.state.reviewCount}`} key="2"><ReviewDetail location={location} setCount={(len) => this.setCount({'reviewCount': len})} /></TabPane>
                </Tabs>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        query: state.userPostInfo.query
    }
}

export default connect(mapStateToProps)(UserDetail)
