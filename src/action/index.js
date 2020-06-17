import * as type from './type';
import * as http from '../axios/index';

import * as API from '../api'
// eslint-disable-next-line no-unused-vars
import { post } from "../axios/index";

const requestData = category => ({
  type: type.REQUEST_DATA,
  category
})

export const receiveData = (data, category) => ({
  type: type.RECEIVE_DATA,
  data,
  category
})


/**
 * 请求数据调用方法
 * @param funcName      请求接口的函数名
 * @param params        请求接口的参数
 */

export const fetch = ({ funcName, params, stateName }) => dispatch => {
  !stateName && (stateName = funcName);
  dispatch(requestData(stateName));
  return http[funcName](params).then(res => dispatch(receiveData(res, stateName)));
}

/**
 * [获取分类列表]
 * @param  {Function} id [description]
 * @return {[type]}      [description]
 */
export const getCategory = (id = 0) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch({
        type: 'GET_CATEGORY',
        status: 'pending'
      })
      const response = await API.getcategory(id)
      dispatch({
        type: 'GET_CATEGORY',
        status: response.status === 200 ? 'resolve' : 'reject',
        data: response.data,
        id
      })
      resolve(response.data)
    } catch (error) {
      reject(error)
      dispatch({
        type: 'GET_CATEGORY',
        status: 'error'
      })
    }
  })
}

/**
 * [获取商品列表]
 * @param  {Function} {rows [description]
 * @return {[type]}          [description]
 */
export const getGoods = ({a=0, isFissionScale = false, page = 1, rows = '16', category = '0', search = '', store_id, type = '' }) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.getgoods2({
        isFissionScale,
        page,
        rows,
        category,
        search,
        store_id: store_id || (getState().store.data && getState().store.data.id),
        type,
        a
      })
      dispatch({
        type: 'GET_GOODS',
        status: response.status === 200 ? 'resolve' : 'reject',
        data: Object.assign({}, response.data, { page }),
      })
      resolve(response.data)
    } catch (error) {
      reject(error)
      dispatch({
        type: 'GET_GOODS',
        status: 'error'
      })
    }
  })
}
/**
 * 获取下架商品列表
 * @param page
 * @param rows
 * @param category
 * @param search
 * @param store_id
 * @param type
 * @returns {function(*, *): Promise}
 */
export const getoutGoods = ({ uniacid, page = 1, rows = '16', category = '0', search = '', store_id, type = '' }) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.downDetail({
        uniacid,
        page,
        rows,
        category,
        search,
        store_id: store_id || (getState().store.data && getState().store.data.id),
        type
      })

      dispatch({
        type: 'GET_GOODS',
        status: response.status === 200 ? 'resolve' : 'reject',
        data: Object.assign({}, response.data, { page }),
      })
      resolve(response.data)
    } catch (error) {
      reject(error)
      dispatch({
        type: 'GET_GOODS',
        status: 'error'
      })
    }
  })
}


/**
 * [获取商品列表]
 * @param  {Function} {rows [description]
 * @return {[type]}          [description]
 */
export const getsearchGoods = ({
  page = 1,
  rows = '10',
  category = '0',
  search = '',
  store_id,
  type,
  a = 0,
}) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.getgoods2({
        page,
        rows,
        category,
        search,
        store_id: store_id || (getState().store.data && getState().store.data.id),
        type,
        a,
      })
      dispatch({
        type: 'GET_GOODS',
        status: response.status === 200 ? 'resolve' : 'reject',
        data: Object.assign({}, response.data, { page }),
      })
      resolve(response.data)
    } catch (error) {
      reject(error)
      dispatch({
        type: 'GET_GOODS',
        status: 'error'
      })
    }
  })
}
/**
 * 搜索下架商品
 * @param page
 * @param rows
 * @param category
 * @param search
 * @param store_id
 * @param type
 * @returns {function(*, *): Promise}
 */
export const getoutsearchGoods = ({ uniacid, page = 1, rows = '10', category = '0', search = '', store_id, type }) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.downDetail({
        uniacid,
        page,
        rows,
        category,
        search,
        store_id: store_id || (getState().store.data && getState().store.data.id),
        type
      })
      dispatch({
        type: 'GET_GOODS',
        status: response.status === 200 ? 'resolve' : 'reject',
        data: Object.assign({}, response.data, { page }),
      })
      resolve(response.data)
    } catch (error) {
      reject(error)
      dispatch({
        type: 'GET_GOODS',
        status: 'error'
      })
    }
  })
}
/**
 * [改变当前页数]
 * @param  {[type]} page [页码]
 * @return {[type]}      [description]
 */
export const changePage = page => (dispatch, getState) => {
  dispatch({
    type: 'CHANGEPAGE',
    page
  })
}

export const ranking = list => (dispatch, getState) => {
  dispatch({
    type: 'RANKING',
    list
  })
}

/**
 * [将当前订单挂单]
 * @param {Object} 会员信息
 * @param {Array} 商品列表
 */
export const setOrderList = (member, itemList) => async (dispatch, getState) => {
  if (itemList.length === 0) return false

  dispatch({
    type: 'SET_ORDERLIST',
  })

  let response = await API.setPendingOrder({
    msg: JSON.stringify({
      '0': itemList,
      '1': member,
      '2':'',
      '3':''
    })
  })

  return response
}

// export function setOrderList(member){
// 	console.log(member)
// 	// {
// 	// 	type: 'RESET_ORDERLIST',
// 	// 	list,
// 	// 	index
// 	// }
// }

/**
 * [挂单到当前单]
 * @param  {[type]} index [订单数组下标]
 * @return {[type]}       [description]
 */
export const replaceOrderList = list => (dispatch, getstate) => {
  dispatch({
    type: 'REPLACE_ORDERLIST',
    list
  })
}

/**
 * [添加商品到订单]
 * @param  {[type]} item [商品]
 * @return {[type]}      [description]
 */
export const addToOrderList = (item, index) => (dispatch, getState) => {
  dispatch({
    type: 'ADD_TO_ORDERLIST',
    item,
    index
  })
}

export const debugCacheDisorderOrderlist = ({ info }) => async (dispatch, getState) => {
  info = {
    ...info,
    "props的order": getState().order,
    "缓存中的order": JSON.parse(localStorage.getItem('__order')),
    "幸运的收银员": getState().sale.data,
    "北京时间": new Date().toLocaleString(),
  }
  let response = await API.debugCacheInfo({ info: JSON.stringify(info) })
    .catch(err => console.log(err))

  if (response) {
    dispatch({
      type: 'DEBUG_CACHE_DISORDER_ORDERLIST',
      index: 0,
    })
  }
}

/**
 * [从订单中移除商品]
 * @param  {[type]} barcode [商品条码]
 * @return {[type]}    [description]
 */
export const removeFromOrderList = (barcode, index, itemIndex = undefined) => ({
  type: 'REMOVE_FROM_ORDERLIST',
  barcode,
  index,
  itemIndex,
})

/**
 * [从订单中修改商品]
 * @param  {[type]} item [商品]
 * @return {[type]}      [description]
 */
export const updateFromOrderList = (item, index, itemIndex = undefined) => ({
  type: 'UPDATE_FROM_ORDERLIST',
  item,
  index,
  itemIndex,
})

/**
 * [清除订单]
 * @return {[type]} [description]
 */
export const clearOrderList = index => ({
  type: 'CLEARORDERLIST',
  index
})

/**
 * [覆盖当前订单]
 * @param  {[type]} list  [description]
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
export const resetOrderList = (list, index) => ({
  type: 'RESET_ORDERLIST',
  list,
  index
})

/**
 * [获取会员信息]
 * @param {*} value 会员手机号
 */
export const getMember = value => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.getmember(value)
      if (response.data.status === 4002) return
      dispatch({
        type: 'GET_MEMBER',
        status: response.status === 200 ? 'resolve' : 'reject',
        data: response.data.msg,
      })
      resolve(response.data.msg)
    } catch (error) {
      reject(error)
      dispatch({
        type: 'GET_MEMBER',
        status: 'error'
      })
    }
  })
}

export const updatamb = data => (dispatch, getState) => dispatch({
  type: 'GET_MEMBER',
  status: 'resolve',
  data,
})

/**
 * [临时修改会员信息，针对于促销日，临时调动会员权益]
 * @param  {[type]} rights [会员权益/会员折扣]
 * @return {[type]}        [description]
 */
export const updateMember = rights => ({
  type: 'UPDATE_FROM_MEMBER',
  rights,
})

/**
 * [将挂单的会员信息覆盖当前的会员信息]
 * @param  {[type]} data [会员]
 * @return {[type]}      [description]
 */
export const resetMember = data => ({
  type: 'REPLACE_MEMBER',
  data,
})

/**
 * [添加会员信息]
 * @param {*} name 会员姓名
 * @param {*} mobile 会员手机号
 * @param {*} birthday 会员生日
 * @param refund  1找回密码 0注册
 */
export const addMember = ({ name, mobile, birthday, pwd, refund }) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch({
        type: 'GET_MEMBER',
        status: 'pending'
      })
      const response = await API.addmember({ name, mobile, birthday, pwd, refund })
      dispatch({
        type: 'GET_MEMBER',
        status: response.status === 200 ? 'resolve' : 'reject',
        data: response.data.msg,
      })
      resolve(response.data)
    } catch (error) {
      reject(error)
      dispatch({
        type: 'GET_MEMBER',
        status: 'error'
      })
    }
  })
}
/*
* [修改会员资料]
*/
export const updatePosMember = ({ member_mobile, card_code }) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch({
        type: 'GET_MEMBER',
        status: 'pending'
      })
      const response = await API.updatePosMember({ member_mobile, card_code })
      // dispatch({
      // 	type: 'GET_MEMBER',
      // 	status: response.status === 200 ? 'resolve' : 'reject',
      // 	data: response.data.msg,
      // })
      resolve(response.data)
    } catch (error) {
      reject(error)
      dispatch({
        type: 'GET_MEMBER',
        status: 'error'
      })
    }
  })
}

/*
* [支付核验]
*/
export const firmOrder = ({ orderno }) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch({
        type: 'GET_MEMBER',
        status: 'pending'
      })
      const response = await API.firmOrder({ orderno })
      // dispatch({
      // 	type: 'GET_MEMBER',
      // 	status: response.status === 200 ? 'resolve' : 'reject',
      // 	data: response.data.msg,
      // })
      resolve(response.data)
    } catch (error) {
      reject(error)
      dispatch({
        type: 'GET_MEMBER',
        status: 'error'
      })
    }
  })
}

/**
 * [清空会员]
 * @return {[type]} [description]
 */
export const clearMember = () => ({
  type: 'CLEARMEMBER'
})

/**
 * [获取收银员]
 * @param  {[type]} dispatch [description]
 * @param  {[type]} getState [description]
 * @return {[type]}          [description]
 */
export const getsale = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'GET_SALE',
      status: 'pending'
    })
    const response = await API.getsale()
    dispatch({
      type: 'GET_SALE',
      status: response.status === 200 ? 'resolve' : 'reject',
      data: response.data,
    })
  } catch (error) {
    console.log(error)
    dispatch({
      type: 'GET_SALE',
      status: 'error'
    })
  }
}

/**
 * 添加权限
 */
export const authorization = ({ name, password, uniacid, member_id }) => (dispatch, getState) => {
  return new Promise(async (res, rej) => {
    try {
      dispatch({
        type: 'ADD_AUTHORITY',
        status: 'pending'
      })
      const response = await API.authorization({ name, password, uniacid, member_id })
      dispatch({
        type: 'ADD_AUTHORITY',
        status: response.status === 200 ? 'resolve' : 'reject',
        data: response.data,
      })
      res(response.data)
    } catch (err) {
      console.log(err)
      dispatch({
        type: 'ADD_AUTHORITY',
        status: 'error'
      })
      rej(err)
    }
  })
}

/**
 * 移除权限
 */
export const delete_authorization = () => ({
  type: 'DELETE_AUTHORITY'
})

/**
 * [满减]
 * @param  {[type]} dispatch [description]
 * @param  {[type]} getState [description]
 * @return {[type]}          [description]
 */
export const getFullSub = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'GET_FULLSUB',
      status: 'pending'
    })
    const response = await API.getFullSub()
    dispatch({
      type: 'GET_FULLSUB',
      status: response.status === 200 ? 'resolve' : 'reject',
      data: response.data,
    })
  } catch (error) {
    console.log(error)
    dispatch({
      type: 'GET_FULLSUB',
      status: 'error'
    })
  }
}

/**
 * [门店信息]
 * @param  {[type]} dispatch [description]
 * @param  {[type]} getState [description]
 * @return {[type]}          [description]
 */
export const getStore = () => async (dispatch, getState) => {
  try {
    const response = await API.getstore()
    dispatch({
      type: 'GET_STORE',
      status: response.status === 200 ? 'resolve' : 'reject',
      data: response.data,
    })
    return response
  } catch (error) {
    console.log(error)
    dispatch({
      type: 'GET_STORE',
      status: 'error'
    })
  }
}


export const eidtStore = (data) => ({
  type: 'EIDT_STORE',
  data
})

/**
 * [公共更改设置]
 * @param  {[type]} obj [更改对象 key: value]
 * @return {[type]}     [description]
 */
export const changeSetting = obj => (dispatch, getState) => {
  const setting = getState().setting
  dispatch({
    ...Object.assign({}, setting, { type: 'CHANGE_SETTING' }, obj)
  })
}

/**
 * [添加商品到调价单]
 * @param  {[type]} item [商品对象]
 * @return {[type]}      [135104552041858332
 * 135149724163138031
 * ]
 */
export const addToPriceAdjustmentList = item => (dispatch, getState) => {
  dispatch({
    type: 'ADD_TO_PRICEADJUSTMENTLIST',
    item,
  })
}

export const addToFundTransferList = item => (dispatch, getState) => {
  dispatch({
    type: 'ADD_TO_FUNDTRANSFER',
    item,
  })
}

export const addToPurchaseList = item => (dispatch, getState) => {
  dispatch({
    type: 'ADD_TO_PURCHASE',
    item,
  })
}

/**
 * [更新调价单中的商品]
 * @param  {[type]} item [商品对象]
 * @return {[type]}      [description]
 */
export const updateFromPriceAdjustmentList = item => (dispatch, getState) => {
  dispatch({
    type: 'UPDATE_FROM_PRICEADJUSTMENTLIST',
    item,
  })
}

export const updateFromFundTransferList = item => (dispatch, getState) => {
  dispatch({
    type: 'UPDATE_FROM_FUNDTRANSFER',
    item,
  })
}

export const updateFromPURCHASEList = item => (dispatch, getState) => {
  dispatch({
    type: 'UPDATE_FROM_PURCHASE',
    item,
  })
}

/**
 * [从调价单中删除该商品]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
export const removeFromPriceAdjustmentList = item => (dispatch, getState) => {
  dispatch({
    type: 'REMOVE_FROM_PRICEADJUSTMENTLIST',
    item,
  })
}

/**
 * [清空商品调价单]
 * @return {[type]}      [description]
 */
export const clearPriceAdjustmentList = () => (dispatch, getState) => {
  dispatch({
    type: 'CLEAR_PRICEADJUSTMENTLIST',
  })
}


/**
 * [添加商品到报损单]
 * @param  {[type]} item [商品对象]
 * @return {[type]}      [description]
 */
export const addToReportDamageList = item => (dispatch, getState) => {
  dispatch({
    type: 'ADD_TO_REPORT_DAMAGELIST',
    item,
  })
}

/**
 * [添加商品到下架单]
 * @param item
 * @returns {Function}
 */
export const addToSoldoutList = item => (dispatch, getState) => {
  dispatch({
    type: 'ADD_TO_SOLDOUT',
    item,
  })
}
/**
 * 添加商品到上架单
 * @param item
 * @returns {Function}
 */
export const addToputawayList = item => (dispatch, getState) => {
  dispatch({
    type: 'ADD_TO_PUTAWAY',
    item,
  })
}

/**
 * [更新报损单中的商品]
 * @param  {[type]} item [商品对象]
 * @return {[type]}      [description]
 */
export const updateFromReportDamageList = item => (dispatch, getState) => {
  dispatch({
    type: 'UPDATE_FROM_REPORT_DAMAGELIST',
    item,
  })
}

/**
 * [更新下架单中的商品]
 * @param item
 * @returns {Function}
 */
export const updateSoldoutList = item => (dispatch, getState) => {
  dispatch({
    type: 'UPDATE_FROM_SOLDOUT',
    item,
  })
}
/**
 * 【更新上架单的商品】
 * @param item
 * @returns {Function}
 */
export const updateputawayList = item => (dispatch, getState) => {
  dispatch({
    type: 'UPDATE_FROM_PUTAWAY',
    item,
  })
}

/**
 * [从报损单中删除该商品]
 * @param  {[type]} item [商品对象]
 * @return {[type]}      [description]
 */
export const removeFromReportDamageList = item => (dispatch, getState) => {
  dispatch({
    type: 'REMOVE_FROM_REPORT_DAMAGELIST',
    item,
  })
}

/**
 * [从下架单中删除该商品]
 * @param item
 * @returns {Function}
 */
export const removeSoldoutList = item => (dispatch, getState) => {
  dispatch({
    type: 'REMOVE_FROM_SOLDOUT',
    item,
  })
}
/**
 * 【从上架单删除该商品】
 * @param item
 * @returns {Function}
 */
export const removeputawayList = item => (dispatch, getState) => {
  dispatch({
    type: 'REMOVE_FROM_PUTAWAY',
    item,
  })
}
export const removeFromFundTransferList = item => (dispatch, getState) => {
  dispatch({
    type: 'REMOVE_FROM_FUNDTRANSFER',
    item,
  })
}

export const removeFromPURCHASEList = item => (dispatch, getState) => {
  dispatch({
    type: 'REMOVE_FROM_PURCHASE',
    item,
  })
}

/**
 * [获取库存单中的商品]
 * @param  {[type]} {page, pagesize})   [页码，每页数量]
 * @return {[type]}         [description]
 */
export const getStockGoods = ({ page, pagesize }) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.getStockGoods({ page, pagesize })
      dispatch({
        type: 'GET_STOCKGOODS',
        status: response.status === 200 ? 'resolve' : 'reject',
        data: response.data.msg
      })
      resolve(response.data)
    } catch (error) {
      dispatch({
        type: 'GET_STOCKGOODS',
        status: 'error'
      })
      reject(error)
    }
  })
}
//获取调拨单商品
export const getGoodsByWarehouseId = () => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.getGoodsByWarehouseId()
      dispatch({
        type: 'GET_STOCKGOODS',
        status: response.status === 200 ? 'resolve' : 'reject',
        data: response.data.msg
      })
      resolve(response.data)
    } catch (error) {
      dispatch({
        type: 'GET_STOCKGOODS',
        status: 'error'
      })
      reject(error)
    }
  })
}

/**
 * [库存单翻页]
 * @param  {[type]} page [页码]
 * @return {[type]}      [description]
 */
export const changePageStockGoods = page => (dispatch, getState) => {
  dispatch({
    type: 'CHANGEPAGE_STOCKGOODS',
    page
  })
}

/**
 * [清空报损单]
 * @param  {[type]} ) [description]
 * @return {[type]}   [description]
 */
export const clearReportDamageList = () => (dispatch, getState) => {
  dispatch({
    type: 'CLEAR_REPORT_DAMAGELIST'
  })
}

/**
 * 【清空下架单】
 * @returns {Function}
 */
export const clearsoldoutList = () => (dispatch, getState) => {
  dispatch({
    type: 'CLEAR_SOLDOUT'
  })
}
/**
 * [清空上架单]
 * @returns {Function}
 */
export const clearputawayList = () => (dispatch, getState) => {
  dispatch({
    type: 'CLEAR_PUTAWAY'
  })
}

export const clearFundTransferList = () => (dispatch, getState) => {
  dispatch({
    type: 'CLEAR_FUNDTRANSFER'
  })
}

export const clearPURCHASEList = () => (dispatch, getState) => {
  dispatch({
    type: 'CLEAR_PURCHASE'
  })
}

/**
 * [添加导购]
 * @param  {[type]} data  [导购对象]
 * @return {[type]}       [description]
 */
export const addGuide = data => (dispatch, getState) => {
  dispatch({
    type: 'ADD_GUIDE',
    data
  })
}

/**
 * [清空导购]
 * @param  {[type]} ) [description]
 * @return {[type]}   [description]
 */
export const clearGuide = () => (dispatch, getState) => {
  dispatch({
    type: 'CLEAR_GUIDE'
  })
}
export const getWarehouse = () => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.getWarehouse()
      dispatch({
        type: 'GET_STOCKGOODS',
        status: response.status === 200 ? 'resolve' : 'reject',
        data: response.data.msg
      })
      resolve(response.data)
    } catch (error) {
      dispatch({
        type: 'GET_STOCKGOODS',
        status: 'error'
      })
      reject(error)
    }
  })
}

export const getLeaflet = () => async (dispatch, getState) => {
  let response = await API.activeList()
  if (response.data && response.data.data && response.data.data.length > 0) {
    dispatch({
      type: 'SET_LEAFLET',
      data: response.data.data,
    })
  }
}