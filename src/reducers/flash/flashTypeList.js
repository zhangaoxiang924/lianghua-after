/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { FLASHTYPELIST } from '../../constants/index'

const flashTypeListInfo = (state = [], action) => {
    switch (action.type) {
        case FLASHTYPELIST:
            return action.typeOptions
        default:
            return state
    }
}

export default flashTypeListInfo
