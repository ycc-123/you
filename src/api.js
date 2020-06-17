/**
 * file 接口文件
 */

import { get, post } from './axios'
// location.origin
let POSAPI
let POSONLINE
let wsJava
if (process.env.NODE_ENV === 'development') {
  POSAPI = '/api/huodieposV3/sys'
  POSONLINE = '/api/huodieposV3/proxy'
  wsJava = '/api/huodieposV3'
} else {
  POSAPI = 'http://127.0.0.1:8089/huodieposV3/sys'
  POSONLINE = 'http://127.0.0.1:8089/huodieposV3/proxy'
  wsJava = 'http://127.0.0.1:8089/huodieposV3'
  // POSAPI = 'http://192.168.1.121:8089/huodieposV3/sys'
  // POSONLINE = 'http://192.168.1.121:8089/huodieposV3/proxy'
}
let print_number = localStorage.getItem('print_number')?localStorage.getItem('print_number'):1
if(localStorage.getItem('print_number')){
  print_number = localStorage.getItem('print_number')
}else{
  print_number = 1
}
// const TEST = '/test/huodieposV3/sys'
// const POSAPI = '/api/sys'
/**
 * 分类列表
 * @return {[type]}            [promise]
 */
export const getcategory = () => {
  return post({ url: POSONLINE + '/getcategory', data: {} })
}
/**
 * 会员列表
 * @return {[type]}            [promise]
 */
export const findMember = ({
  search
}) => {
  return post({ url: POSONLINE + '/findMember', data: {
   search
  } })
}
/**
 * [获取单品明细]
 * @param  {[type]} page    [页码]
 * @param  {[type]} store_ids [门店id]
 * @param  {[type]} starttime       [开始时间]
 * @param  {[type]} endtime    [结束时间
 *  * @param  {[type]} goods_name    [商品名字]
 */
export const erpStoresGoods = ({
  page,
  store_ids,
  starttime,
  endtime,
  goods_name
}) => {
  return post({
    url: POSONLINE + "/erpStoresGoods",
    data: { page, store_ids, starttime, endtime, goods_name }
  });
};
/**
 * 商品新增
 * @returns {*}
 */
export const addgoods = ({ intercode, categoryid, store_id, uniacid, code, name, py, unit, posprice, memberprice, is_membership, is_memberprice, commission_model, }) => {
  return post({
    url: POSONLINE + '/addgoods',
    data: {
      categoryid,
      store_id,
      uniacid,
      code,
      name,
      py,
      unit,
      posprice,
      memberprice,
      is_membership,
      is_memberprice,
      commission_model,
      intercode,
    }
  })
}

/**
 * [获取商品 根据分类ID 或 搜索条件]
 * @param  {[type]} options.rows     [pagesize 每页显示多少个]
 * @param  {[type]} options.page     [page 第几页]
 * @param  {[type]} options.category [分类id]
 * @param  {[type]} options.search   [搜索条件 商品条码 或 商品名称]
 * @param  {[type]} options.store_id [门店id]
 * @return {[type]}                  [promise]
 */
export const getgoods = ({ rows, page, category, search, store_id }) => {
  return post({ url: POSONLINE + '/getgoods', data: { rows, page, category, search, store_id } })
}
export const splitscreen = () => {
  return post({ url: POSONLINE + '/splitscreen', data: {} })
}
export const getgoods2 = ({
  isFissionScale,
  rows,
  page,
  category,
  search,
  store_id,
  type,
  a,
}) => {
  return post({
    url: POSONLINE + '/getgoods2',
    data: {
      isFissionScale,
      rows,
      page,
      category,
      search,
      store_id,
      type,
      a,
    }
  })
}

export const printAlloction = ({ docdate, docno, outwarehouse, inwarehouse, gnum, status, printTime, nick_name, list, transfer_totalmoney, transfer_totalnumber, }) => {
  return post({
    url: POSAPI + '/system/printAlloction',
    data: { docdate, docno, outwarehouse, inwarehouse, gnum, status, printTime, nick_name, list, transfer_totalmoney, transfer_totalnumber, }
  })
}
export const printList = ({msg}) => {
  return post({
    url: POSAPI + '/system/printList',
    data: { msg }
  })
}
export const feierPrint = ({msg}) => {
  return post({
    url: POSAPI + '/system/feierPrint',
    data: { msg }
  })
}
export const downDetail = ({ uniacid, rows, page, category, search, store_id, type }) => {
  return post({ url: POSONLINE + '/downDetail', data: { uniacid, rows, page, category, search, store_id, type } })
}

export const getgoods3 = ({ rows, page, category, search, store_id, type }) => {
  return post({ url: POSONLINE + '/getgoods3', data: { rows, page, category, search, store_id, type } })
}
/**
 * 获取会员信息
 * @param {*} value [value填写的手机号或者会员号]
 */
export const getmember = value => {
  return post({ url: POSONLINE + '/getMemberInfo', data: { mobile: value } })
}


/**
 * [添加会员信息]
 * @param  {[type]} options.name     [会员姓名]
 * @param  {[type]} options.mobile   [会员的手机号码]
 * @param  {[type]} options.birthday [会员的生日]
 * @param refund  1找回密码 0注册
 * @return {[type]}                  [description]
 */
export const addmember = ({ name, mobile, birthday, pwd = '', refund,edit_mobile,edit_name }) => {
  return post({ url: POSONLINE + '/addMember', data: { name, birthday, mobile, pwd, refund ,edit_mobile,edit_name} })
}

/**
 * 充值界面接口
 */
export const getrecharge = () => {
  return post({ url: POSONLINE + '/getRecharge', data: {} })
}

/**
 * 充值接口
 * @param {*} memberid [memberid会员的id]
 * @param {*} recharge_id [recharge_id面值的id]
 * @param {*} createid [收银员id]
 * @param {*} pay_type [支付方式]
 * @param {*} auth_code [微信当面付， 支付宝当面付]
 * @param {*} member_amount [充值面额]
 * @param {*} member_selling [充值付款金额]
 */
export const addrecharge = ({ soundSwitch, member_id, createid, recharge_id, pay_type, auth_code, member_amount, member_selling,print_number }) => {
  return post({
    url: POSONLINE + '/recharge',
    data: { soundSwitch, member_id, createid, recharge_id, pay_type, auth_code, member_amount, member_selling,print_number }
  })
}

/**
 * [充值校验 微信，支付宝当面付]
 * @param  {[type]} options.num      [轮询次数]
 * @param  {[type]} options.recordid [充值订单的id]
 * @return {[type]}                  [description]
 */
export const checkRecharge = ({ num, recordid,print_number }) => {
  return post({ url: POSONLINE + '/checkRecharge', data: { num, recordid ,print_number} })
}

/**
 * [订单提交]
 * @param  {[type]} order [订单对象]
 * @return {[type]}       [description]
 */
// export const createorder = order => {
// 	return post({url: POSAPI+'/order/createorder', data: order})
// }

export const createorder = order => {
  return post({ url: POSONLINE + '/createOrder', data: order })
}


/**
 * 权限验证
 */
export const authorization = ({ name = "", password = "", uniacid, member_id = "" }) => {
  return post({ url: POSONLINE + '/authorization', data: { name, password, uniacid, member_id } })
}

/**
 * [满减]
 * @return {[type]} [description]
 */
export const getFullSub = () => {
  return post({ url: POSONLINE + '/getFullSub', data: {} })
}

/**
 * [收银员]
 * @return {[type]} [description]
 */
export const getsale = () => {
  return post({ url: POSONLINE + '/getsale', data: {} })
}

/**
 * [获取重量]getsearchGoodgoodsDowns
 * @return {[type]} [description]
 */
export const getWeight = () => {
  return get({ url: POSAPI + '/system/getWeight' })
}

export const timeStamp = () => {
  return post({ url: POSONLINE + '/timeStamp', data: {} })
}
/**
 * [获取实时重量]
 * @return {[type]} [description]
 */
export const getWeightShow = () => {
  return get({ url: POSAPI + '/system/getWeightShow' })
}
/**
 * [重量清零]
 * @return {[type]} [description]
 */
export const clearTare = () => {
  return get({ url: POSAPI + '/system/clearTare' })
}

/**
 * [门店信息]
 * @return {[type]} [description]
 */
export const getstore = () => {
  return post({ url: POSONLINE + '/getstore', data: {} })
}

/**
 * [搜索商品信息]
 * @param  {[type]} options.goods_name  [商品名称]
 * @param  {[type]} options.goods_code  [商品编码]
 * @param  {[type]} options.barcode     [商品条码]
 * @param  {[type]} options.warehouseid [门店id]
 * @return {[type]}                     [description]
 */
export const SearchGoods = ({ goods_name, goods_code, barcode, warehouseid }) => {
  return post({ url: POSONLINE + '/searchGoods', data: { goods_name, goods_code, barcode, warehouseid } })
}
/**
 * [获取商品信息表头]
 */
export const GetGoodsHead = () => {
  return post({ url: POSONLINE + '/getGoodsHead', data: {} })
}

/**
 * [搜索订单]
 * @param  {[type]} options.orderno   [订单号]
 * @param  {[type]} options.starttime [时间 YYYY-MM-DD]
 * @return {[type]}                   [description]
 */
export const getOrders = ({ orderno, starttime, store_id, endtime, startmoney, endmoney,status}) => {
  return post({ url: POSONLINE + '/getOrders', data: { orderno, starttime, store_id, endtime, startmoney, endmoney ,status} })
}

/**
 * [订单下的商品列表]
 * @param  {[type]} orderno [订单号]
 * @return {[type]}         [description]
 */
export const getGoodsByOrder = orderno => {
  return post({ url: POSONLINE + '/getGoodsByOrder', data: { orderno } })
}
/**
 *
 * @param orderno
 * @returns {*}
 */
export const deriveUnit = uniacid => {
  return post({ url: POSONLINE + '/deriveUnit', data: { uniacid } })
}

/**
 * [退款]
 * @param  {[type]} options.orderno    [订单号]
 * @param  {[type]} options.refund_fee [退款金额]
 * @param  {[type]} options.list       [部分退款 商品数组]
 * @param  {[type]} options.reason     [退款原因]
 * @return {[type]}                    [description]
 */
export const refund = ({ orderno, refund_fee, list, reason, refundArrs,print_number }) => {
  return post({ url: POSONLINE + '/refund', data: { orderno, refund_fee, list, reason, refundArrs,print_number } })
}

/**
 * [订单打印小票]
 * @param  {[type]} orderno [订单号]
 * @return {[type]}         [description]
 */
export const printTicket = ({
  orderno,
  refund,
}) => {
  return post({ url: POSONLINE + '/printTicket', data: { 
    orderno ,
    refund
  } })
}

//充值退款补打
export const refundPrintTicket = ({ member_id, uniacid, recharge_id,pay_type,store_id }) => {
  return post({ url: POSONLINE + '/refundPrintTicket', data: { member_id, uniacid, recharge_id,pay_type,store_id } })
}
//充值补打
export const rechargePrintTicket = ({ member_id, uniacid, recharge_id,pay_type,store_id }) => {
  return post({ url: POSONLINE + '/rechargePrintTicket', data: { member_id, uniacid, recharge_id,pay_type,store_id} })
}
//积分兑换list
export const scoreGoods = () => {
  return post({ url: POSONLINE + '/scoreGoods', data: {} })
}
//减积分
export const removeScore = ({
  member_id,
  score
}) => {
  return post({ url: POSONLINE + '/removeScore', data: {
    member_id,
    score
  } })
}
// scoreExchange积分商品兑换
export const scoreExchange = ({  uniacid,store_id,goodsid,userid,use_score,cashier_id,gnum   }) => {
  return post({ url: POSONLINE + '/scoreExchange', data: {  uniacid,store_id,goodsid,userid,use_score,cashier_id,gnum  } })
}
/**
 * [交班单 收银员 收银记录]
 * @param  {[type]} options.store_id   [门店id]
 * @param  {[type]} options.cashier_id [收银员id]
 * @return {[type]}                    [description]
 */
export const getCashierRecord = ({ store_id, cashier_id, createtime }) => {
  return post({ url: POSONLINE + '/getCashierRecord', data: { store_id, cashier_id, createtime } })
}
export const getStore = () => {
  return post({ url: POSONLINE + '/getstore'})
}
/**
 * [历史交班单]
 * @param  {[type]} options.starttime [开始时间]
 * @param  {[type]} options.endtime   [结束时间]
 * @return {[type]}                   [description]
 */
export const getCashierRecords = ({ starttime, endtime }) => {
  return post({ url: POSONLINE + '/getCashierRecords', data: { starttime, endtime } })
}

/**
 * [打印历史交班单]
 * @param  {[type]} obj [交班单对象]
 * @return {[type]}     [description]
 */
export const printCashierRecord = obj => {
  return post({ url: POSONLINE + '/printCashierRecord', data: { ...obj } })
}

/**
 * [提交交班单]
 * @param  {[type]} options.store_id   [门店id]
 * @param  {[type]} options.cashier_id [收银员id]
 * @param  {[type]} options.cash_zf    [实收现金]
 * @param  {[type]} options.msg        [当天收银汇总梗概]
 * @param  {[type]} options.print      [是否打印交班单]
 * @param  {[type]} options.advance    [备用金]
 * @return {[type]}                    [description]
 */
export const updateCashierRecord = ({ store_id, cashier_id, cash, msg, print, advance }) => {
  return post({ url: POSONLINE + '/updateCashierRecord', data: { store_id, cashier_id, cash, msg, print, advance } })
}


/**
 * 支付校验
 * 判断是否支付成功
 * @param {} data
 */
export const CheckPay = data => {
  return post({ url: POSONLINE + '/checkPay', data: data })
}
/**
 *  微信刷卡,支付宝面对面,余额抵扣
 * @param {} data
 */
export const MicroPay = data => {
  return post({ url: POSONLINE + '/microPay', data: data })
}

/**
 * 是否有更新
 * @param {*} data
 */
export const IsUpdate = () => {
  return get({ url: POSAPI + '/system/isUpdate' })
}
/**
 * 请求更新
 * @param {*} data
 */
export const UpdateApi = () => {
  return get({ url: POSAPI + '/system/update' })
}

/**
 * 获取称重
 * @return string url
 */
export const getweightinfo = () => {
  return get({ url: POSAPI + '/store/getweightinfo' })
}

/**
 * [更新选择称重]
 * @param weightinfo string 大写称重拼音（JIANYU，DAHUA）
 * @param gorge string 称重机串口
 * @param printerType string 打印机类型
 * @return string url
 */
export const upweightinfo = ({ weightinfo, gorge, printerType }) => {
  return get({
    url: POSAPI + '/store/upweightinfo',
    params: {
      params: {
        weightinfo: JSON.stringify(weightinfo),
        gorge: JSON.stringify(gorge),
        printerType: JSON.stringify(printerType),
      }
    }
  })
}

/**
 * [到店核销 待核销商品]
 * @param  {[type]} mid [订单id]
 * @return {[type]}     [description]
 */
export const verification = mid => {
  return post({ url: POSONLINE + '/verification', data: { mid } })
}

/**
 * [到店核销 确认核销]
 * @param  {[type]} mid [订单id]
 * @return {[type]}     [description]
 */
export const validateOrder = (mid, djjm = "", money) => {
  return post({
    url: POSONLINE + '/validateOrder',
    data: {
      mid,
      djjm,
      money,
    }
  })
}

/**
 * [打开钱箱]
 * @return {[type]} [description]
 */
export const getOpen = ({ store_id, cashier_id }) => {
  return get({ url: POSAPI + '/system/getOpen?store_id=' + store_id + '&cashier_id=' + cashier_id })
}

/**
 * [提交调价单]
 * @param  {[type]} options.storeid   [门店id]
 * @param  {[type]} options.salerid   [收银员ID]
 * @param  {[type]} options.member_id [管理员权限]
 * @param  {[type]} options.list      [调价商品列表]
 * @return {[type]}                   [description]
 */

export const changePrice = ({ storeid, salerid, member_id, list }) => {
  return post({ url: POSONLINE + '/changePrice', data: { storeid, salerid, member_id, list } })
}
export const changePricePerpetual = ({ storeid, salerid, member_id, list }) => {
  return post({ url: POSONLINE + '/changePricePerpetual', data: { storeid, salerid, member_id, list } })
}

/**
 * [获取库存单中的商品]
 * @param  {[type]} options.page       [页码]
 * @param  {[type]} options.pagesize   [每页数量]
 * @return {[type]}                    [description]
 */
export const getStockGoods = ({ page, pagesize }) => {
  return post({ url: POSONLINE + '/getStockGoods', data: { page, pagesize } })
}

/**
 * [提交报损单]
 * @param  {[type]} options.itemData [报损商品]
 * @return {[type]}                  [description]
 */
export const setDamage = ({ itemData }) => {
  return post({ url: POSONLINE + '/setDamage', data: { itemData } })
}

/**
 * 【下架单提交】
 * @param itemData
 * @returns {*}
 */
export const goodsDown = ({ list }) => {
  return post({ url: POSONLINE + '/goodsDown', data: { list } })
}

/**
 * 【上架单提交】
 * @param list
 * @returns {*}
 */
export const goodsUp = ({ list }) => {
  return post({ url: POSONLINE + '/goodsUp', data: { list } })
}
//更新会员手机号
export const updatePosMember = ({ member_mobile, card_code }) => {
  return post({ url: POSONLINE + '/updatePosMember', data: { member_mobile, card_code } })
}
//支付核验
export const firmOrder = ({ orderno }) => {
  return post({ url: POSONLINE + '/firmOrder', data: { orderno } })
}
//获取仓库id
export const getWarehouse = () => {
  return post({ url: POSONLINE + '/getWarehouse', data: { "page": 1, "pagesize": 16 } })
}
//获取供货商
export const getSupplier = ({ uniacid }) => {
  return post({ url: POSONLINE + '/supplier', data: { uniacid } })
}

//获取调拨出入库数据
export const getTBlist = ({ uniacid, storeid, sign, starttime, endtime }) => {
  return post({ url: POSONLINE + '/getTBlist', data: { uniacid, storeid, sign, starttime, endtime } })
}

//获取调拨单详情
export const TBdetail = ({ uniacid, id }) => {
  return post({ url: POSONLINE + '/TBdetail', data: { uniacid, id } })
}

//确认调拨单
export const submitTB = ({ uniacid, itemData, sign, headData }) => {
  return post({ url: POSONLINE + '/submitTB', data: { uniacid, itemData, sign, headData } })
}

//获取调拨单商品

export const getGoodsByWarehouseId = (warehouseid) => {
  return post({ url: POSONLINE + '/getGoodsByWarehouseId', data: { warehouseid } })
}

//提交调拨单商品
export const warehoseChange = ({ itemData, warehouse_out, warehouse_in, transfer_totalmoney, transfer_totalnumber }) => {
  return post({
    url: POSONLINE + '/warehoseChange',
    data: { itemData, warehouse_out, warehouse_in, transfer_totalmoney, transfer_totalnumber }
  })
}

//奶茶店打印不干胶小票
export const labelPrint = ({ title, specifications, seat, datetime, type = 1, data }) => {
  return post({
    url: POSAPI + '/system/labelPrint',
    data: {
      title,
      specifications,
      seat,
      datetime,
      type,
      data
    }
  })
}

//提交采购单商品
export const addPurchase = ({ uniacid, warehouseid, supplierid, snum, subtotal, donor = '', itemData }) => {
  return post({
    url: POSONLINE + '/addPurchase',
    data: { uniacid, warehouseid, supplierid, snum, subtotal, donor, itemData }
  })
}

//获取复屏轮播图片
export const getStoreSwiper = (menmberList) => {
  return post({ url: POSONLINE + '/getStoreSwiper', data: { menmberList } })
}
export const getPosCard = (card_code) => {
  return post({ url: POSONLINE + '/getPosCard', data: { card_code } })
}

// 获取收银员权限
export const getRole = () => {
  return post({ url: POSONLINE + '/getRole', data: {} })
}
/**
 * [获取充值记录]
 * @param  {[type]} member_mobile    [手机号]
 * @param  {[type]} orderno [订单号]
 * @param  {[type]} starttime       [开始时间]
 * @param  {[type]} endtime    [结束时间
 */
export const getRecord = ({ member_mobile, orderno, starttime, endtime,status }) => {
  return post({ url: POSONLINE + '/getRechargeRecords', data: { member_mobile, orderno, starttime, endtime,status } })
}
//
/**
 * [会员退款]
 * @param  {[type]} id    [订单id]
 * @param surplus string 退款金额
 * @param integral string 会员余额
 */
export const refundRechargeRecord = ({ id, surplus, integral ,print_number}) => {
  return post({ url: POSONLINE + '/refundRechargeRecord', data: { id, surplus, integral ,print_number} })
}
// goods:recode,
// 				weight:recode.num
/**
 * [称重商品删除日志]
 * @param  {[data]} data.goods    [商品信息]
 *  * @param  {[data]} data.weight    [商品的称重]
 */
export const getWeightLog = (data) => {
  return post({ url: POSONLINE + '/getWeightLog', data: data })
}
/**
 * [获取优惠券]
 * @param  {[type]} code    [优惠券编码]
 */
export const getUseCoupons = (code) => {
  return post({ url: POSONLINE + '/coupondetail', data: { code } })
}
/**
 * [获取导购会员信息]
 * @param  {[type]} guiderid    [导购员id]
 */
export const getUseGuider = (guiderid) => {
  return post({ url: POSONLINE + '/erp_is_guider', data: { guiderid } })
}
/**
 * [获取导购会员列表]
 * @param  {[type]} guiderid    [导购员id]
 */
export const guider_list = (char = "", storeid, mobile = "") => {
  return post({ url: POSONLINE + '/guider_list', data: { char, mobile } })
}

/**
 * [判断是否断网]
 */
export const disconnect = () => {
  return post({ url: POSONLINE + '/disconnect', data: {} })
}

/**
 * [获取实时冷库温度]
 * @return {[type]} [description]
 */
export const getTempShow = (store_id) => {
  return post({ url: POSONLINE + '/getTempShow', data: { store_id } })
}


/**
 * [库存打印]
 * */
export const printStock = () => {
  return post({ url: `${POSONLINE}/printStock`, data: {} })
}

export const getStockSafe = ({ store_id, uniacid }) => {
  return post({ url: `${POSONLINE}/getStockSafe`, data: { store_id, uniacid } })
}

/**
 * 获取收银员排序
 * @param category_id  分类ID
 * @returns {*}
 */
export const getCategoryGoods = ({ category_id, }) => {
  return post({ url: `${POSONLINE}/getCategoryGoods`, data: { category_id, } })
}

/**
 * 设置收银员排序
 * @param list          新序号
 * @param category_id   分类ID
 * @returns {*}
 */
export const setSequence = ({ list, category_id, }) => {
  return post({ url: `${POSONLINE}/setSequence`, data: { list, category_id, } })
}

/**
 * [同步所有数据]
 */
export const synchronizedData = () => {
  return post({ url: `${POSAPI}/system/synchronizedData`, data: {} })
}

/**
 * [同步goods2数据]
 */
export const syncCategoryGoods = () => {
  return post({ url: `${POSAPI}/system/syncCategoryGoods`, data: {} })
}

/**
 * [发送短信验证码]
 * @param phone 手机号
 * @param refund 1找回密码 0注册
 */
export const juhecurl = ({ phone, refund }) => {
  return post({ url: `${POSONLINE}/juhecurl`, data: { phone, refund } })
}

/**
 * [验证会员密码]
 * @param {*} param0 
 */
export const checkPwd = ({ mobile, pwd, type, barcode, memberid }) => {
  return post({ url: `${POSONLINE}/checkPwd`, data: { mobile, pwd, type, barcode, memberid } })
}

/**
 * [商品列表bug触发时，发送详细信息]
 */

export const debugCacheInfo = ({ info }) => {
  return post({
    url: `${POSONLINE}/debugCacheInfo`,
    data: { info }
  })
}

/**
 * [获取促销单]
 */
export const activeList = () => {
  return post({
    url: `${POSONLINE}/activeList`,
    data: {}
  })
}

/**
 * [回退至上一版本]
 */
export const fallbackVersion = () => {
  return post({
    url: `${POSAPI}/system/fallbackVersion`,
    data: {}
  })
}

/**
 * [收银端详细信息]
 */
export const getDetails = () => {
  return post({
    url: `${wsJava}/iot/getDetails`,
    data: {}
  })
}

/**
 * [收银端数据库信息]
 */
export const getSelectSql = ({ sql }) => {
  return post({
    url: `${wsJava}/iot/getSelectSql`,
    data: { sql },
  })
}

/**
 * [ws发送信息]
 */
export const sendIo = ({
  uid,
  content,
}) => {
  return post({
    url: `${wsJava}/iot/sendInfo`,
    data: {
      type: "send",
      to: uid,
      content,
    }
  })
}

/**
 * [采购申请单添加]
 * @param itemData 商品列表
 * @param purchaseData 详细说明
 */
export const applyOrder = ({
  itemData,
  purchaseData,
}) => {
  return post({
    url: `${POSONLINE}/applyOrder`,
    data: {
      itemData,
      purchaseData,
    }
  })
}

/**
 * [设置挂单]
 * @param msg 商品详情
 */
export const setPendingOrder = ({
  msg,
}) => {
  return post({
    url: `${POSONLINE}/setPendingOrder`,
    data: {
      msg,
    }
  })
}

/**
 * [获取挂单]
 */
export const getPendingOrder = (id) => {
  return post({
    url: `${POSONLINE}/getPendingOrder`,
    data: {
      id
    }
  })
}

/**
 * [删除挂单]
 */
export const delPendingOrder = ({ id }) => {
  return post({
    url: `${POSONLINE}/delPendingOrder`,
    data: { id }
  })
}
/**
 * [修改挂單]
 */
export const getPendingOrderupdate = ({ id,msg }) => {
  return post({
    url: `${POSONLINE}/getPendingOrderupdate`,
    data: { 
      id,
      msg 
    }
  })
}


export const getDeletelog = () => {
  return get({
    url: `${POSAPI}/system/getDeletelog`
  })
}
// //挂单打印
// export const printList = () => {
//   return get({
//     url: `${POSAPI}/system/printList`
//   })
// }

export const oenCashbox = () => {
  return get({
    url: `${POSAPI}/system/oenCashbox`
  })
}

export const coupon = ({
  couponcode,
  price,
  phone
}) => {
  return post({
    url: `${POSONLINE}/coupon`,
    data: {
      couponcode,
      price,
      phone
    }
  })
}

/**
 * [一键传秤]
 */
export const downpluAll = () => {
  return post({ url: `${POSONLINE}/downpluAll`, data: {} })
}
