/**
 * file 商品下架单
 */
import { notification } from 'antd'

const soldout = (state={type: 'INIT', list: []}, action) => {
    let newList = [...state.list]
    const index = action.item&&newList.findIndex(item => item.barcode === action.item.barcode)
    switch(action.type) {
        case 'ADD_TO_SOLDOUT':
            newList.some( ( item )=>{
                return item.goodsid === action.item.goodsid
            } ) ? notification.error({
                message: '提示',
                description: '重复的商品',
            }) : newList.unshift(action.item)

            if(newList.some( ( item )=>{ return item.maplist.length < 1 } )){
                notification.error({
                    message: '提示',
                    description: '商品条码为空',
                })
                return state
            }

            return {type: action.type, list: newList}
        case 'UPDATE_FROM_SOLDOUT':
            if(index !== -1) {
                newList[index] = Object.assign({}, action.item)
            }
            return {type: action.type, list: newList}
        case 'REMOVE_FROM_SOLDOUT':
            if(index !== -1) newList.splice(index, 1)
            return {type: action.type, list: newList}
        case 'CLEAR_SOLDOUT':
            return {type: action.type, list: []}
        default:
            return state
    }
}

export default soldout