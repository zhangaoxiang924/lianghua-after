/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {ACCOUNT, SELECTEDDATA} from '../../constants/index'

const accountInfo = (state = {
    filter: {
        status: ''
    },
    search: {
        'nickName': '',
        'value': '',
        'type': 'init'
    },
    pageData: {
        'currPage': 1,
        'pageSize': 20,
        'totalCount': 0
    },
    query: {},
    list: [],
    userInfo: {
        'name': '',
        'pwd': ''
    },
    info: {},
    replyList: [],
    selectedData: {
        passportId: ''
    }
}, action) => {
    // 某些reducer 用不到但是 并未删除, 只留作备用
    let _list = state.list
    let search = state.search
    let pageData = state.pageData
    let filter = state.filter
    switch (action.type) {
        case ACCOUNT.ADD_DATA:
            return {...state, ...action.data}
        case ACCOUNT.SET_SEARCH_QUERY:
            return {...state, search: {...search, ...action.data}}
        case ACCOUNT.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case ACCOUNT.SET_FILTER_DATA:
            return {...state, filter: {...filter, ...action.data}}
        case ACCOUNT.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        case SELECTEDDATA:
            return {...state, selectedData: action.data}
        default:
            return state
    }
}

export default accountInfo
