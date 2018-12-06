/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Table, Button, Modal } from 'antd'
// import defaultImg from './img/default.png'
import {editPostList, delPostListItem, getPostList, setPostPage} from '../../actions/useless/userPost.action'
import {formatDate} from '../../public/index'
import './user.scss'

const confirm = Modal.confirm
class PostDetail extends Component {
    /* constructor () {
        super()

        this.state = {
            'currPage': 1,
            'pageSize': 10,
            'totalCount': 0
        }
    } */
    componentWillMount () {
        this.getList()
    }
    // html
    getHtml (str) { return {__html: str} }
    // imgs
    getImgs (imgStr) {
        return !imgStr ? [] : imgStr.split(',')
    }
    // 列表
    getList (data) {
        const {dispatch, location, setCount, pageData} = this.props
        let sendData = {'userName': location.query.userName, 'page': pageData.currPage}
        sendData = !data ? sendData : {...sendData, ...data}
        dispatch(getPostList(sendData, (resData) => {
            setCount(resData.totalCount)
        }))
    }
    // 展开/折叠
    changeTextOver (item) {
        const {dispatch} = this.props
        dispatch(editPostList({'isOverflow': !item.isOverflow}, item.key))
    }

    // 删除
    delItem (item) {
        const {dispatch} = this.props
        let _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                dispatch(delPostListItem({'postsId': item.postsId}, () => {
                    _this.getList()
                }))
            }
        })
    }

    // 分页
    changePage (page) {
        this.props.dispatch(setPostPage({'currPage': page}))
        this.getList({'page': page})
    }

    // columns
    getColumns () {
        let columns = [{
            width: '30%',
            title: '帖子内容',
            key: 'name',
            render: (record) => (<div className="post-list">
                <h3 className="mb15">{record.title}</h3>
                <p className={!record.isOverflow ? 'overflow' : ''} dangerouslySetInnerHTML={this.getHtml(record.content)}>
                </p>
                <div>{record.isOverflow}</div>
                <Button type="primary" onClick={() => this.changeTextOver(record)} shape="circle" title={!record.isOverflow ? '展开' : '收缩'} icon={!record.isOverflow ? 'down' : 'up'} />
                {/* <Button type="primary" shape="circle" title="收缩" icon="up" /> */}
            </div>)
        }, {
            width: '30%',
            title: '帖子图片 ',
            key: 'imgs',
            render: (text, record) => (<div className="img-list">
                {
                    this.getImgs(record.pictureUrl).map((item, index) => <img key={index} src={item} />)
                }
            </div>)
        }, {
            title: '发帖时间 ',
            key: 'time',
            render: (text, record) => (formatDate(record.createTime))
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                <Link to={{pathname: '/post-detail', query: {id: item.postsId}}} className="mr10">帖子详情</Link>
                <a className="mr10" onClick={() => this.delItem(item)} href="javascript:void(0)">删除</a>
            </div>)
        }]
        return columns
    }
    render () {
        const {postList, pageData} = this.props
        return <div className="post-detail">
            <Table dataSource={postList.map((item, index) => ({...item, key: index}))} columns={this.getColumns()} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        postList: state.userPostInfo.postList,
        pageData: state.userPostInfo.postPageData
    }
}

export default connect(mapStateToProps)(PostDetail)
