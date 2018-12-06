/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {POST} from '../../constants/index'

const authorityInfo = (state = {query: {}, list: []}, action) => {
    let _query = state.query
    let _list = state.list
    switch (action.type) {
        case POST.ADD_DATA:
            return {...state, ...action.data}
        case POST.ADD_QUERY:
            return {...state, query: {..._query, ...action.data}}
        case POST.EDIT_LIST_ITEM:
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
        case POST.DEL_LIST_ITEM:
            return {...state, list: [..._list.slice(0, action.index), ..._list.slice(action.index + 1)]}
        default:
            return state
    }
}

export default authorityInfo
