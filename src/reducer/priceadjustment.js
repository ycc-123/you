/**
 * file 商品调价单
 */
import {notification} from 'antd'

const priceadjustment = (state = {type: 'INIT', list: []}, action) => {
  let newList = [...state.list]
  const index = action.item && newList.findIndex(item => item.barcode === action.item.barcode)
  switch (action.type) {
    case 'ADD_TO_PRICEADJUSTMENTLIST':
      newList.some(item => {
        return item.barcode == action.item.barcode
      }) ? notification.warning({
        message: '提示',
        description: '重复的商品',
      }) : newList.unshift(action.item)
      if (action.item.newposprice == 0 && action.item.is_freegift !=2) {
        notification.warning({
          message: '提示',
          description: '不属于赠品，调价不能为0',
        })
        return state
      }

      newList.map(item => {
        if (+item.newposprice < 0.01 && action.item.is_freegift !=2) {
          item.newposprice = '0.01'
          notification.warning({
            message: '提示',
            description: '调价最小为0.01',
          })
        }
        item.newposprice.match(/\d{0,}\.{0,1}\d{0,2}/) ? item.newposprice = item.newposprice.match(/\d{0,}\.{0,1}\d{0,2}/)[0] : null
        return item
      })

      return {type: action.type, list: newList}
    case 'UPDATE_FROM_PRICEADJUSTMENTLIST':
      if (index !== -1) {
        if (action.item.newposprice == 0) {
          notification.warning({
            message: '提示',
            description: '调价不能为0',
          })
          return state
        }

        newList[index] = Object.assign({}, action.item)

        newList.map(item => {
          if (+item.newposprice < 0.01) {
            item.newposprice = '0.01'
            notification.warning({
              message: '提示',
              description: '调价最小为0.01',
            })
          }
          item.newposprice.match(/\d{0,}\.{0,1}\d{0,2}/) ? item.newposprice = item.newposprice.match(/\d{0,}\.{0,1}\d{0,2}/)[0] : null
          return item
        })
      }
      return {type: action.type, list: newList}
    case 'REMOVE_FROM_PRICEADJUSTMENTLIST':
      if (index !== -1) newList.splice(index, 1)
      return {type: action.type, list: newList}
    case 'CLEAR_PRICEADJUSTMENTLIST':
      return {type: action.type, list: []}
    default:
      return state
  }
}

export default priceadjustment
