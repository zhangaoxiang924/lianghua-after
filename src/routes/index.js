/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：root route
 */

import React from 'react'
import Cookies from 'js-cookie'
import {Route, IndexRedirect} from 'react-router'
function isLogin (nextState, replace) {
    let loginStatus = Cookies.get('loginStatus')
    if (!loginStatus || !Cookies.get('hx_id') || !$.parseJSON(loginStatus)) {
        replace('/login')
    }
}
const rootRoutes = <div>
    <Route path="/" onEnter={isLogin} getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/Main').default)
        }, 'Main')
    }}>
        <IndexRedirect to="/team-list" />
        {/*
        <IndexRoute getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Team/team.index').default)
            }, 'Enter')
        }}/>
        */}
        {/* 合作伙伴 */}
        <Route path='/partner-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Partner/user/partner-list.jsx').default)
            }, 'PartnerList')
        }}/>
        <Route path='/partner-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Partner/user/partner-edit.jsx').default)
            }, 'PartnerEdit')
        }}/>
        {/* 委员会 */}
        <Route path='/council-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Council/user/councilList.jsx').default)
            }, 'CouncilList')
        }}/>
        <Route path='/council-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Council/user/councilEdit.jsx').default)
            }, 'CouncilEdit')
        }}/>
        {/* 队伍管理 */}
        <Route path='/team-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Team/team.index').default)
            }, 'TeamList')
        }}/>
        <Route path='/team-send' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Team/team.send').default)
            }, 'TeamSend')
        }}/>
        <Route path='/team-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Team/team.detail').default)
            }, 'TeamDetail')
        }}/>
        {/* 量化账号管理 */}
        <Route path='/account-manager' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Account/index').default)
            }, 'FlashAccount')
        }}/>
        {/* banner 轮播图管理 */}
        <Route path='/banner-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Banner/banner.index').default)
            }, 'BannerIndex')
        }}/>
        <Route path='/banner-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Banner/banner.add').default)
            }, 'BannerEdit')
        }}/>
        {/* CQ量化大赛团队管理 */}
        <Route path='/CQTeam-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/CQTeam/CQTeam.index').default)
            }, 'CQTeamList')
        }}/>
        <Route path='/CQTeam-send' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/CQTeam/CQTeam.send').default)
            }, 'CQTeamSend')
        }}/>
        <Route path='/CQTeam-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/CQTeam/CQTeam.detail').default)
            }, 'CQTeamDetail')
        }}/>
    </Route>
    <Route path='/login' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/Login').default)
        }, 'Login')
    }}/>
</div>

export default rootRoutes
