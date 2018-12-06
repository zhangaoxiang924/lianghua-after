/**
 * Author：zhoushuanglong
 * Time：2017/7/26
 * Description：enter
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import './index.scss'
import menuData from '../../public/menuData'
import { gameList, navigation, breadcrumb } from '../../actions/index'

class Enter extends Component {
    componentDidMount () {
        this.props.actions.gameList()
    }

    goGoodsListPage = (gameId, gameName, gameIcon) => {
        hashHistory.push('/post-list')
        $.cookie('gameId', gameId)
        $.cookie('gameName', gameName)
        $.cookie('gameIcon', gameIcon)
    }

    render () {
        const This = this
        return <div className="game-main">{this.props.gameListInfo.map(function (d, i) {
            return <a
                className="game-item"
                key={i}
                onClick={() => {
                    This.goGoodsListPage(d.appId, d.appName, d.appIcon)
                    This.props.actions.breadcrumb([menuData[0].text, !menuData[0].children ? menuData[0].text : menuData[0].children[0].text])
                    This.props.actions.navigation(!menuData[0].children ? menuData[0].key : menuData[0].children[0].key, !menuData[0].children ? '' : menuData[0].key)
                } }><div className="mask"></div><img src={d.appIcon}/><span>{d.appName}</span></a>
        })}</div>
    }
}

const mapStateToProps = (state) => {
    return {
        gameListInfo: state.gameListInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({gameList, navigation, breadcrumb}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Enter)
