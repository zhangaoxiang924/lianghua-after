/**
 * Author：tantingting
 * Time：2017/9/20
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Pagination, Icon, Checkbox } from 'antd'
// import defaultImgLarge from '../../public/img/default-large.png'
import {formatDate} from '../../public/index'
import ImgShow from './img.show'
import {editImgsList, editImgsSelect, getReviewImgsList} from '../../actions/useless/imgs.action'

class ImgsReview extends Component {
    constructor () {
        super()
        this.state = {
            'currPage': 1,
            'pageSize': 10,
            'totalCount': 0,
            'isShow': false,
            'imgUrl': '',
            'modalInfo': {},
            'chkObj': {}
        }
    }

    componentWillMount () {
        this.getList()
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.isSearch && nextProps.isSearch !== this.props.isSearch) {
            this.getList()
        }
    }

    chkImg (e, item, index) {
        const {dispatch} = this.props
        dispatch(editImgsList({'isChk': e.target.checked}, index))
        dispatch(editImgsSelect(item, e.target.checked))
    }

    getList (obj) {
        const {dispatch} = this.props
        let _data = {
            'page': this.state.currPage
        }
        _data = !obj ? _data : {..._data, ...obj}
        dispatch(getReviewImgsList(_data, (res) => {
            this.setState({'pageSize': res.pageSize, 'totalCount': res.totalCount})
        }))
    }

    changePage (page) {
        this.setState({'currPage': page})
        this.getList({'page': page})
    }

    // 选择要替换的图片
    choseImgs (postsId, imgUrl, isChk) {
        const {selectData} = this.props
        let chkObj = this.state.chkObj
        let _thisImgs = !chkObj[postsId] ? [] : chkObj[postsId]
        if (!isChk) {
            // 取消
            let index = _thisImgs.indexOf(imgUrl)
            _thisImgs = [
                ..._thisImgs.slice(0, index),
                ..._thisImgs.slice(index + 1)
            ]
        } else {
            // 选中
            if (!_thisImgs.length) {
                _thisImgs = [`${imgUrl}`]
            } else {
                _thisImgs = [..._thisImgs, `${imgUrl}`]
            }
        }
        if (!_thisImgs.length) {
            delete chkObj[postsId]
            this.setState({'chkObj': {...chkObj}})
            selectData(chkObj)
        } else {
            let Obj = {[postsId]: _thisImgs}
            this.setState({'chkObj': {...chkObj, ...Obj}})
            selectData({...chkObj, ...Obj})
        }
    }
    // 判断是否要选中
    isChk (postsId, imgUrl) {
        const {chkObj} = this.state
        if (!chkObj[postsId]) {
            return true
        }

        if (chkObj[postsId].indexOf(imgUrl) === -1) {
            return true
        }
        return false
    }

    render () {
        const {list} = this.props
        // console.log(list)
        return <div>
            <div className="img-review-main clearfix">
                <div className="page-box contain">
                    <div className="items">
                        {
                            !list.length ? <div className="no-data"><i className="iconfont icon-kong"></i><span>暂无评论图片！</span></div>
                                : list.map((item, index) => (
                                    <div key={index} className="item" onClick={() => { this.choseImgs(item.replyId, item.pictureUrl, this.isChk(item.replyId, item.pictureUrl)) }}>
                                        <div className="item-img">
                                            <img src={item.pictureUrl} />
                                            <Icon className="eye" type="eye-o" onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); e.stopPropagation(); this.setState({'isShow': true, 'imgUrl': item.pictureUrl, 'modalInfo': {'userName': item.userName, 'nickName': item.nickName, 'time': formatDate(item.replyTime)}}) }} />
                                        </div>
                                        <div className="check-box">
                                            <Checkbox checked={!this.isChk(item.replyId, item.pictureUrl)} />
                                        </div>
                                    </div>
                                ))
                        }
                        {/* <div className="item">
                            <div className="item-img">
                                <img src={defaultImgLarge} />
                                <Icon className="eye" type="eye-o" onClick={() => this.setState({'isShow': true, 'imgUrl': defaultImgLarge})} />
                            </div>
                            <div className="check-box">
                                <Checkbox />
                            </div>
                        </div> */}
                    </div>
                </div>
                {/* 分页 */}
                <div className="pagination">
                    <Pagination current={this.state.currPage} total={this.state.totalCount} pageSize={this.state.pageSize} onChange={(page) => this.changePage(page)} />
                </div>
            </div>
            <ImgShow type="2" modalInfo={this.state.modalInfo} isShow={this.state.isShow} imgSrc={this.state.imgUrl} onClose={() => this.setState({'isShow': false})}/>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.imgsInfo.ReviewList
    }
}

export default connect(mapStateToProps)(ImgsReview)
