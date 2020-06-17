/**
 * file 支付类
 */

import { Modal, notification, message } from 'antd'
import {
  createorder,
  CheckPay,
  MicroPay,
  firmOrder,
  oenCashbox,
  debugCacheInfo,
  validateOrder,
} from '@/api'
import moment from 'moment'
import 'moment/locale/zh-cn'

const confirm = Modal.confirm;
const error = Modal.error

/**
 * [初始化Pay  需要传入的参数]
 * @param  {[type]} options.order           -必填，关于订单的信息的对象，包含（收银员，会员， 商品列表， 积分， 折扣。。。。。）
 * @param  {[type]} options.pay_type        -必填，支付方式，详细参考，index.jsx 的支付类型列表
 * @param  {[type]} options.member          -必填，会员信息且填写this.props.member
 * @param  {[type]} options.mixingPayment   -必填，混合支付开
 * @param  {[type]} options.is_payment      -必填，是否开启会员扫码付款
 */

class Pay {
  constructor(obj) {
    this.order = obj.order
    this.pay_type = obj.pay_type
    this.member = obj.member
    this.mixingPayment = obj.mixingPayment
    this.is_payment = obj.is_payment
    this.repeatOrder = true

    /**
     * 扫码支付防抖
     */
    this.bool_ewm = true

    /**
     * [data 下单接口返回对象]
     * @type {Object}
     */
    this.data = {}
    /**
     * [continue 判断校验是否通过]
     * @type {Boolean}
     */
    this.continue = false

    /**
     * [支付完成调用方法 用于清空订单信息，重置页面内容]
     * @return {[type]} [description]
     */
    this.payFinsh = obj.payFinsh ? obj.payFinsh : () => {
    }
    /**
     * [支付失败调用方法]
     * @return {[type]} [description]
     */
    this.payFail = obj.payFail


    this.loading = () => {
    }


    this.iterator = {}
  }

  clearTimeout() {
    if (this.downtime) clearTimeout(this.downtime)
  }

  check(pay_type, change) {
    if (pay_type === 3 && !this.member.data) {
      notification.error({
        message: '会员未登陆',
        description: '请登录会员',
      })
      return
    }
    if (pay_type === 4 && this.order.transid === '') {
      notification.error({
        message: '银联凭证号不能为空',
        description: '请填写银联凭证号',
      })
      return
    }
    if (change < 0 && !this.mixingPayment) {
      notification.error({
        message: '找零不可为负数',
        description: '请重新填写应收金额'
      })
      return
    } else if (change >= 0 && this.mixingPayment) {
      notification.error({
        message: '实收金额大于应收',
        description: '请重新输入第一次混合支付金额'
      })
      return
    } else if (change >= 100) {
      notification.error({
        message: '找零不能大于100',
        description: '请重新填写应收金额'
      })
      return
    }
    if (!this.order.list) return
    // let bol = this.order.list.find(item => {
    //   if (item.specialPrice) {
    //     return item.specialPrice * item.num <= 0
    //   } else {
    //     return (Number(item.posprice) - Number(item.discount_fee)) * item.num <= 0
    //   }
    // })

    // let some = this.order.list.some(item => {
    //   return item.is_freegift != 2 && item.subtotal == 0
    // })

    // if (bol && !this.continue && some) {
    //   const onOk = () => {
    //     this.continue = true
    //     this.check(pay_type, change)
    //   }
    //   confirm({
    //     title: '提示',
    //     content: '存在小计金额为0的订单，请核对金额后支付',
    //     cancelButtonProps: { style: { display: 'none' } },
    //     onOk() {
    //       onOk()
    //     },
    //     onCancel() {
    //       return
    //     },
    //   });
    //   return
    // }

    return true
  }

  /**
   * [createorder 下单接口]
   * @param  {[type]} options.pay_type [必填，支付方式]
   * @param  {[type]} options.change   [必填，找零]
   * @param  {[type]} options.payFinsh [必填，支付完成]
   * @param  {[type]} options.payFail  [必填，支付失败]
   */
  createorder({ couponid, pay_type, change, payFinsh, payFail, loading, ctrAR, sw1126 }) {
    this.repeatOrder = true;
    this.payFinsh = payFinsh
    this.payFail = payFail
    this.loading = loading
    this.downtime = null
    if (!this.check(pay_type, change)) {
      this.payFail()
      return false
    }
    let numeration = null
    if (localStorage.getItem('tea_time')) {
      let a = JSON.parse(localStorage.getItem('tea_time')),
        contrast_time = a.tea_time,
        now_time = moment().valueOf()
      if (contrast_time <= now_time) {
        localStorage.setItem('tea_time', JSON.stringify({
          tea_time: moment(moment().add(1, "days").format("YYYYMMDD"), 'YYYYMMDD').valueOf(),
          tea_num: 1,
        }))
        numeration = 1
      } else {
        a.tea_num += 1
        localStorage.setItem('tea_time', JSON.stringify(a))
        numeration = a.tea_num
      }
    } else {
      localStorage.setItem('tea_time', JSON.stringify({
        tea_time: moment(moment().add(1, "days").format("YYYYMMDD"), 'YYYYMMDD').valueOf(),
        tea_num: 1,
      }))
      numeration = 1
    }
    let data = JSON.parse(localStorage.getItem('__setting')).sw_orderNumber
      ? { ...this.order, numeration: `No.: ${numeration}` }
      : { ...this.order, numeration: "" }
    data.list = data.list.map(i => {
      i.showPromotionImg = i.showPromotionImg ? i.showPromotionImg : 0
      return i
    })
    data.print_number = localStorage.getItem('print_number') ? localStorage.getItem('print_number') : 1
    createorder(data)
      .then(res => {
        if (res) {
          this.data = res.data
          if (!this.data || res.data.status === 4002) {
            //服务器连接失败
            this.payFail()
            return
          }
          if (res.data.status === 4005) {
            // notification.warning({
            //   message: '提示',
            //   description: '刷新页面获取最新价格！',
            // })
            // setTimeout(() => {
            //   window.history.go(0)
            // }, 2000)
            // 
            Modal.warning({
              title: "提示",
              content: `${res.data.data}请删除购物台上此商品，刷新页面后再重新添加`
            });
            this.payFail()
            return;
          }
          if ([9001, 4001].includes(res.data.status) && pay_type == 0 && sw1126) oenCashbox()
          //断网支付
          //1、调用接口createOrder，断网情况处理。需要前端添加判断处理。
          // 1.1{"status":9001,"data":"付款成功"}关闭结算页面。不需要要调用（microPay）支付接口
          // 1.2{"status":9002,"data":"断网中，请改用现金支付！"}
          if (res.data.status === 9001) {
            notification.info({
              message: '成功',
              description: '付款成功！',
              duration: 4
            })
            this.payFinsh()
            return
          }
          if (res.data.status === 9002) {
            notification.info({
              message: '网络异常或阻塞，自动调整为断网模式',
              description: '断网模式使用中，请改用现金支付！',
              duration: 4
            })
            this.loading(9)
            return
          }
          this.payment({
            couponid,
            pay_price: this.order.pay_price,
            pay_type: this.order.pay_type,
            member: this.member,
            payFinsh,
            ctrAR,
            toye: this.order.toye,
          })
          this.downtime = setTimeout(() => {
            if (loading(3) == 'ok') {
              if (this.repeatOrder) {
                Modal.success({
                  title: '等待支付超时/网络阻塞',
                  content: '点击【确定】按钮加速处理,如提示支付失败请重新发起支付。',
                  okText: '确定',
                  className: 'paymentModal',
                  iconType: 'check-circle',
                  onOk() {
                    let orderno = {
                      orderno: res.data.msg
                    }
                    firmOrder(orderno)
                      .then(res => {
                        console.log(res)
                        if (res.data.status === 4001) {
                          loading(1)
                          message.success(res.data.msg);
                        } else if (res.data.status === 4005) {
                          loading(0)
                          message.error('请重新结算！');
                        } else {
                          loading(2)
                          message.error('支付有问题！')
                        }
                      })
                  },
                });
              }
            }
          }, 60000);
        }
      })
  }

  /**
   * [payment 支付接口]
   * @param  {[type]} options.pay_price [必填，支付金额]
   * @param  {[type]} options.pay_type  [必填，支付类型]
   * @param  {[type]} options.auth_code [必填，线上支付，支付码，没有就是空字符串]
   * @param  {[type]} options.member    [必填，会员信息]
   */
  payment({ couponid, pay_price, pay_type, auth_code, member, ctrAR, toye, addcountInter }) {
    if (!this.repeatOrder) {
      return
    }
    console.log('couponid :', couponid);
    pay_price = Number(pay_price).toFixed(2)
    if (pay_type === 3 && !member.data) {
      let that = this
      error({
        title: '会员未登录',
        content: '请先登录会员',
        onOk() {
          clearInterval(that.downtime)
          that.payFail()
        }
      })
      return false
    }
    if ((pay_type === 1 || pay_type === 2) && !auth_code) {
      notification.info({
        message: '扫码支付',
        description: '扫描顾客付款码',
        duration: 5,
      })
      return false
    }
    if (pay_price == 0) {
      this.payFail()
      return false
    }
    if (!this.mixingPayment && (pay_type === 1 || pay_type === 2)) {
      pay_price = this.order.price
    }
    if (pay_type === 1 || pay_type === 2) {
      if (this.bool_ewm) {
        this.bool_ewm = false
      } else {
        return false
      }
    }
    const errrorConfirm = (c = '重试或者切换支付方式') => {
      confirm({
        title: '支付遇到问题？',
        content: c,
        onOk() {
          return false
        },
        onCancel() {
          return false
        },
      })
    }
    // vipcard_id:this.order.pay_type===8
    let order1216 = this.data.msg
      ? this.data.msg
      : (
        this.mixingPayment
          ? JSON.parse(localStorage.getItem('is_quit')).orderno
          : 'error'
      )

    return MicroPay({
      orderno: order1216,
      member_id: member.data && member.data.id,
      auth_code,
      pay_type,
      toye,
      couponid,
      pay_price,
      vipcard_id: pay_type === 8 ? localStorage.getItem('vipcard_id') : '',
      hehe: this.mixingPayment,
      orderNumber: localStorage.getItem("tea_time") ? JSON.parse(localStorage.getItem("tea_time")).tea_num : 1,
      sw_orderNumber: JSON.parse(localStorage.getItem('__setting')).sw_orderNumber,
      soundSwitch: JSON.parse(localStorage.getItem('__setting')).Voice ? 1 : 0,
      print_number:localStorage.getItem('print_number') ? localStorage.getItem('print_number') : 1
    })
      .then(res => {
        let q = {
          is_quit: false,
          orderno: this.data.msg ? this.data.msg : '',
        }
        q = { ...JSON.parse(localStorage.getItem("is_quit")), ...q }
        // 1002  线上支付成功   2002 线上支付失败   2003 正在支付  2004 会员余额不足  2012 微信支付码错误
        // if(res.data.msg.orderinfo.pay_type===1 || res.data.msg.orderinfo.pay_type===2){
        //     notification.info({
        //         message: '扫码支付',
        //         description: '扫描顾客付款码',
        //         duration:null
        //     })
        // }
        if (res && res.data.status === 1002) {
          let { smsnum, couponid } = res.data.msg
          if (smsnum && isNaN(+smsnum)) {
            message.info(smsnum)
          }
          if (couponid && couponid.length === 20) validateOrder(couponid)

          localStorage.setItem("is_quit", JSON.stringify(q))
          this.payFinsh()
          clearInterval(this.downtime)
          setTimeout(() => {
            this.bool_ewm = true
          }, 3000)
          if (ctrAR) {
            ctrAR()
          }
        } else if (res && res.data.status === 2003) {
          this.repeatOrder = false
          let orderno = {
            orderno: this.data.msg,
            num: 1,
            pay_type,
            pay_price,
          }
          addcountInter()
          //查询订单是否支付成功
          /**
           * [循环查单， 通过后台的返回值，来判断是否再次发起请求， 查询订单]
           * @param  {[type]} orderno [订单号]
           */
          const searchCheckPay = async (orderno) => {
            orderno.print_number =  localStorage.getItem('print_number') ? localStorage.getItem('print_number') : 1
            let args = await CheckPay(orderno)
            if (args && args['data']) {
              let { data } = args
              orderno.num += 1
              if (data.status === 1002) {

                if (data.msg.couponid && data.msg.couponid.length === 20) validateOrder(data.msg.couponid)

                this.repeatOrder = true
                localStorage.setItem("is_quit", JSON.stringify(q))
                this.payFinsh()
                clearInterval(this.downtime)
                setTimeout(() => {
                  this.bool_ewm = true
                }, 3000)
                if (ctrAR) {
                  ctrAR()
                }
              }
              if (data.status === 2003 || data instanceof Array) {
                setTimeout(() => {
                  searchCheckPay(orderno)
                }, 3000)
              }
              if (data.status === 2002) {
                this.repeatOrder = true
                clearInterval(this.downtime)
                setTimeout(() => {
                  this.bool_ewm = true
                }, 3000)
                errrorConfirm()
                debugCacheInfo({
                  info: JSON.stringify({
                    msg: '大额支付error'
                  })
                })
                this.payFail()
              }
            } else {
              setTimeout(() => {
                orderno.num += 1
                searchCheckPay(orderno)
              }, 3000)
            }
          }
          orderno = {
            ...orderno,
            ...{ orderno: this.data.msg ? this.data.msg : JSON.parse(localStorage.getItem('is_quit')).orderno }, 
            hehe: this.mixingPayment,
            soundSwitch: JSON.parse(localStorage.getItem('__setting')).Voice ? 1 : 0,
          }
          searchCheckPay(orderno)
        } else if (res && res.data.status === 2012) {

          setTimeout(() => {
            this.bool_ewm = true
          }, 3000)
          clearInterval(this.downtime)
          notification.info({
            message: '扫码失败',
            description: '请重新尝试扫正确的微信支付码，或者请勿重复扫码，',
            duration: 5,
            className:'errorerp'
          })
          // notification.open({
          //   message: <h2 style={{ fontSize: 40, marginLeft: 40, marginBottom: 0, color: 'red' }}>支付失败</h2>,
          //   duration: 5,
          // });
        } else {

          setTimeout(() => {
            this.bool_ewm = true
          }, 3000)
          clearInterval(this.downtime)
          // errrorConfirm(`请联系开发者：${JSON.stringify(res.data)}`)
          errrorConfirm(`请重新支付`)
          debugCacheInfo({
            info: JSON.stringify({
              response: res.data,
              date: new Date().toLocaleString(),
              order: order1216,
              msg: 'java or php error'
            })
          })
          this.payFail()
        }
      })
  }
}

export default Pay

