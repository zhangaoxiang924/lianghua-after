/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {IMGS} from '../../constants/index'

const imgsInfo = (state = {ReviewList: [], postList: []}, action) => {
    let _list = state.ReviewList
    switch (action.type) {
        case IMGS.ADD_DATA:
            return {...state, ...action.data}
        case IMGS.EDIT_LIST_ITEM:
            let _thisItem = _list[action.index]
            return {
                ...state,
                ReviewList: [
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

export default imgsInfo
