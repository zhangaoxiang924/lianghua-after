/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {LIVECONTENT, SELECTEDDATA} from '../../constants/index'

const liveContentInfo = (
    state = {
        pageData: {'currentPage': 1, 'pageSize': 30, 'totalCount': 0, pageCount: 0},
        list: null,
        info: {},
        replyList: []
    }, action) => {
    let _list = state.list
    let pageData = state.pageData
    switch (action.type) {
        case LIVECONTENT.ADD_DATA:
            return {...state, ...action.data}
        case LIVECONTENT.MORE_DATA:
            return {...state, list: _list.concat(action.data.list)}
        case LIVECONTENT.SET_PAGE_DATA:
            return {...state, pageData: {...pageData, ...action.data}}
        case LIVECONTENT.EDIT_LIST_ITEM:
            let _thisItem = _list[action.index]
            return {
                ...state,
                list: [
                    ..._list.slice(0, action.index), {
                        ..._thisItem,
                        ...action.actionData
                    },
                    ..._list.slice(action.index + 1)
                ]
            }
        case LIVECONTENT.INSERT_LIVE:
            return {...state, pageData: {...pageData, 'totalCount': pageData.totalCount + 1}, list: [...[action.newLive], ..._list]}
        case LIVECONTENT.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        case SELECTEDDATA:
            return {...state, selectedData: action.data}
        default:
            return state
    }
}

export default liveContentInfo
