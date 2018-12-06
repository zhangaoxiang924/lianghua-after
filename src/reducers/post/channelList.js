/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { CHANNELLIST } from '../../constants/index'

const channelListInfo = (state = [], action) => {
    switch (action.type) {
        case CHANNELLIST:
            return action.channelIdOptions
        default:
            return state
    }
}

export default channelListInfo
