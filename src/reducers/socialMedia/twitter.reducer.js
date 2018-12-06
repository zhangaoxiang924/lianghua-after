/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {TWITTER, SELECTEDDATA} from '../../constants/index'

const twitterInfo = (
    state = {
        num: {},
        contentList: [],
        filter: {type: '2', includeRead: true, includeUnread: true, important: ''},
        search: {'sourceLike': '', 'contentLike': ''},
        pageData: {'currentPage': 1, 'pageSize': 20, 'totalCount': 0},
        query: {},
        list: [],
        userInfo: {'name': '', 'pwd': ''},
        info: {},
        zcrList: [],
        guestList: [],
        replyList: [],
        numArr: []
    }, action) => {
    let _query = state.query
    let _userInfo = state.userInfo
    let _list = state.list
    let search = state.search
    let pageData = state.pageData
    let filter = state.filter
    switch (action.type) {
        case TWITTER.ADD_DATA:
            return {...state, ...action.data}
        case TWITTER.ADD_QUERY:
            return {...state, query: {..._query, ...action.data}}
        case TWITTER.SET_SEARCH_QUERY:
            return {...state, search: {...search, ...action.data}}
        case TWITTER.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case TWITTER.SET_FILTER_DATA:
            return {...state, filter: {...filter, ...action.data}}
        case TWITTER.EDIT_USER_INFO:
            return {...state, userInfo: {..._userInfo, ...action.data}}
        case TWITTER.EDIT_LIST_ITEM:
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
        case TWITTER.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        case TWITTER.GET_TOP_NUM:
            return {...state, numArr: action.actionData}
        case SELECTEDDATA:
            return {...state, selectedData: action.data}
        default:
            return state
    }
}

export default twitterInfo
