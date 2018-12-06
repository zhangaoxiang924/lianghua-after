/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {COLUMNAUTHOR, SELECTEDDATA} from '../../constants/index'

const columnAuthorInfo = (
    state = {
        contentList: [],
        filter: {type: '0'},
        search: {'nickName': '', 'title': '', 'type': 'init', search: ''},
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
        case COLUMNAUTHOR.ADD_DATA:
            return {...state, ...action.data}
        case COLUMNAUTHOR.ADD_QUERY:
            return {...state, query: {..._query, ...action.data}}
        case COLUMNAUTHOR.SET_SEARCH_QUERY:
            return {...state, search: {...search, ...action.data}}
        case COLUMNAUTHOR.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case COLUMNAUTHOR.SET_FILTER_DATA:
            return {...state, filter: {...filter, ...action.data}}
        case COLUMNAUTHOR.EDIT_USER_INFO:
            return {...state, userInfo: {..._userInfo, ...action.data}}
        case COLUMNAUTHOR.EDIT_LIST_ITEM:
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
        case COLUMNAUTHOR.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        case COLUMNAUTHOR.GET_TOP_NUM:
            return {...state, numArr: action.actionData}
        case SELECTEDDATA:
            return {...state, selectedData: action.data}
        default:
            return state
    }
}

export default columnAuthorInfo
