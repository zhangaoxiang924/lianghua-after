/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {INITGAME} from '../../constants/index'

const InitGameInfo = (state = {query: {}, list: []}, action) => {
    let _query = state.query
    let _list = state.list
    switch (action.type) {
        case INITGAME.ADD_DATA:
            return {...state, ...action.data}
        case INITGAME.ADD_QUERY:
            return {...state, query: {..._query, ...action.data}}
        case INITGAME.EDIT_LIST_ITEM:
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
        default:
            return state
    }
}

export default InitGameInfo
