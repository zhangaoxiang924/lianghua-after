/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {NEWSMERGE, SELECTEDDATA} from '../../constants/index'

const columnAuthorInfo = (
    state = {
        contentList: [],
        filter: {status: '3', type: '0'},
        search: {'nickName': '', 'title': '', 'type': 'init', symbol: ''},
        pageData: {'currentPage': 1, 'pageSize': 10, 'totalCount': 0},
        query: {},
        list: [],
        info: {},
        numArr: []
    }, action) => {
    let _query = state.query
    let _userInfo = state.userInfo
    let _list = state.list
    let search = state.search
    let pageData = state.pageData
    let filter = state.filter
    switch (action.type) {
        case NEWSMERGE.ADD_DATA:
            return {...state, ...action.data}
        case NEWSMERGE.ADD_QUERY:
            return {...state, query: {..._query, ...action.data}}
        case NEWSMERGE.SET_SEARCH_QUERY:
            return {...state, search: {...search, ...action.data}}
        case NEWSMERGE.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case NEWSMERGE.SET_FILTER_DATA:
            return {...state, filter: {...filter, ...action.data}}
        case NEWSMERGE.EDIT_USER_INFO:
            return {...state, userInfo: {..._userInfo, ...action.data}}
        case NEWSMERGE.EDIT_LIST_ITEM:
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
        case NEWSMERGE.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        case NEWSMERGE.GET_TOP_NUM:
            return {...state, numArr: action.actionData}
        case SELECTEDDATA:
            return {...state, selectedData: action.data}
        default:
            return state
    }
}

export default columnAuthorInfo
