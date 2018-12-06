/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {POSTACCOUNT, SELECTEDDATA} from '../../constants/index'

const postAccountInfo = (state = {
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
    let _query = state.query
    let _userInfo = state.userInfo
    let _list = state.list
    let _replyList = state.replyList
    let search = state.search
    let pageData = state.pageData
    let filter = state.filter
    switch (action.type) {
        case POSTACCOUNT.ADD_DATA:
            return {...state, ...action.data}
        case POSTACCOUNT.ADD_QUERY:
            return {...state, query: {..._query, ...action.data}}
        case POSTACCOUNT.SET_SEARCH_QUERY:
            return {...state, search: {...search, ...action.data}}
        case POSTACCOUNT.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case POSTACCOUNT.SET_FILTER_DATA:
            return {...state, filter: {...filter, ...action.data}}
        case POSTACCOUNT.EDIT_USER_INFO:
            return {...state, userInfo: {..._userInfo, ...action.data}}
        case POSTACCOUNT.EDIT_LIST_ITEM:
            let _thisItem = _list[action.index]
            return {
                ...state,
                list: [
                    ..._list.slice(0, action.index), {
                        ..._thisItem,
                        ...action.data
                    },
                    ..._list.slice(action.index + 1)]
            }
        case POSTACCOUNT.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        case POSTACCOUNT.DEL_REPLY_LIST:
            return {...state, replyList: [..._replyList.slice(0, action.index), ..._replyList.slice(action.index + 1)]}
        case SELECTEDDATA:
            return {...state, selectedData: action.data}
        default:
            return state
    }
}

export default postAccountInfo
