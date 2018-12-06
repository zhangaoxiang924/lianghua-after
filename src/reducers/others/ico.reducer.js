/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {ICO, SELECTEDDATA} from '../../constants/index'

const postInfo = (
    state = {
        filter: {status: '', recommend: '', channelId: ''},
        search: {'nickName': '', 'title': '', 'type': 'init', symbol: ''},
        pageData: {'page': 1, 'pageSize': 10, 'totalCount': 0},
        query: {},
        list: [],
        userInfo: {'name': '', 'pwd': ''},
        info: {},
        replyList: []
    }, action) => {
    let _query = state.query
    let _userInfo = state.userInfo
    let _list = state.list
    let search = state.search
    let pageData = state.pageData
    let filter = state.filter
    switch (action.type) {
        case ICO.ADD_DATA:
            return {...state, ...action.data}
        case ICO.ADD_QUERY:
            return {...state, query: {..._query, ...action.data}}
        case ICO.SET_SEARCH_QUERY:
            return {...state, search: {...search, ...action.data}}
        case ICO.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case ICO.SET_FILTER_DATA:
            return {...state, filter: {...filter, ...action.data}}
        case ICO.EDIT_USER_INFO:
            return {...state, userInfo: {..._userInfo, ...action.data}}
        case ICO.EDIT_LIST_ITEM:
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
        case ICO.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        case SELECTEDDATA:
            return {...state, selectedData: action.data}
        default:
            return state
    }
}

export default postInfo
