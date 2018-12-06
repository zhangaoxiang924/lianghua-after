/**
 * Author：tantingting
 * Time：2017/9/5
 * Description：Description
 */
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { Layout, Button } from 'antd'
import Cookies from 'js-cookie'
// import {axiosAjax} from '../../public/index'

import { breadcrumb, navigation, logout } from '../../actions/index'
import './index.scss'

const {Header} = Layout

class MainHeader extends Component {
    loginOut () {
        this.props.actions.logout({
            passportId: Cookies.get('hx_passportId')
        })
    }
    render () {
        // let tag = $.cookie('gameName') ? <Tag onClick={this.handleClick} color="#108ee9" className="game-id">欢迎来到<span className="name"> {$.cookie('gameName')} </span>  后台系统</Tag> : ''
        return <Header className="header">
            <div className="logo"></div>
            <h3 className="system-title">火星财经管理后台</h3>
            {!this.props.tag ? '' : this.props.tag}
            <div className="shop-func">
                <Button title="主页" type="primary" shape="circle" icon="home" onClick={() => { hashHistory.push('/') }}/>
                {/*
                <Button title="游戏初始化" type="primary" shape="circle" onClick={() => { hashHistory.push('/game-init') }}><i className="iconfont icon-game-config" /></Button>
                <Button title="系统" type="primary" shape="circle" icon="setting" onClick={() => { hashHistory.push('/system') }}/>
                */}
                <Button title="退出" type="primary" shape="circle" icon="logout" onClick={() => { this.loginOut() }}/>
            </div>
        </Header>
    }
}

const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({breadcrumb, navigation, logout}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainHeader)
