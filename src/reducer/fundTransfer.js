/**
 * file 商品调拨单
 */
import { notification } from 'antd'

const fundTransfer = (state={type: 'INIT', list: []}, action) => {
    let newList = [...state.list]
    const index = action.item&&newList.findIndex(item => item.barcode === action.item.barcode)
    switch(action.type) {
        case 'ADD_TO_FUNDTRANSFER':
            if( action.item.barcodeid == null ){
                notification.warning({
                    message: "提示",
                    description: "库存中不存在此商品",
                })
                return state
            }

            newList.some(item => {
                return item.goodsid == action.item.goodsid
            }) ? notification.warning({
                message: "提示",
                description: "重复的商品",
            }) : newList.unshift(action.item)

            return {type: action.type, list: newList}
        case 'UPDATE_FROM_FUNDTRANSFER':
            if(index !== -1) {
                newList[index] = Object.assign({}, action.item)
            }
            return {type: action.type, list: newList}
        case 'REMOVE_FROM_FUNDTRANSFER':
            if(index !== -1) newList.splice(index, 1)
            return {type: action.type, list: newList}
        case 'CLEAR_FUNDTRANSFER':
            return {type: action.type, list: []}
        default:
            return state
    }
}

export default fundTransfer