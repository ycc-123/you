/**
 * file 商品采购单
 */
import {notification} from "antd"

const purchase = (state = {type: 'INIT', list: []}, action) => {
  let newList = [...state.list]
  const index = action.item && newList.findIndex(item => item.barcode === action.item.barcode)
  switch (action.type) {
    case 'ADD_TO_PURCHASE':
      newList.some(item => {
        return item.goodsid == action.item.goodsid
      }) ? notification.warning({
        message: '提示',
        description: '重复的商品',
      }) : newList.unshift(action.item)

      return {type: action.type, list: newList}
    case 'UPDATE_FROM_PURCHASE':
      if (index !== -1) {
        newList[index] = Object.assign({}, action.item)
      }
      return {type: action.type, list: newList}
    case 'REMOVE_FROM_PURCHASE':
      if (index !== -1) newList.splice(index, 1)
      return {type: action.type, list: newList}
    case 'CLEAR_PURCHASE':
      return {type: action.type, list: []}
    default:
      return state
  }
}

export default purchase