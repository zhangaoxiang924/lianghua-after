/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Button, Modal } from 'antd'
import {formatDate} from '../../public/index'
import {editCommentList, delCommentListItem, getCommentList, setReviewPage} from '../../actions/useless/userPost.action'
import './user.scss'
let columns = []
const confirm = Modal.confirm

class ReviewDetail extends Component {
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
        columns = [{
            width: '30%',
            title: '评论内容',
            key: 'name',
            render: (text, record) => (<div className="post-list">
                <h3 className="mb15">{record.title}</h3>
                <p className={!record.isOverflow ? 'overflow' : ''} dangerouslySetInnerHTML={this.getHtml(record.replyContent)}>
                </p>
                <Button type="primary" onClick={() => this.changeTextOver(record)} shape="circle" title={!record.isOverflow ? '展开' : '收缩'} icon={!record.isOverflow ? 'down' : 'up'} />
                {/* <Button type="primary" shape="circle" title="收缩" icon="up" /> */}
            </div>)
        }, {
            width: '30%',
            title: '评论图片 ',
            key: 'imgs',
            render: (text, record) => (<div className="img-list">
                {
                    this.getImgs(record.pictureUrl).map((item, index) => <img key={index} src={item} />)
                }
            </div>)
        }, {
            title: '评论时间 ',
            key: 'time',
            render: (text, record) => (formatDate(record.createTime))
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                <a className="mr10" onClick={() => this.delItem(item)} href="javascript:void(0)">删除</a>
            </div>)
        }]
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
        dispatch(getCommentList(sendData, (resData) => {
            setCount(resData.totalCount)
        }))
    }

    // 展开/折叠
    changeTextOver (item) {
        const {dispatch} = this.props
        dispatch(editCommentList({'isOverflow': !item.isOverflow}, item.key))
    }

    // 删除
    delItem (item) {
        const {dispatch} = this.props
        let _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                dispatch(delCommentListItem({'replyId': item.replyId, 'postsId': item.postsId}, () => {
                    _this.getList()
                }))
            }
        })
    }

    // 分页
    changePage (page) {
        this.props.dispatch(setReviewPage({'currPage': page}))
        this.getList({'page': page})
    }
    render () {
        const {commentList, pageData} = this.props
        return <div className="post-detail">
            <Table dataSource={commentList.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        commentList: state.userPostInfo.commentList,
        pageData: state.userPostInfo.commentPageData
    }
}

export default connect(mapStateToProps)(ReviewDetail)
