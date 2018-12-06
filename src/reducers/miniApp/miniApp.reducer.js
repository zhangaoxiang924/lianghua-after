/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {MINIAPP, SELECTEDDATA} from '../../constants/index'

const miniAppInfo = (state = {
    filter: {
        status: '',
        recommend: '',
        channelId: ''
    },
    search: {
        authorName: '',
        'nickName': '',
        'title': '',
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
    selectedData: {}
}, action) => {
    let _query = state.query
    let _userInfo = state.userInfo
    let _list = state.list
    let _replyList = state.replyList
    let search = state.search
    let pageData = state.pageData
    let filter = state.filter
    switch (action.type) {
        case MINIAPP.ADD_DATA:
            return {...state, ...action.data}
        case MINIAPP.ADD_QUERY:
            return {...state, query: {..._query, ...action.data}}
        case MINIAPP.SET_SEARCH_QUERY:
            return {...state, search: {...search, ...action.data}}
        case MINIAPP.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case MINIAPP.SET_FILTER_DATA:
            return {...state, filter: {...filter, ...action.data}}
        case MINIAPP.EDIT_USER_INFO:
            return {...state, userInfo: {..._userInfo, ...action.data}}
        case MINIAPP.EDIT_LIST_ITEM:
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
        case MINIAPP.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        case MINIAPP.DEL_REPLY_LIST:
            return {...state, replyList: [..._replyList.slice(0, action.index), ..._replyList.slice(action.index + 1)]}
        case SELECTEDDATA:
            return {...state, selectedData: action.data}
        default:
            return state
    }
}

export default miniAppInfo
