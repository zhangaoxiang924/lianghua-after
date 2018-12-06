/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：root reducer
 */

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import publicInfo from './public/index'
import loginInfo from './public/loginInfo'
import partnerInfo from './partner/partner.reducer'
import councilInfo from './council/council.reducer'
import teamInfo from './team/team.reducer'
import accountInfo from './account/index'

const reducers = Object.assign({
    publicInfo,
    loginInfo,
    partnerInfo,
    councilInfo,
    teamInfo,
    accountInfo,
    routing: routerReducer
})

const rootReducer = combineReducers(reducers)
export default rootReducer
