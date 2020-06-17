/**
 * file 商品
 */

const goods = (state = {}, action) => {
  switch (action.type) {
    case 'GET_GOODS':
      if (action.data && action.data.page !== 1) {
        state.data.msg = state.data.msg.concat(action.data.msg)
        state.data.page = action.data.page
        state.data.category = action.data.category ? action.data.category : false
        return {...state}
      } else {
        return {...action}
      }
      break
    case 'CHANGEPAGE':
      state.data.page = action.page
      return {...state}
      break
    case 'RANKING':
      state.data.msg = action.list
      return {...state}
      break
    default:
      return state
  }
}

export default goods