/**
 * Author：tantingting
 * Time：2017/9/20
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Pagination, Icon, Checkbox } from 'antd'
import {formatDate} from '../../public/index'
import ImgShow from './img.show'
import {getPostImgsList} from '../../actions/useless/imgs.action'

class ImgsPost extends Component {
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

    getList (obj) {
        const {dispatch} = this.props
        let _data = {
            'page': this.state.currPage
        }
        _data = !obj ? _data : {..._data, ...obj}
        dispatch(getPostImgsList(_data, (res) => {
            this.setState({'pageSize': res.pageSize, 'totalCount': res.totalCount})
        }))
    }

    changePage (page) {
        this.setState({'currPage': page})
        this.getList({'page': page})
    }

    formatImgs (str) {
        return !str ? [] : str.split(',')
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
        return <div>
            <div className="img-post-main clearfix">
                <div className="contain">
                    {
                        !list.length ? <div className="no-data"><i className="iconfont icon-kong"></i><span>暂无图片帖子！</span></div>
                            : list.map((item, index) => (
                                <div key={index} className="post-row">
                                    <div className="left">
                                        <p className="blue-color">{formatDate(item.createTime)}</p>
                                        <h4>{item.title}</h4>
                                        <p>{item.nickName}</p>
                                    </div>
                                    <div className="items">
                                        {
                                            this.formatImgs(item.pictureUrl).map((img, i) => (
                                                <div key={i} className="item" onClick={() => { this.choseImgs(item.postsId, img, this.isChk(item.postsId, img)) }}>
                                                    <div className="item-img">
                                                        <img src={img} />
                                                        <Icon className="eye" type="eye-o" onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); e.stopPropagation(); this.setState({'isShow': true, 'imgUrl': img, 'modalInfo': {'userName': item.userName, 'nickName': item.nickName, 'time': formatDate(item.createTime)}}) }} />
                                                    </div>
                                                    <div className="check-box">
                                                        <Checkbox checked={!this.isChk(item.postsId, img)} />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                    }

                    {/* <div className="post-row">
                        <div className="left">
                            <p className="blue-color">2017-10-17  16:00:00</p>
                            <p>这是一个帖子的标题</p>
                            <p>这是玩家昵称（这是玩家通行证账号）</p>
                        </div>
                        <div className="items">
                            <div className="item">
                                <div className="item-img">
                                    <img src={defaultImgLarge} />
                                    <Icon className="eye" type="eye-o" onClick={() => this.setState({'isShow': true, 'imgUrl': defaultImgLarge})} />
                                </div>
                                <div className="check-box">
                                    <Checkbox />
                                </div>
                            </div>
                            <div className="item">
                                <div className="item-img">
                                    <img src={defaultImgLarge} />
                                    <Icon className="eye" type="eye-o" onClick={() => this.setState({'isShow': true, 'imgUrl': defaultImgLarge})} />
                                </div>
                                <div className="check-box">
                                    <Checkbox />
                                </div>
                            </div>
                            <div className="item">
                                <div className="item-img">
                                    <img src={defaultImgLarge} />
                                    <Icon className="eye" type="eye-o" onClick={() => this.setState({'isShow': true, 'imgUrl': defaultImgLarge})} />
                                </div>
                                <div className="check-box">
                                    <Checkbox />
                                </div>
                            </div>
                            <div className="item">
                                <div className="item-img">
                                    <img src={defaultImgLarge} />
                                    <Icon className="eye" type="eye-o" onClick={() => this.setState({'isShow': true, 'imgUrl': defaultImgLarge})} />
                                </div>
                                <div className="check-box">
                                    <Checkbox />
                                </div>
                            </div>
                            <div className="item">
                                <div className="item-img">
                                    <img src={defaultImgLarge} />
                                    <Icon className="eye" type="eye-o" onClick={() => this.setState({'isShow': true, 'imgUrl': defaultImgLarge})} />
                                </div>
                                <div className="check-box">
                                    <Checkbox />
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
                {/* 分页 */}
                <div className="pagination">
                    <Pagination current={this.state.currPage} total={this.state.totalCount} pageSize={this.state.pageSize} onChange={(page) => this.changePage(page)} />
                </div>
            </div>
            <ImgShow type="1" modalInfo={this.state.modalInfo} isShow={this.state.isShow} imgSrc={this.state.imgUrl} onClose={() => this.setState({'isShow': false})}/>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.imgsInfo.postList
    }
}

export default connect(mapStateToProps)(ImgsPost)
