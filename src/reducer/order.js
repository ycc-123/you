/**
 * file 订单
 */


const KEY = '__order'
const LOCAL = getLocalStorage()

// 获取本地存锤
function getLocalStorage(key = KEY) {
  const str = localStorage.getItem(key)
  return str ? JSON.parse(str) : { dataList: [], members: [], orderIndex: -1, }
}

// 存储到本地
function setLocalStorage(value, key = KEY) {
  localStorage.setItem(key, value)
}

// const initState = {
// 	dataList: [],
// 	members: [],
// 	orderIndex: -1,
// }

const order = (state = { ...LOCAL }, action) => {

  let dataList;
  let members = [...state.members]
  let orderIndex = action.index
  let newState = [...state.dataList]

  switch (action.type) {

    /**
     * 挂起当前订单
     */
    case 'SET_ORDERLIST':

      if (
        (!state.orderIndex || state.orderIndex === -1)
        && (newState[0] && newState[0].length !== 0)
      ) {
        // !(state.dataList.length === state.members.length)
        //   && state.members.unshift(action.member)
        state.dataList = []
      }
      orderIndex = -1
      dataList = state.dataList.slice()
      members = state.members.slice()
      break
    /**
     * 将挂单取出
     */
    case 'REPLACE_ORDERLIST':
      dataList = [action.list]
      orderIndex = 0
      break
    case 'ADD_TO_ORDERLIST':
      // 这里选择concat连接数组，而不选择push一个item
      //【数组是引用类型，而state必须返回全新的对象，进行覆盖】
      // newState[orderIndex] = typeof newState[orderIndex] === 'undefined' ? [] : newState[orderIndex].slice()
      // newState[orderIndex] = newState[orderIndex].concat([action.item])
      // dataList = newState
      if (typeof newState[orderIndex] === 'undefined') newState[orderIndex] = []
      newState[orderIndex].push(action.item)
      dataList = [...newState]
      break
    case 'REMOVE_FROM_ORDERLIST':
      if (typeof action.itemIndex === "undefined") {
        let index = newState[orderIndex].findIndex(item => item.barcode === action.barcode)
        // if (index !== -1) {
        //   // 对orerIndex的深拷贝
        //   newState[orderIndex] = newState[orderIndex].slice()
        //   newState[orderIndex].splice(index, 1)
        // }
        if (index !== -1) newState[orderIndex].splice(index, 1)
      } else {
        newState[orderIndex].splice(action.itemIndex, 1)
      }
      dataList = [...newState]
      break
    /**
     * 对订单商品修改 改数量
     */
    case 'UPDATE_FROM_ORDERLIST':
      if (typeof action.itemIndex === "undefined") {
        let i = newState[orderIndex].findIndex(item => item.barcode === action.item.barcode)
        // if (i !== -1) {
        //   // 对orerIndex的深拷贝
        //   newState[orderIndex] = newState[orderIndex].slice()
        //   newState[orderIndex][i] = Object.assign({}, action.item)
        // }
        if (i !== -1) newState[orderIndex][i] = action.item
      } else {
        newState[orderIndex][action.itemIndex] = action.item
      }

      dataList = [...newState]
      break
    case 'CLEARORDERLIST':
      newState.splice(orderIndex, 1)
      /**
       * dataList 数组的头元素 是一个空数组而members却没有， 这里要将下标 -1
       */
      orderIndex && members.splice(orderIndex - 1, 1)
      dataList = newState
      members = members.slice()
      orderIndex = state.orderIndex > orderIndex ? orderIndex : (state.orderIndex === orderIndex ? -1 : orderIndex - 1)
      break
    /**
     * 对当前订单的覆盖
     */
    case 'RESET_ORDERLIST':
      newState[orderIndex] && newState.splice(orderIndex, 1, action.list)
      dataList = newState
      break
    case 'DEBUG_CACHE_DISORDER_ORDERLIST':
      localStorage.removeItem('__order')
      dataList = newState
      break
    default:
      dataList = state.dataList
      orderIndex = state.orderIndex
      break
  }
  let result = JSON.stringify({ dataList, orderIndex, members })

  // if (setLocalStorage.timer) clearTimeout(setLocalStorage.timer)
  // setLocalStorage.timer = setTimeout(() => {
  //   setLocalStorage(result)
  // }, 500)
  
  setLocalStorage(result) // 更新本地存储    
  return JSON.parse(result)
}

export default order

