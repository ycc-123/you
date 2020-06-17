import React, { Component, createRef, Fragment } from 'react'
import { connect } from 'react-redux'
import QRCode from 'qrcode.react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import 'moment/locale/zh-cn'
import {
	Modal,
	Button,
	Switch,
	Form,
	Input,
	InputNumber,
	Row,
	Col,
	Radio,
	notification,
	Spin,
	Select,is_tabulate,
	Table,
	Tabs,
	message,
	Icon,
	DatePicker,
	Popover
} from 'antd'
import NumericKeypad, { onVirtualKeyboard } from '@/widget/NumericKeypad'
import {
	clearOrderList,
	clearMember,
	resetOrderList,
	setOrderList,
	eidtStore,
	clearGuide,
	firmOrder,
	delete_authorization,
	changeSetting,
} from '@/action'
import {
	createorder,
	MicroPay,
	getPosCard,
	getUseCoupons,
	getUseGuider,
	guider_list,
	disconnect,
	CheckPay,
	checkPwd,
	coupon,
	validateOrder,
	getstore
} from '@/api'
import FooterLeft from './FooterLeft'
import Pay from './Pay'
import './index.less'
import numbered from './Numbered_Mode.png';
import wxmode from './wx_mode.png'
import zfbmode from './zfb_mode.png'
// import tsIcon from '../../style/imgs/timg.jpg'
let disable = false
const Search = Input.Search
const mapStateToProps = (state, ownProps) => ({
	order: state.order,
	member: state.member,
	store: state.store,
	fullsub: state.fullsub,
	sale: state.sale,
	authority: state.authority,
	setting: state.setting,
	guide: state.guide,
})

const { TabPane } = Tabs
const FormItem = Form.Item
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 6 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 },
	},
};
let PAYEMNTMETHODS = [
	{ title: '现金', pay_type: 0 },
	{ title: '微信扫码', pay_type: 1 },
	{ title: '支付宝扫码', pay_type: 2 },
	{ title: '会员余额', pay_type: 3 },
	// { title: '口碑支付', pay_type: 9 },
	{ title: '个人微信', pay_type: 5 },
	{ title: '个人支付宝', pay_type: 6 },
	{ title: '购物卡', pay_type: 8 },
	{ title: '银行卡', pay_type: 4 },
]

class FooterCustom extends Component {
	constructor(props) {
		super(props)
		this.state = {
			spinBarcode: false,
			memBarcode: '',
			is_login: false,
			show_password: false,
			mem_password: "",
			cashier_box_x: 0,
			cannotturnoff: false,
			countsm: 0, //抹零
			quibinary_status: true,
			loading: false,
			visible: false, // modal display
			integral: 0,// 积分
			totalPrice: 0,// 总金额
			amountReceived: 0,// 实收金额
			controlAR: 0,// 混合支付控制
			focusInputName: 'amountReceived',// 当前焦点所在的input框
			discountVisible: false,
			discount_num: 100,// 整单优惠折扣
			discount_fee: 0,// 整单优惠金额
			coupon_fee: 0,//优惠券优惠金额
			remark: { remark_id: 0, remark: '' },// 优惠原因备注
			discountsType: 'amount',// 折扣方式   amount:折扣金额  rate：折扣率
			receivable: 0,//应收金额
			pay_type: 0,//支付方式
			mbsw1217: false,
			yhsw1128: false,
			djsw1128: false,
			vdj1128: '',
			NumericKeypadOrPrCode: false,// 键盘或者二维码
			toye: false,// 现金转余额开关
			print_xp: true,// 打印小票开关
			auth_code: '',// 扫码支付，付款一维码
			transid: '',// 银行卡支付流水凭证号
			mixingPayment: false,// 混合支付开关
			payTwo: 0,//第二次支付金额
			second: false,//第二次支付
			countInter: 59,
			va1125: '',
			lisk: '等待支付倒计时',
			giftCardModel: true,
			giftCardValue: '',
			giftCardData: [],
			isuseCoupon: false,//是否开启使用优惠券
			isuseGuider: false,//是否开启导购会员
			guiderId: '', //导购会员码id
			guiderCode: '', //导购会员码
			hasGuilder: false,
			guiderName: '',//导购会员名称
			guiderTel: '',//导购会员手机号
			couponId: '',
			totaldiscount_fee: 0,
			switchdisabled: false,
			hascoupon: false,
			couponTemid: '',//使用优惠券的id
			is_at_least: '',//优惠券最低满减
			aaavisible: false,
			bbbvisible: false,
			selectGuiderModal: false,//选择导购员modal
			char: "",//导购会员搜索首字母
			mobile: '',//导购会员搜索手机号
			netStatusGoPricePay: 1,// 1 联网 0 断网
			guiderList: [],//导购员列表
			is_first: true,
			keylistener: null,
			show_public_wrap: false,
			discountBox:'none'
			// qrcode_visible          :false,//二维码显示

			// guiderColumns:[
			//     {
			//         title: '姓名',
			//         dataIndex: 'name',
			//         key: 'name',
			//     },
			//     {
			//         title: '手机号',
			//         dataIndex: 'mobile',
			//         key: 'mobile',
			//     },
			//     {
			//         title: '操作',
			//         key: 'action',
			//         render: (text, record) => (
			//             <span>
			//             <Button onClick={() => this.getlist2(record)}>选择该导购</Button>
			//         </span>
			//         )
			//     }
			// ]
		}

		this.iterator = {}
		this.inputRef = React.createRef();
		this.inputRefMoney = React.createRef();
		this.inputRefDis = React.createRef();

		this.refPassword = createRef()
		this.refBarcode = createRef()
	}

	/**
	 * [会员验证切换]
	 * @param activeKey string
	 */
	switch = (activeKey) => {
		switch (activeKey) {
			case '1':
				setTimeout(() => {
					this.refBarcode.current.focus()
				}, 0)
				break;
			case '2':
				setTimeout(() => {
					this.refPassword.current.focus()
				}, 0)
				break;
			default:
				break;
		}
	}

	/**
	 * [键盘输入条形码验证]
	 * @param e event
	 */
	changeBarcode = (e) => {
		this.setState({
			memBarcode: e.target.value,
		})
	}

	/**
	 * [回车条形码验证]
	 */
	requestBarcode = async () => {
		let [{ memBarcode }, { member }] = [this.state, this.props]
		if (member['data']) {
			this.setState({
				spinBarcode: true,
			})
			let { data: { id } } = member
			let response = await checkPwd({
				type: 2,
				barcode: memBarcode,
				memberid: id,
			})
				.then(res => {
					this.setState({
						memBarcode: '',
						spinBarcode: false,
					})
					return res
				})
			if (response.data && response.data.status) {
				let { data: { status } } = response
				// eslint-disable-next-line no-unused-expressions
				status == 1002 ? this.setState({
					is_login: true,
					show_password: false,
				}) : null
			
			}
		} else {
			message.info('请先登录会员')
			this.setState({
				show_password: false,
			})
		}
	}

	onPressEnter1125 = async () => {
		const { va1125, discount_fee } = this.state;
		if (!(va1125 && +va1125)) return false
		let phone = "";

		if (localStorage.getItem("__member") == "{}") {
			console.log(1);
		} else {
			console.log(JSON.parse(localStorage.getItem("__member")));
			phone = JSON.parse(localStorage.getItem("__member")).data.mobile;
		}
		let response = await coupon({
			couponcode: va1125,
			price: this.calcPayment(),
			phone: phone
		})
		// message.info(response.data.msg);
		if (response.data.status == 0) {
			message.info(response.data.msg);
		}
		if (response && response.data && response.data.status == 1) {
			const {
				data: {
					data: {
						couponcode,
						cash,
					}
				}
			} = response
			if (this.calcPayment() >= +cash) {
				// notification.success({
				// 	message:'',
				// 	description:`使用优惠券：${cash}元`
				// })
				this.props.dispatch(eidtStore({
					...this.props.store.data,
					sundries: {
						id1129: couponcode,
					}
				}))
				this.setState({
					cash1129: +cash,
					discount_fee: +cash,
					va1125: '',
				})
			} else {
				// notification.info({
				// 	message:'',
				// 	description:'优惠金额大于结算金额'
				// })
				this.setState({
					va1125: '',
				})
			}

		} else {
			this.setState({
				va1125: '',
			})
		}
	}

	onChange1125 = (e) => {
		this.setState({
			va1125: e.target.value
		})
	}

	componentDidMount() {
		//是否显示折扣
		disconnect().then(res => {
			console.log("disconnect");
			console.log(res.data.status);
			if (res.data.status == 1) {
				
			  this.setState({
				discountBox: "block"
			  });
			} else {
				notification.warning({
					message: "提示",
					description: "网络断开或阻塞，部分功能暂不可用"
				  });
			
			  this.setState({
				discountBox: "none"
			  });
			}
		  });
		  //折扣最大限制
		  getstore().then((res)=>{
			console.log(res)
			this.setState({
				max_discount: res.data.max_discount
			  });
		  })
		  
		//对混合支付优化，处理支付一半时刷新页面的情况
		let u = localStorage.getItem('is_quit') ? JSON.parse(localStorage.getItem('is_quit')) : null
		if (u && u.is_quit) {
			this.setState({
				visible: true,
				loading: false,
				second: true,
				auth_code: '',
				integral: 0,
				focusInputName: 'payTwo',
				payTwo: u.payTwo,
				mixingPayment: true,
			}, () => {
				setTimeout(() => {
					this.setState({
						amountReceived: u.amountReceived,
					})
				}, 0)
			})
		}

		var code = "";
		var lastTime, nextTime;
		var lastCode, nextCode;

		var a = (e) => {
			nextCode = e.key;
			nextTime = e.timeStamp;
			if (lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
				code += lastCode;
			} else if (lastCode != null && lastTime != null && nextTime - lastTime > 100) {
				code = "";
			}
			lastCode = nextCode;
			lastTime = nextTime;
			//扫商品码直接加入搜索框
			if (this.state.quibinary_status && e.which == 13 && String(code).match(/^(25|26|27|28|29|30)\d{14,22}$/)) {
				if (!JSON.parse(localStorage.getItem("__setting")).thejoiningtogetheroftwoyards) {
					return
				}

				let { countsm, focusInputName, second, pay_type, discount_fee, discount_num, integral, totalPrice, amountReceived, transid, mixingPayment, remark, couponTemid, guiderId, change } = this.state
				const { is_payment, total_accuracy, } = this.props.store.data
				let goods = this.props.order.dataList[this.props.order.orderIndex]
				if (!goods || goods.length == 0) {
					return
				}
				let _change = this.giveChange()
				let price = this.calcPayment()
				let obj = {
					countsm,
					totalmoney: (goods.reduce((a, b) => +(b.posprice * b.num).toFixed(total_accuracy) + a, 0)).toFixed(2),
					DiscountAmount: (goods.reduce((a, b) => +(b.posprice * b.num).toFixed(total_accuracy) + a, 0) - Number(price).toFixed(total_accuracy)).toFixed(2),
					store_id: this.props.store.data.id,
					createid: this.props.sale.data.id,
					userinfo: this.props.member.data || null,
					guide_id: (this.props.guide.data && this.props.guide.data.id) || null,
					transid: transid,// 银行卡支付流水凭证号
					list: goods,
					pay_type: 2,// `pay_type` int(4) NOT NULL COMMENT '支付方式1：支付宝2:微信支付，3现金，4银行卡 9:会员支付，0:虚拟人',
					remark_id: remark.id,// `remark_id` varchar(100) NOT NULL DEFAULT '' COMMENT '优惠id',
					discount_remark: remark.remark, // 优惠备注
					goodsprice: totalPrice,// `goodsprice` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品总价格',
					pay_price: (+amountReceived || +price).toFixed(total_accuracy),// `pay_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实收金额',
					price: (+price).toFixed(total_accuracy),//`price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '应收金额',
					// return_price    : change,// `return_price` 找零
					discount_num: discount_num,// `discount_num` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '折扣',
					discount_fee: discount_fee,// `discount_fee` decimal(10,2) NOT NULL COMMENT '减免',
					use_score: integral,// `use_score` int(11) NOT NULL DEFAULT '0' COMMENT '使用积分数',
					score_discount: integral * this.props.store.data.score,// `score_discount` int(11) NOT NULL DEFAULT '0' COMMENT '积分优惠',
					wechat_discount: 100,// `wechat_discount` float(10,2) NOT NULL DEFAULT '100.00' COMMENT '微信折扣(100默认是没有折扣)',
					member_discount: 100,// `member_discount` float(10,2) NOT NULL DEFAULT '100.00' COMMENT '余额折扣(100默认是没有折扣)',
					huiyuan_discount: !!this.props.member.data ? this.props.member.data.rights : 100,// `huiyuan_discount` float(10, 2) NOT NULL DEFAULT '100.00' COMMENT '会员折扣',
					toye: Number(this.state.toye),// `toye` tinyint(3) NOT NULL DEFAULT '0' COMMENT '现金转余额(0不开启1开启)',
					print_xp: 1,// `print_xp` tinyint(3) NOT NULL DEFAULT '0' COMMENT '订单结算后打印小票（0不打印1打印）',
					guider_coupon_id: couponTemid,//优惠券id
					guiderid: guiderId,//导购会员id
					print_number:localStorage.getItem('print_number') ? localStorage.getItem('print_number') : 1
				}

				window.removeEventListener('keypress', this.state.keylistener, true)

				createorder(obj)
					.then(res => {
						if (res) {
							if (res.data.status === 4001) {
								let numeration = null
								if (localStorage.getItem('tea_tiem')) {
									let a = JSON.parse(localStorage.getItem('tea_tiem')),
										contrast_time = +a.tea_time,
										now_time = +String(moment().valueOf()).slice(0, 8)
									if (contrast_time <= now_time) {
										localStorage.setItem('tea_tiem', JSON.stringify({
											tea_time: String(moment().add(1, 'days').valueOf()).slice(0, 8),
											tea_num: 1,
										}))
										numeration = 1
									} else {
										a.tea_num += 1
										localStorage.setItem('tea_tiem', JSON.stringify(a))
										numeration = a.tea_num
									}
								} else {
									localStorage.setItem('tea_tiem', JSON.stringify({
										tea_time: String(moment().add(1, 'days').valueOf()).slice(0, 8),
										tea_num: 1,
									}))
									numeration = 1
								}
								MicroPay({
									orderno: res.data.msg,
									orderNumber: numeration,
									sw_orderNumber: JSON.parse(localStorage.getItem('__setting')).sw_orderNumber,
									vipcard_id: pay_type === 8 ? localStorage.getItem('vipcard_id') : '',
									pay_type: 2,
									member_id: this.props.member.data && this.props.member.data.id,
									pay_price: this.calcPayment(),
									auth_code: '',
									hehe: mixingPayment,
									soundSwitch: this.props.setting.Voice ? 1 : 0,
									print_number:localStorage.getItem('print_number') ? localStorage.getItem('print_number') : 1
								}).then(rres => {
									console.log('asdasdasdasdasd'.rres)
									if (rres.data.status == 1002) {
										console.log('md2',this.props.store.data.sundries)
										window.addEventListener('keypress', this.state.keylistener, true)
										this.props.dispatch(clearOrderList(this.props.order.orderIndex))
										// this.props.dispatch(setOrderList())
										this.props.dispatch(clearMember())
										this.props.dispatch(clearGuide())
										this.setState({
											pay_type: 0,
											loading: false,
											visible: false,
											discount_fee: 0,
											discount_num: 100,
											amountReceived: 0,
											integral: 0,
											auth_code: '',
											transid: '',
											toye: false,
											mixingPayment: false,
											second: false,
											focusInputName: 'amountReceived',
											payTwo: 0,
											isuseCoupon: false,
											couponId: '',
											totaldiscount_fee: 0,
											switchdisabled: false,
											hascoupon: false,
											couponTemid: '',//使用优惠券的id
											coupon_fee: 0,
											hasGuilder: false,
											guiderName: '',
											guiderTel: ''
										}, () => {
											/**
											 * 解决快速连点下的，窗口关闭不及时，造成的点击有效
											 */
											setTimeout(() => {
												this.stopTimeout()
											}, 0)
										})
									} else if (rres.data.status == 2003) {
										this.setState({
											show_public_wrap: true,
										})
										var num = 1
										var r = () => {
											CheckPay({
												orderno: res.data.msg,
												pay_price: this.calcPayment(),
												pay_type: 2,
												num,
												soundSwitch: this.props.setting.Voice ? 1 : 0,
												hehe: mixingPayment,
												print_number:localStorage.getItem('print_number')?localStorage.getItem('print_number'):1
											})
												.then(({ data }) => {
													num += 1
													if (data.status == 1002) {
														window.addEventListener('keypress', this.state.keylistener, true)
														this.props.dispatch(clearOrderList(this.props.order.orderIndex))
														// this.props.dispatch(setOrderList())
														this.props.dispatch(clearMember())
														this.props.dispatch(clearGuide())
														this.setState({
															pay_type: 0,
															loading: false,
															visible: false,
															discount_fee: 0,
															discount_num: 100,
															amountReceived: 0,
															integral: 0,
															auth_code: '',
															transid: '',
															toye: false,
															mixingPayment: false,
															second: false,
															focusInputName: 'amountReceived',
															payTwo: 0,
															isuseCoupon: false,
															couponId: '',
															totaldiscount_fee: 0,
															switchdisabled: false,
															hascoupon: false,
															couponTemid: '',//使用优惠券的id
															coupon_fee: 0,
															hasGuilder: false,
															guiderName: '',
															guiderTel: ''
														}, () => {
															/**
															 * 解决快速连点下的，窗口关闭不及时，造成的点击有效
															 */
															setTimeout(() => {
																this.stopTimeout()
															}, 0)
															this.setState({
																show_public_wrap: false,
															})
														})
													} else if (data.status == 2003) {
														r()
													} else {
														window.addEventListener('keypress', this.state.keylistener, true)
														notification.open({
															message: <h2 style={{ fontSize: 40, marginLeft: 40, marginBottom: 0, color: 'red' }}>支付失败</h2>,
															duration: 5,
														});
														this.setState({
															show_public_wrap: false,
														})
													}
												})
										}
										r()
									} else {
										window.addEventListener('keypress', this.state.keylistener, true)
										notification.open({
											message: <h2 style={{ fontSize: 40, marginLeft: 40, marginBottom: 0, color: 'red' }}>支付失败</h2>,
											duration: 5,
										});
									}
								})
							} else {
								notification.error({
									message: "提示",
									description: '创建订单失败',
								})

								window.addEventListener('keypress', this.state.keylistener, true)

							}
						}
					})
			} else if (this.state.quibinary_status && e.which == 13 && String(code).match(/^(10|11|12|13|14|15)\d{16}$/)) {
				if (!JSON.parse(localStorage.getItem("__setting")).thejoiningtogetheroftwoyards) {
					return
				}

				let { countsm, focusInputName, second, pay_type, discount_fee, discount_num, integral, totalPrice, amountReceived, transid, mixingPayment, remark, couponTemid, guiderId, change } = this.state
				const { is_payment, total_accuracy, } = this.props.store.data
				let goods = this.props.order.dataList[this.props.order.orderIndex]
				if (!goods || goods.length == 0) {
					return
				}
				let _change = this.giveChange()
				let price = this.calcPayment()
				let obj = {
					countsm,
					totalmoney: (goods.reduce((a, b) => +(b.posprice * b.num).toFixed(total_accuracy) + a, 0)).toFixed(2),
					DiscountAmount: (goods.reduce((a, b) => +(b.posprice * b.num).toFixed(total_accuracy) + a, 0) - Number(price)).toFixed(2),
					store_id: this.props.store.data.id,
					createid: this.props.sale.data.id,
					userinfo: this.props.member.data || null,
					guide_id: (this.props.guide.data && this.props.guide.data.id) || null,
					transid: transid,// 银行卡支付流水凭证号
					list: goods,
					pay_type: 1,// `pay_type` int(4) NOT NULL COMMENT '支付方式1：支付宝2:微信支付，3现金，4银行卡 9:会员支付，0:虚拟人',
					remark_id: remark.id,// `remark_id` varchar(100) NOT NULL DEFAULT '' COMMENT '优惠id',
					discount_remark: remark.remark, // 优惠备注
					goodsprice: totalPrice,// `goodsprice` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品总价格',
					pay_price: (+amountReceived || +price).toFixed(total_accuracy),// `pay_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实收金额',
					price: (+price).toFixed(total_accuracy),//`price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '应收金额',
					// return_price    : change,// `return_price` 找零
					discount_num: discount_num,// `discount_num` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '折扣',
					discount_fee: discount_fee,// `discount_fee` decimal(10,2) NOT NULL COMMENT '减免',
					use_score: integral,// `use_score` int(11) NOT NULL DEFAULT '0' COMMENT '使用积分数',
					score_discount: integral * this.props.store.data.score,// `score_discount` int(11) NOT NULL DEFAULT '0' COMMENT '积分优惠',
					wechat_discount: 100,// `wechat_discount` float(10,2) NOT NULL DEFAULT '100.00' COMMENT '微信折扣(100默认是没有折扣)',
					member_discount: 100,// `member_discount` float(10,2) NOT NULL DEFAULT '100.00' COMMENT '余额折扣(100默认是没有折扣)',
					huiyuan_discount: !!this.props.member.data ? this.props.member.data.rights : 100,// `huiyuan_discount` float(10, 2) NOT NULL DEFAULT '100.00' COMMENT '会员折扣',
					toye: Number(this.state.toye),// `toye` tinyint(3) NOT NULL DEFAULT '0' COMMENT '现金转余额(0不开启1开启)',
					print_xp: 1,// `print_xp` tinyint(3) NOT NULL DEFAULT '0' COMMENT '订单结算后打印小票（0不打印1打印）',
					guider_coupon_id: couponTemid,//优惠券id
					guiderid: guiderId,//导购会员id
					print_number:localStorage.getItem('print_number') ? localStorage.getItem('print_number') : 1
				}

				window.removeEventListener('keypress', this.state.keylistener, true)

				createorder(obj)
					.then(res => {
						if (res) {
							if (res.data.status === 4001) {
								let numeration = null
								if (localStorage.getItem('tea_tiem')) {
									let a = JSON.parse(localStorage.getItem('tea_tiem')),
										contrast_time = +a.tea_time,
										now_time = +String(moment().valueOf()).slice(0, 8)
									if (contrast_time <= now_time) {
										localStorage.setItem('tea_tiem', JSON.stringify({
											tea_time: String(moment().add(1, 'days').valueOf()).slice(0, 8),
											tea_num: 1,
										}))
										numeration = 1
									} else {
										a.tea_num += 1
										localStorage.setItem('tea_tiem', JSON.stringify(a))
										numeration = a.tea_num
									}
								} else {
									localStorage.setItem('tea_tiem', JSON.stringify({
										tea_time: String(moment().add(1, 'days').valueOf()).slice(0, 8),
										tea_num: 1,
									}))
									numeration = 1
								}
								MicroPay({
									orderno: res.data.msg,
									orderNumber: numeration,
									sw_orderNumber: JSON.parse(localStorage.getItem('__setting')).sw_orderNumber,
									vipcard_id: pay_type === 8 ? localStorage.getItem('vipcard_id') : '',
									pay_type: 1,
									member_id: this.props.member.data && this.props.member.data.id,
									hehe: mixingPayment,
									pay_price: this.calcPayment(),
									auth_code: '',
									soundSwitch: this.props.setting.Voice ? 1 : 0,
									print_number:localStorage.getItem('print_number') ? localStorage.getItem('print_number') : 1
								}).then(rres => {
									console.log('qweqwqwewqeqweqwe',rres)
									if (rres.data.status == 1002) {
										console.log('md1',this.props.store.data.sundries)
										window.addEventListener('keypress', this.state.keylistener, true)
										this.props.dispatch(clearOrderList(this.props.order.orderIndex))
										// this.props.dispatch(setOrderList())
										this.props.dispatch(clearMember())
										this.props.dispatch(clearGuide())
										this.setState({
											pay_type: 0,
											loading: false,
											visible: false,
											discount_fee: 0,
											discount_num: 100,
											amountReceived: 0,
											integral: 0,
											auth_code: '',
											transid: '',
											toye: false,
											mixingPayment: false,
											second: false,
											focusInputName: 'amountReceived',
											payTwo: 0,
											isuseCoupon: false,
											couponId: '',
											totaldiscount_fee: 0,
											switchdisabled: false,
											hascoupon: false,
											couponTemid: '',//使用优惠券的id
											coupon_fee: 0,
											hasGuilder: false,
											guiderName: '',
											guiderTel: ''
										}, () => {
											/**
											 * 解决快速连点下的，窗口关闭不及时，造成的点击有效
											 */
											setTimeout(() => {
												this.stopTimeout()
											}, 0)
										})
									} else if (rres.data.status == 2003) {
										this.setState({
											show_public_wrap: true,
										})
										var num = 1
										var r = () => {
											CheckPay({
												orderno: res.data.msg,
												hehe: mixingPayment,
												pay_price: this.calcPayment(),
												pay_type: 1,
												num,
												soundSwitch: this.props.setting.Voice ? 1 : 0,
												print_number:localStorage.getItem('print_number')?localStorage.getItem('print_number'):1
											})
												.then(({ data }) => {
													num += 1
													if (data.status == 1002) {
														window.addEventListener('keypress', this.state.keylistener, true)
														this.props.dispatch(clearOrderList(this.props.order.orderIndex))
														// this.props.dispatch(setOrderList())
														this.props.dispatch(clearMember())
														this.props.dispatch(clearGuide())
														this.setState({
															pay_type: 0,
															loading: false,
															visible: false,
															discount_fee: 0,
															discount_num: 100,
															amountReceived: 0,
															integral: 0,
															auth_code: '',
															transid: '',
															toye: false,
															mixingPayment: false,
															second: false,
															focusInputName: 'amountReceived',
															payTwo: 0,
															isuseCoupon: false,
															couponId: '',
															totaldiscount_fee: 0,
															switchdisabled: false,
															hascoupon: false,
															couponTemid: '',//使用优惠券的id
															coupon_fee: 0,
															hasGuilder: false,
															guiderName: '',
															guiderTel: ''
														}, () => {
															/**
															 * 解决快速连点下的，窗口关闭不及时，造成的点击有效
															 */
															setTimeout(() => {
																this.stopTimeout()
															}, 0)
															this.setState({
																show_public_wrap: false,
															})
														})
													} else if (data.status == 2003) {
														r()
													} else {
														window.addEventListener('keypress', this.state.keylistener, true)
														notification.open({
															message: <h2 style={{ fontSize: 40, marginLeft: 40, marginBottom: 0, color: 'red' }}>支付失败</h2>,
															duration: 5,
														});
														this.setState({
															show_public_wrap: false,
														})
													}
												})
										}
										r()
									} else {
										window.addEventListener('keypress', this.state.keylistener, true)
										notification.open({
											message: <h2 style={{ fontSize: 40, marginLeft: 40, marginBottom: 0, color: 'red' }}>支付失败</h2>,
											duration: 5,
										});
									}
								})
							} else {
								notification.error({
									message: "提示",
									description: '创建订单失败',
								})

								window.addEventListener('keypress', this.state.keylistener, true)

							}
						}
					})
			}
		}

		this.setState({
			keylistener: a
		}, () => {
			window.addEventListener('keypress', this.state.keylistener, true)
		})
	}

	sdj1128 = async () => {
		const { vdj1128, discount_fee } = this.state
		if (!(vdj1128 && +vdj1128)) return false
		const response = await validateOrder(vdj1128, 1, this.calcPayment())
		if (response && response.data && response.data.status == 4001) {
			const {
				data: {
					msg: {
						orderno,
						money,
					}
				}
			} = response

			// notification.success({
			// 	message:'',
			// 	description:`减免金额：${cash}元`
			// })

			this.props.dispatch(eidtStore({
				...this.props.store.data,
				sundries: {
					id1129: orderno,
				}
			}))
			this.setState({
				orderno1129: +money,
				discount_fee: +money,
				vdj1128: '',
			})
		} else {
			// notification.info({
			// 	message:'',
			// 	description:'减免金额大于结算金额'
			// })
			this.setState({
				vdj1128: '',
			})
		}
	}

	componentDidUpdate(prevProps, prevState) {
	}

	componentWillUnmount() {
		window.removeEventListener('keypress', this.state.keylistener, true)
	}

	componentWillReceiveProps(nextProps) {
		let { discount_fee, discount_num, totaldiscount_fee } = this.state
		/**
		 * 1.计算商品总价与满减 只与商品有关
		 * 2.totalPrice总是不变的，或者说只与订单中的商品有关
		 * 3.不应被setState触发更新
		 * 4.默认满减，人为修改减免，以手动干预为优先
		 * 5.bug手动修改减免，为0，继续添加商品，恢复满减
		 */
		let { order, fullsub } = nextProps
		// console.log(this.props.order.dataList[this.props.order.orderIndex], order.dataList[order.orderIndex])
		/**
		 * 1.满减函数只能计算当前商品总金额下的满减，
		 * 2.要么符合，获得相应的满减金额，要么不符合，获得满减数值0
		 * 3.显然这样是不对的，设想收银员先编辑减免/折扣，再添加商品，这会导致原先编辑的减免/折扣被清零
		 * 3.针对上述情况，选择的解决方案是：将当前的满减同上次的满减，进行比较
		 * 注：满减金额指的是总金额下的满减金额 对应字段 sub
		 */
		/**
		 * 1. cur 返回当前的总价(totalPrice) 与 减免（discount_fee）
		 * 2. pre 返回上次的总价(totalPrice) 与 减免（discount_fee）
		 * 3. 当当前减免大于总价时，减免清空 discount_fee = 0
		 */
		let pre = this.totalPrice(this.props.order, fullsub)
		let cur = this.totalPrice(order, fullsub)
		let store = this.props.store
		if (cur.totalPrice <= 0 || cur.totalPrice < Number(this.state.is_at_least)) {
			this.setState({
				isuseCoupon: false,//是否开启使用优惠券
				couponId: '',
				totaldiscount_fee: 0,
				switchdisabled: false,
				hascoupon: false,
				couponTemid: '',//使用优惠券的id
				coupon_fee: 0,
				isuseGuider: false,//是否开启导购会员
				guiderId: '',
				guiderCode: '',
				hasGuilder: false,
				guiderName: '',
				guiderTel: ''
			})
		}
		// console.log('pre=', pre, 'cur=', cur)

		discount_fee = pre.discount_fee === cur.discount_fee ? pre.discount_fee : cur.discount_fee
		discount_num = ((cur.totalPrice - Number(discount_fee)) / cur.totalPrice * 100)
		/**
		 * [当前减免优惠不能大于总金额， 否则自动为0]
		 */
		discount_fee = Number(cur.totalPrice) > Number(discount_fee) ? discount_fee : 0
		discount_num = Number(cur.totalPrice) > Number(discount_fee) ? discount_num : 100
		if (this.state.mixingPayment) {
			this.setState({
				totalPrice: this.precisionControl(cur.totalPrice),
				discount_fee,
				discount_num,
			}, () => {
				localStorage.setItem('zongjine', this.state.totalPrice)
			})
		} else {
			this.setState({
				totalPrice: this.precisionControl(cur.totalPrice),
				amountReceived: this.precisionControl(cur.totalPrice),
				discount_fee,
				discount_num,
			}, () => {
				localStorage.setItem('zongjine', this.state.totalPrice)
			})
		}
		// if (JSON.stringify(store) != "{}" && store.data.role.power_discount == 1) {
		// if (JSON.stringify(store) != "{}" && store.data.role != undefined && store.data.role.power_discount == 1) {
		// 	this.setState({
		// 		discountBox: 'block'
		// 	})
		// } else {
		// 	this.setState({
		// 		discountBox: 'none'
		// 	})
		// }
	}

	totalPrice(order, fullsub) {
		let totalPrice = 0;
		let discount_fee = 0;
		order.dataList[order.orderIndex] && order.dataList[order.orderIndex].forEach(item => {
			/**
			 * 优先临时减免，然后再是会员价，会员折扣
			 * 临时减免不能与会员价，会员折扣共用
			 */
			//为了确保数据正常，在小计的时候就要做数据的四舍五入item.posprice - item.discount_fee
			totalPrice += Number(this.precisionControl(Number((item.discount_fee) !== 0 ? item.modifyprice : (item.specialPrice || item.posprice)) * item.num))
			// totalPrice += Number(Number(item.discount_fee) !== 0 ? Number(item.subtotal) - item.discount_fee : item.specialPrice ? Number(item.specialPrice*item.num).toFixed(2) : Number(item.subtotal).toFixed(2))
		})
		/**
		 * [满减]
		 */
		if (typeof fullsub.data !== 'undefined' && fullsub.data.msg && fullsub.data.msg.length !== 0) {
			fullsub.data.msg.sort((a, b) => b.full - a.full)
			let obj = fullsub.data.msg.find(item => Number(totalPrice) >= Number(item.full))
			if (obj && (Number(this.state.discount_fee) !== Number(obj.full))) {
				discount_fee = obj.sub
			} else {
				discount_fee = 0
			}
		}
		return { totalPrice, discount_fee: Number(discount_fee) }
	}

	/**
	 * [stopTimeout 清除定时器]
	 * @return {[type]} [description]
	 */
	stopTimeout() {
		disable = false
		this.timer && clearTimeout(this.timer)
	}

	sendAuthCode = () => {
		const { amountReceived, auth_code, pay_type } = this.state
		const price = this.calcPayment()
		const pay_price = this.state.second ? (this.state.payTwo || price - amountReceived) : (amountReceived || price)
		this.iterator.payment({
			couponid: this.props.store.data.sundries && this.props.store.data.sundries.id1129,
			member: this.props.member,
			pay_price,
			pay_type,
			auth_code,
			toye: +this.state.toye,
			addcountInter: this.addcountInter
		})
	}
	loading = (check) => {
		if (check === 1) {
			console.log('成功3')
			this.setState({
				loading: false,
				countInter: 59
			})
			this.payFinsh()
		} else if (check === 0) {
			console.log('成功2')
			this.setState({
				loading: false,
				visible: false,
				countInter: 59
			})
		} else if (check === 2) {
			console.log('成功1')
			this.setState({
				loading: false,
				visible: false,
				countInter: 59
			})
		} else if (check === 9) {
			this.setState({
				loading: false,
				visible: true,
				countInter: 59
			})
		}
		if (check === 3 && this.state.countInter === 0) {
			return 'ok'
		} else {
			return 'no'
		}
	}
	payFinsh = () => {
		this.setState({
			countInter: 59
		})
		const change = this.giveChange() >= 0 ? this.giveChange() : 0
		if (this.state.mixingPayment && !this.state.second) {
			this.setState({
				focusInputName: 'payTwo',
				payTwo: -change,
				loading: false,
				second: true,
				auth_code: '',
				integral: 0,
			}, () => {
				this.stopTimeout()
				let w = JSON.parse(localStorage.getItem('is_quit'))
				w = {
					...w, ...{
						is_quit: true,
						payTwo: -change,
						amountReceived: this.state.amountReceived,
					}
				}
				localStorage.setItem("is_quit", JSON.stringify(w))
			})
		} else {
			this.props.dispatch(clearOrderList(this.props.order.orderIndex))
			// this.props.dispatch(setOrderList())
			this.props.dispatch(clearMember())
			this.props.dispatch(clearGuide())
			notification.open({
				message: <h2 style={{ fontSize: 40, marginLeft: 40, marginBottom: 0, color: 'red' }}>找零：{change}</h2>,
				duration: 5,
			});
			localStorage.removeItem("_guider")
			this.setState({
				cannotturnoff: false, //支付时不能关闭
				pay_type: 0,
				loading: false,
				visible: false,
				discount_fee: 0,
				discount_num: 100,
				amountReceived: 0,
				integral: 0,
				auth_code: '',
				transid: '',
				toye: false,
				mixingPayment: false,
				second: false,
				focusInputName: 'amountReceived',
				payTwo: 0,
				isuseCoupon: false,
				couponId: '',
				totaldiscount_fee: 0,
				switchdisabled: false,
				hascoupon: false,
				couponTemid: '',//使用优惠券的id
				coupon_fee: 0,
				hasGuilder: false,
				guiderName: '',
				guiderTel: '',
				is_login: false,
				quibinary_status: true,
			}, () => {
				/**
				 * 解决快速连点下的，窗口关闭不及时，造成的点击有效
				 */
				setTimeout(() => {
					this.stopTimeout()
				}, 0)
			})
		}
	}

	payFail = () => {
		this.setState({
			countInter: 59,
			loading: false
		})
	}

	paymentSettlement() {
		this.setState({
			is_first: true,
			quibinary_status: false,
			focusInputName: 'amountReceived'
		})
		disconnect()
			.then(res => {
				if (
					res.data.status == 1
					&& this.state.netStatusGoPricePay == 0
					&& this.props.store.data.name
				) {
					this.setState({
						netStatusGoPricePay: 1
					})

					const openNotification = () => {
						notification.open({
							message: '提示',
							description: '网络恢复正常，收银自动调整为联网模式，会员和非现金支付已恢复使用',
							style: {
								width: 600,
								marginLeft: 335 - 600,
							},
						});
					};

					let isnet = localStorage.getItem('isconnect');
					if (isnet == 'true') {
						// console.log('断开 ' + 123)
						openNotification()
						localStorage.setItem('isconnect', '')
					}
				} else if (
					res.data.status == 9002
				) {
					// if(res.data == ""){
					this.setState({
						netStatusGoPricePay: 0
					})

					const onClearMember = () => {
						let { dataList, orderIndex } = this.props.order
						dataList = dataList.slice()
						dataList[orderIndex] && dataList[orderIndex].forEach(item => {
							item.specialPrice && (delete item.specialPrice)
						})
						this.props.dispatch(resetOrderList(dataList[orderIndex], orderIndex))
						this.props.dispatch(clearMember())
					}
					onClearMember()

					// this.props.dispatch(clearMember())


					const openNotification = () => {
						notification.open({
							message: '提示',
							description: '网络异常或阻塞，收银自动调整为本地模式，会员和非现金支付将不可用',
							style: {
								width: 600,
								marginLeft: 335 - 600,
							},
						});
					};

					let isnet = localStorage.getItem('isconnect');
					if (isnet == null || isnet == '') {
						// console.log('断开 ' + 123)
						openNotification()
						localStorage.setItem('isconnect', 'true')
					}

				} else if (
					res.data.status == 1
					&& this.state.netStatusGoPricePay == 1
				) { }

				this.setState({
					mbsw1217: !this.props.member.data,
				})
			})
		// console.log('进入',this.state.netStatusGoPricePay)
		// if (this.props.member.data) {
		//     this.setState({
		//         pay_type: 3
		//     })
		// } else {
		//     this.setState({
		//         pay_type: 0
		//     })
		// }
		let stg = JSON.parse(localStorage.getItem('__setting')).payNum
		let str_bool = JSON.parse(localStorage.getItem('__setting')).payType

		if (this.props.member.data && str_bool[3]) {
			this.setState({
				pay_type: 3
			})
		} else if (PAYEMNTMETHODS[stg] && str_bool[stg]) {
			this.setState({
				pay_type: stg
			})
		} else {
			this.setState({
				pay_type: str_bool.indexOf(true)
			})
		}

		this.setState({
			visible: true,
			NumericKeypadOrPrCode: false,
			receivable: this.state.receivable ? this.state.receivable : this.state.totalPrice,
		})
		this.setState({
			amountReceived: this.calcPayment()
		})
		localStorage.setItem('calcDiscount', '0.00')
	}

	/**
	 *
	 * @param {按钮值} value
	 * @param {输入框值} str
	 * @param {点击确认后执行} success
	 */
	onVirtualKeyboard(value, str, success) {
		if (!isNaN(Number(value))) {
			/**
			 * [if 点击10，20，50，100]直接做金额的相加
			 */
			// if(Number(value) > 9&&Number(str) % 10 === 0) {
			//     str = Number(str) + Number(value)
			// }else {
			//     str = !str ? value : str + value
			// }

			// console.log("yrh: " + this.state.is_first)
			if (this.state.is_first) {
				str = ''
				this.setState({ is_first: false })
			}

			if (Number(value) > 9 && Number(str) % 10 === 0) {
				str = Number(str) + Number(value)
			} else {
				str = !str ? value : str + value
			}
		} else {
			switch (value) {
				case '.':
					this.setState({ is_first: false })
					if (str.indexOf('.') === -1) {
						str = !!!str ? '0.' : str + '.'
					}
					break
				case '清除':
					str = ''
					break
				case '退格':
					str = str && str.substring(0, str.length - 1)
					break
				case '确定':
					success()
					this.setState({ is_first: true })
					if (this.state.mixingPayment && !this.state.second) {
						this.setState({ controlAR: this.state.amountReceived })
					}
					break
				default:
			}
		}
		return str
	}

	//精度控制
	round(num, decimal) {
		if (isNaN(num)) {
			return 0;
		}
		const p1 = Math.pow(10, decimal + 1);
		const p2 = Math.pow(10, decimal);
		return Math.round(num * p1 / 10) / p2;
	}

	toFixed(num, decimal) {
		return this.round(num, decimal).toFixed(decimal);
		// return this.round(num, decimal).toFixed(decimal);
	}

	precisionControl(value) {
		let { data } = this.props.store
		if (data) return data.total_set === 1 ? this.toFixed(value, data.total_accuracy) : value.toString().substring(0, value.toString().indexOf('.') + data.total_accuracy + 1)
	}

	getDiscount() {

	}

	//计算折扣
	calcDiscount(value) {
		let { discountsType, totalPrice, couponId, focusInputName, coupon_fee, totaldiscount_fee } = this.state
		let output1 = this.onVirtualKeyboard(value, this.state[focusInputName], () => {
			// let v = {
			// 	"vdj1128": "sdj1128",
			// 	"va1125": "onPressEnter1125",
			// }[focusInputName]
			// if (v) return this[v]()
			return this.setState({
				discountVisible: false,
			})

		})

		if (['vdj1128', 'va1125'].includes(focusInputName)) {
			this.setState({
				[focusInputName]: output1,
			})
			return false
		}

		if (focusInputName == 'discount_fee') {
			if (+output1 > +totalPrice) {
				notification.open({
					message: '提示',
					description:
						'减免金额必须小于总金额',
					onClick: () => {
						console.log('Notification Clicked!');
					},
				})
			}

			output1 = +output1 < +totalPrice ? String(output1) : String(totalPrice)
			this.setState({
				totaldiscount_fee: (Number(coupon_fee) + Number(output1)).toFixed(2)
			})
		}
		if (focusInputName == 'discount_num') {
			if (+output1 > 100) {
				notification.open({
					message: '提示',
					description:
						'折扣率不能大于100',
					onClick: () => {
						console.log('Notification Clicked!');
					},
				});
				fail()
			}

			output1 = +output1 < 100 ? String(output1) : '100'
			this.setState({
				totaldiscount_fee: (Number(coupon_fee) + Number(Number(totalPrice) - Number(output1) / 100 * Number(totalPrice))).toFixed(2)
			})
		}
		this.setState({
			//保留小数位数
			[focusInputName]: String(output1).match(/\d{0,}\.{0,1}\d{0,2}/) ? String(output1).match(/\d{0,}\.{0,1}\d{0,2}/)[0] : output1
		})
		const success = () => {
			this.setState({ discountVisible: false })
		}
		const fail = () => {
			this.setState({ discountVisible: true });
		  };
		let key = discountsType === 'amount' ? 'discount_fee' : 'discount_num'
		let anotherKey = discountsType !== 'amount' ? 'discount_fee' : 'discount_num'
		let output = this.onVirtualKeyboard(value, this.state[key], success).toString()
		if (key == 'discount_fee') {
			output = +output < +totalPrice ? String(output) : String(totalPrice)
			if (
				Number(output) >
				totalPrice - (totalPrice * this.state.max_discount) / 100
			  ) {
				// console.log(11)
				message.warning(
				  `注意最大折扣为${this.state.max_discount}%，最多减免${(
					totalPrice -
					((totalPrice * this.state.max_discount) / 100).toFixed(2)
				  ).toFixed(2)}元`
				);
				// output = 1456
				// output = 0
				// return false
				fail();
			  }
		}
		if (key == 'discount_num') {
			output = +output1 < 100 ? String(output1) : '100'
			if (Number(output) < this.state.max_discount) {
				message.warning(
				  `注意最大折扣为${this.state.max_discount}%，最多减免${(
					totalPrice -
					((totalPrice * this.state.max_discount) / 100).toFixed(2)
				  ).toFixed(2)}元`
				);
		
				fail();
			  }
		}
		/**
		 * [if 为discount_fee减免金额，通过优惠金额对应到优惠折扣]
		 * 反之亦然
		 */
		// if(totaldiscount_fee>0){
		var anotherValue = key === 'discount_fee' ? ((totalPrice - Number(output)) / totalPrice * 100).toFixed(2) : (1 - Number(output) / 100) * totalPrice
		// }
		localStorage.setItem('calcDiscount', output.indexOf('.') === -1 ? output : output.substring(0, output.indexOf('.') + 3))
		// localStorage.setItem('anotherValue', anotherValue)
		this.setState({
			//保留小数位数
			// [key]: output.indexOf('.') === -1 ? output : output.substring(0, output.indexOf('.') + 3),
			[anotherKey]: String(anotherValue).match(/\d{0,}\.{0,1}\d{0,2}/) ? String(anotherValue).match(/\d{0,}\.{0,1}\d{0,2}/)[0] : anotherValue
		})
	}

	//计算应收
	calcPayment() {
		let data;
		const calcReceivable = () => {
			let { receivable, discount_fee, totalPrice, coupon_fee, totaldiscount_fee } = this.state
			if (totaldiscount_fee > 0) {
				receivable = totalPrice - coupon_fee - discount_fee
			} else {
				receivable = totalPrice - discount_fee
			}

			return Number(receivable)
		}
		//积分不可用
		if ((!this.props.store.data) || (this.props.store.data && this.props.store.data.is_score === 0) || !this.props.member.data) {
			data = calcReceivable()
		} else {
			data = calcReceivable() - this.state.integral * this.props.store.data.score
		}
		localStorage.setItem('calcPayment', data)
		return data < 0 ? 0 : this.precisionControl(data)
	}

	//计算找零
	giveChange() {
		let calcPayment = this.calcPayment();
		// let change = ((this.state.amountReceived || calcPayment) - calcPayment)
		let change = ((this.state.amountReceived ? this.state.amountReceived : 0) - calcPayment)
		change = this.state.second ? (this.state.payTwo || -change) - (-change) : change
		return this.precisionControl(change)
	}

	showModal = () => {
		this.setState({
			giftCardModel: true,
		});
	}

	hideModal = () => {
		this.setState({
			giftCardModel: false,
			giftCardValue: ''
		});
	}

	handleClick() {
		// liked is false 的时候，不允许再点击

	}

	giftCardSearch(giftCardValue) {
		//  console.log(giftCardValue)
		getPosCard(giftCardValue).then(res => {
			if (res.data.status === 4001) {
				this.setState({
					giftCardData: res.data.msg
				}, () => {
					localStorage.setItem("vipcard_id", this.state.giftCardData[0].id);
				})
			} else {
				this.setState({
					giftCardData: []
				}, () => {
					localStorage.setItem("vipcard_id", '');
				})
			}

			// data = res.data.data
			// console.log(data)
		})
	}

	controlAmount = () => {
		if (this.state.mixingPayment && this.state.second) {
			this.setState({
				amountReceived: this.state.controlAR
			})
		}
	}

	addcountInter = () => {
		this.setState({
			countInter: 59
		})
	}

	//实付界面 输入和确认支付
	calcPaymentInput(value, is_second_window = true) {
		console.log(value);
		this.setState({
			countInter: 59
		}, () => {
			// let count = this.state.countInter
			const timer = setInterval(() => {
				this.setState((olds, oldp) => ({
					countInter: --olds.countInter
				}), () => {

					if (this.state.countInter === 0 || !this.state.loading) {
						console.log('倒计时结束了')
						clearInterval(timer);
						this.setState({
							liked: true,
							countInter: 0,
							loading: false
						}, () => {
							console.log(this.state.loading)
						})
					}

				});
			}, 1000);
		})

		let {
			countsm,
			focusInputName,
			second,
			pay_type,
			discount_fee,
			discount_num,
			integral,
			totalPrice,
			amountReceived,
			transid,
			mixingPayment,
			remark,
			couponTemid,
			guiderId,
			is_login,
			change
		} = this.state
		let { store, member } = this.props
		
		console.log(second)

		let success = () => {
			if (store.data.show_payment_qrcode == 2 && is_second_window && (pay_type == 9 || pay_type == 5 || pay_type == 6)) {
				this.setState({
					cashier_box_x: -804
				})
				// --------------------
				localStorage.setItem('paytype',pay_type)
				return
			}
			if (
				(
					store.data.membersaddpasswords == 1
					|| store.data.is_payment == 1
				) && pay_type == 3
				&& !is_login
				&& (
					!member.data || !member.data.is_card
				)
			) {
				this.setState({
					show_password: true,
					mem_password: '',
				}, () => {
					setTimeout(() => {
						if (this.props.store.data.is_payment == 1) {
							this.refBarcode.current.focus()
						} else {
							this.refPassword.current.focus()
						}
					}, 100)
				})
				return false
			}

			const { is_payment } = this.props.store.data
			let goods = this.props.order.dataList[this.props.order.orderIndex]
			let change = this.giveChange()
			let price = localStorage.getItem('calcPayment')
			var total_accuracy_num = null

			switch (store.data.total_accuracy) {
				case 1:
					total_accuracy_num = 1
					break
				case 2:
					total_accuracy_num = 2
					break
				case 3:
					total_accuracy_num = 0
					break
				default:
					break
			}

			if (this.state.amountReceived <= 0) {
				message.warning('请重新输入支付金额')
				return false
			}
			if (
				goods && goods.find(item => item.subtotal == 0 && item.is_freegift != 2 && !item.showPromotionImg)
			) {
				message.warning('存在小计金额为0的订单')
				return false
			}
			if (pay_type === 8 && this.state.giftCardData.length) {
				if (Number(this.state.giftCardData[0].card_cash) < Number(amountReceived || price) && pay_type === 8) {
					message.warning('余额不足');
					return false
				}
			}
			if (pay_type === 8 && !this.state.giftCardData.length) {
				message.warning('请先获取购物卡信息');
				return false
			}
			if (+(+amountReceived || +price).toFixed(total_accuracy_num) >= 1000000) {
				message.info('单笔支付超过100万元，不符合实际需求，请重新支付')
				return false
			}
			if ((+price).toFixed(total_accuracy_num) <= 0) {
				return message.error('应收金额不能小于或等于0')
			}
			if (
				pay_type === 3 &&
				goods &&
				goods.find(item => item.allow_balance_pay == "1")
			  ) {
				message.info("存在不能使用会员余额支付的商品");
				return false;
			  }
			this.setState({
				auth_code: ''
			})
			/* eslint-disable */
			const input = this.refs.authCodeInput
			/* eslint-enable */
			input.focus();
			if (disable) return
			disable = true
			this.timer = setTimeout(() => {
				disable = false
			}, 3000)

			let obj = {
				countsm,
				totalmoney: goods.reduce((a, b) => +(b.posprice * b.num).toFixed(total_accuracy_num) + a, 0),
				DiscountAmount: goods.reduce((a, b) => +(b.posprice * b.num).toFixed(total_accuracy_num) + a, 0) - +(+price).toFixed(total_accuracy_num),
				store_id: this.props.store.data.id,
				createid: this.props.sale.data.id,
				userinfo: this.props.member.data || null,
				guide_id: (this.props.guide.data && this.props.guide.data.id) || null,
				transid: transid,// 银行卡支付流水凭证号
				list: goods,
				pay_type: pay_type,// `pay_type` int(4) NOT NULL COMMENT '支付方式1：支付宝2:微信支付，3现金，4银行卡 9:会员支付，0:虚拟人',
				remark_id: remark.id,// `remark_id` varchar(100) NOT NULL DEFAULT '' COMMENT '优惠id',
				discount_remark: remark.remark, // 优惠备注
				goodsprice: totalPrice,// `goodsprice` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品总价格',
				pay_price: (+amountReceived || +price).toFixed(total_accuracy_num),// `pay_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实收金额',
				price: (+price).toFixed(total_accuracy_num),//`price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '应收金额',
				return_price    : change,// `return_price` 找零
				discount_num: discount_num,// `discount_num` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '折扣',
				discount_fee: discount_fee,// `discount_fee` decimal(10,2) NOT NULL COMMENT '减免',
				use_score: integral,// `use_score` int(11) NOT NULL DEFAULT '0' COMMENT '使用积分数',
				score_discount: integral * this.props.store.data.score,// `score_discount` int(11) NOT NULL DEFAULT '0' COMMENT '积分优惠',
				wechat_discount: 100,// `wechat_discount` float(10,2) NOT NULL DEFAULT '100.00' COMMENT '微信折扣(100默认是没有折扣)',
				member_discount: 100,// `member_discount` float(10,2) NOT NULL DEFAULT '100.00' COMMENT '余额折扣(100默认是没有折扣)',
				huiyuan_discount: !!this.props.member.data ? this.props.member.data.rights : 100,// `huiyuan_discount` float(10, 2) NOT NULL DEFAULT '100.00' COMMENT '会员折扣',
				toye: Number(this.state.toye),// `toye` tinyint(3) NOT NULL DEFAULT '0' COMMENT '现金转余额(0不开启1开启)',
				print_xp: Number(this.state.print_xp),// `print_xp` tinyint(3) NOT NULL DEFAULT '0' COMMENT '订单结算后打印小票（0不打印1打印）',
				guider_coupon_id: couponTemid,//优惠券id
				guiderid: (!!guiderId && guiderId) || (JSON.parse(localStorage.getItem("_guider")) && JSON.parse(localStorage.getItem("_guider")).guiderId),//导购会员id
				hehe: mixingPayment,
			}
			if (!second) {
				this.iterator = new Pay({
					order: obj,
					member: this.props.member,
					is_payment,
					pay_type,
					mixingPayment
				})
				this.setState({ loading: true, cannotturnoff: true, })
				if (mixingPayment) {
					if (Number(this.state.pay_price) > Number(this.state.calcPayment) && Number(this.state.pay_price) > 0) {
						message.warning('混合支付开启后，第一次金额需小于应收金额');
						return false
					}
				}
				this.iterator.createorder({
					couponid: this.props.store.data.sundries && this.props.store.data.sundries && this.props.store.data.sundries.id1129,
					pay_type,
					change,
					payFinsh: this.payFinsh,
					payFail: this.payFail,
					loading: this.loading,
					ctrAR: this.controlAmount,
					sw1126: this.props.setting.xj1126,
				})
				
				delete this.props.store.data.sundries

				// setTimeout(()=>{
				//     this.setState({loading: false})
				// },40000)
			} else {
				if (change > 100) {
					message.warning('找零不能大于100');
					return false
				}
				if (change < 0) {
					message.warning('找零不能小于0');
					return false
				}
				this.setState({ loading: true })
				if (!this.iterator.order) {
					this.iterator = new Pay({
						order: obj,
						member: this.props.member,
						is_payment,
						pay_type,
						mixingPayment,
						payFinsh: this.payFinsh,
						payFail: this.payFail,
					})
				}
				this.iterator.payment({
					couponid: this.props.store.data.sundries && this.props.store.data.sundries.id1129,
					pay_price: this.state.payTwo || price - amountReceived,
					member: this.props.member,
					pay_type,
					toye: +this.state.toye,
					addcountInter: this.addcountInter,
				})

			}
		}

		value = this.onVirtualKeyboard(value, this.state[focusInputName], success)
		if (focusInputName === 'payTwo' && Number(value) < this.state.payTwo) {
			value = 0
		}
		// this.setState({
		//     [focusInputName]: value
		// })
		/*非现金支付且不是混合支付时 不予 修改价格*/
		let q = (v) => {
			let w = new RegExp(`\\d{0,}\\.{0,1}\\d{0,${this.props.store.data.total_accuracy}}`)
			return String(v).match(w)
		}

		if (focusInputName === 'amountReceived' && pay_type !== 0 && !this.state.mixingPayment) return
		if (focusInputName === 'payTwo') {
			if (this.state.pay_type == 0 && this.state.second) {
				this.setState({
					[focusInputName]: q(value) ? q(value)[0] : value
				})
			} else {
				return
			}
		}
		if (focusInputName === "integral") {
			let score_balance = this.props.member.data.score_balance,
				integral = this.state.integral,
				totalPrice = this.state.totalPrice
			if (+value > +score_balance) {
				value = score_balance
			}
			if (+value * this.props.store.data.score > +totalPrice) {
				value = totalPrice / this.props.store.data.score
			}

			this.setState({
				integral: q(value) ? q(value)[0] : value
			}, () => {
				this.setState({
					amountReceived: this.calcPayment()
				})
			})
			return
		}
		this.setState({
			[focusInputName]: q(value) ? q(value)[0] : value
		})
	}

	giftChange(e) {
		this.setState({
			giftCardValue: e.target.value
		})
	}

	/**
	 * 点击抹零按钮
	 */
	smallchange = (i) => {
		let { discount_fee, totalPrice, } = this.state,
			calcPayment = this.calcPayment()

		discount_fee = String(Number(discount_fee).toFixed(2))
		switch (i) {
			case 1:
				discount_fee = 0.1
				this.setState({
					countsm: 0.1
				})
				break
			case 2:
				discount_fee = 0.2
				this.setState({
					countsm: 0.2
				})
				break
			case 3:
				discount_fee = 0.3
				this.setState({
					countsm: 0.3
				})
				break
			case 4:
				discount_fee = 0.4
				this.setState({
					countsm: 0.4
				})
				break
			case 0:
				discount_fee = totalPrice.match(/\.\d{1,2}/) ? +(totalPrice.match(/\.\d{1,2}/)[0]) : 0
				this.setState({
					countsm: totalPrice.match(/\.\d{1,2}/) ? +(totalPrice.match(/\.\d{1,2}/)[0]) : 0
				})
				break
			default:
				break
		}
		discount_fee = Number(discount_fee).toFixed(2)
		if (+totalPrice < +discount_fee) {
			discount_fee = totalPrice
		}
		this.setState({
			discount_fee,
		})
	}

	//获取优惠券信息
	getCoupon() {
		let { couponId } = this.state
		this.setState({
			hascoupon: false,
		})
		getUseCoupons(couponId).then(res => {
			console.log(res)
			if (res.data.status == 1) {
				if (res.data.data.is_at_least == 2) {
					if (Number(res.data.data.at_least) > this.state.totalPrice) {
						message.warning('该优惠券未达到满减金额' + res.data.data.is_at_least);
						return false
					}
				}
				var couponFee = res.data.data.cash
				this.setState({
					hascoupon: true,
					is_at_least: res.data.data.is_at_least,
					couponTemid: res.data.data.couponid,
					coupon_fee: couponFee
				}, () => {
					console.log();
					this.setState({
						totaldiscount_fee: (Number(this.state.discount_fee) + Number(couponFee)).toFixed(2)
					})
				})
			} else {
				message.warning(res.data.msg);
				return false
			}
		})
	}

	//导购会员信息
	getGuider() {
		let { guiderCode } = this.state
		this.setState({
			hascoupon: false,
		})
		getUseGuider(guiderCode).then(res => {
			console.log(res)
			if (res.data.status == 1) {
				this.setState({
					hasGuilder: true,
					guiderName: res.data.data.name,
					guiderTel: res.data.data.mobile,
					guiderId: res.data.data.id
				})
			} else {
				message.warning(res.data.msg);
				this.setState({
					hasGuilder: false,
					guiderName: '',
					guiderTel: '',
				})
				return false
			}
		})
	}

	//打开导购员modal
	selectGuider() {
		this.setState({
			selectGuiderModal: true
		}, () => {
			this.getguiderList(this.state.char, this.state.mobile)
		})
	}

	getguiderList(char, mobile) {
		// let response = await guider_list({char,mobile})
		guider_list(char, this.props.store.data.id, mobile).then(res => {
			if (res.data.status == 1) {
				this.setState({
					guiderList: res.data.data
				})
			} else {
				message.warning(res.data.msg);
			}
		})
	}

	//搜索导购员
	searchGuiderList(value) {
		let { focusInputName } = this.state
		let output = onVirtualKeyboard(value, this.state[focusInputName], () => {
		})
		if (output.indexOf('undefined') != -1) {
			var reg = new RegExp("undefined", "g");
			;
			output = output.replace(reg, "");
		}
		if (value == '确定') {
			if (focusInputName == 'guidername') {
				this.getguiderList(output, this.state.mobile);
			}
			if (focusInputName == 'guiderPhone') {
				this.getguiderList(this.state.char, output);
			}
		}
		this.setState({
			//保留小数位数
			[focusInputName]: output
		})
	}

	getlist2(e) {
		this.setState({
			guiderId: e.id,
			guiderName: e.name,
			hasGuilder: true,
			guiderTel: e.mobile
		}, () => {
			this.setState({
				selectGuiderModal: false,
			})
		})
	}

	handleOk() {
		this.setState({
			mixingPayment: true,
			amountReceived: this.calcPayment(),
			aaavisible: false,
		}, () => {
			setTimeout(() => {
				this.inputRef.current.focus()
			}, 0)
		})
	}

	handleCancel = (e) => {
		this.setState({
			aaavisible: false,
		});
	}
	notconnect = (e) => {
		this.setState({
			bbbvisible: false,
		});
	}

	renderScore() {
		return (
			<div>
				<Col span={10}>
					<FormItem
						{...formItemLayout}
						label="积分："
						style={{
							marginLeft: '21px',
						}}
					>
						<Input
							size={'large'}
							value={this.state.integral}
							onFocus={() => this.setState({ focusInputName: 'integral' }, () => {
								this.calcPaymentInput('清除')
							})}
							onChange={(e) => {
								let val = this.fat_num(e.target.value)
								if (val != this.state.integral) {
									if (this.state.integral.length < val.length || !this.state.integral) {
										this.calcPaymentInput(val.slice(-1))
									} else if (this.state.integral.length > val.length) {
										this.calcPaymentInput('退格')
									}
								}
							}}
							style={{ width: '100%' }}
						/>
					</FormItem>
				</Col>
				<Col
					span={6}
					style={{
						marginLeft: '70px',
					}}
				>
					可用积分：{(this.props.member.data && this.props.member.data.score_balance) || 0}
				</Col>
				<Col
					span={4}
					style={{
						marginLeft: '5px',
					}}
				>
					积分抵扣金额：{(this.props.store.data && this.props.store.data.score * this.state.integral) || 0}
				</Col>
			</div>
		)
	}

	/**
	 * 收银_返回左界面
	 */
	on_cashier_back = () => {
		this.setState({
			cashier_box_x: 0,
		},()=>{
			localStorage.setItem('paytype',false)
		})
	}

	/**
	 * 收银_支付完成
	 */
	completion_payment = () => {
		this.setState({
			cashier_box_x: 0,
		},()=>{
			localStorage.setItem('paytype',false)
		})
		this.calcPaymentInput('确定', false)
	}

	/**
	 * [输入密码_改变值]
	 * @param e dom
	 */
	change_password = (e) => {
		let { value } = e.target
		value = value.replace(/\D/g, '').match(/\d{0,6}/)[0]
		this.setState({
			mem_password: value
		})
	}

	/**
	 * [输入密码_确认密码]
	 */
	request_password = async () => {
		let [{ member }, { mem_password }] = [this.props, this.state];
		if (member["data"]) {
		  let {
			data: { mobile }
		  } = member;
		  let val = await checkPwd({
			mobile,
			pwd: mem_password,
			type: 1
		  });
		  if (val && val.data["status"]) {
			console.log("输密码进来了");
			let {
			  data: { status }
			} = val;
			// eslint-disable-next-line no-unused-expressions
			status == 1002
			  ? this.setState(
				  {
					is_login: true,
					show_password: false
				  },
				  () => {
					// this.calcPaymentInput()
					this.calcPaymentInput("确定", false);
				  }
				)
			  : null;
		  }
		} else {
		  message.info("请先登录会员");
		  this.setState({
			show_password: false
		  });
		}
	  };

	/**
	 * [输入密码_键盘]
	 */
	pwd_keyboard = (v) => {
		let { mem_password } = this.state
		let value = onVirtualKeyboard(v, mem_password, this.request_password)

		this.setState({
			mem_password: value,
		})

	}

	/**
	 * [格式化输入金额]
	 */
	fat_num = (val) => {
		val = val.replace(/[^0-9.]/g, '')
		if (val.split(/\./g).length > 2) {
			val = val.split(/\./g)
			val = `${val[0]}.${val.splice(1).join('')}`
		}
		return val
	}

	render() {
		const { pay_type } = this.state
		let cashier_color, cashier_text, cashier_img;
		if (this.props.store.data && this.props.store.data.show_payment_qrcode == 2) {
			switch (pay_type) {
				case 9:
					cashier_color = '#ff3231'
					cashier_text = '口碑支付'
					cashier_img = this.props.store.data.koubei_qrcode.length
						&& this.props.store.data.koubei_qrcode
						|| numbered
					break
				case 5:
					cashier_color = '#09bb07'
					cashier_text = '个人微信支付'
					cashier_img = wxmode
					break
				case 6:
					cashier_color = '#009fff'
					cashier_text = '个人支付宝支付'
					cashier_img = zfbmode
					break
				default:
					break
			}
		}

		const content = (
			<Row type="flex" justify="center" gutter={16} className="btn-gcolor">
				{
					this.state.guiderList.map((item, index) => (
						<Col key={index}>
							<Button
								style={{ width: 80, height: 80, whiteSpace: 'pre-wrap', fontSize: 17 }}
								size="large"
								onClick={() => {
									this.state.discountsType === 'amount' ? this.setState({
										focusInputName: 'discount_fee',
									}) : this.setState({
										focusInputName: 'discount_num'
									})
									this.getlist2(item)
								}}
								// eslint-disable-next-line react/jsx-no-duplicate-props
								style={{ fontSize: 16, width: 80, height: 80, padding: 0 }}
							>{item.name}</Button>
						</Col>
					))
				}
			</Row>
		)
		const columns = [{
			title: '名称',
			dataIndex: 'name',
		}, {
			title: '余额',
			dataIndex: 'card_cash',
		}, {
			title: '开始时间',
			dataIndex: 'starttime',
		}, {
			title: '结束时间',
			dataIndex: 'endtime',
		}];
		let calcPayment = this.calcPayment()
		const change = this.giveChange()
		const { fullsub } = this.props

		return (
			<div className="audio-controller" style={{
				zIndex: "10",
			}}>
				{
					this.state.show_public_wrap ? (
						<div
							className="public_wrap"
						>
							<Icon type="sync" spin style={{ fontSize: '30px', color: 'rgb(253, 116, 56)' }} />
							<div className="text">等待输入支付密码</div>
						</div>
					) : null
				}
				<FooterLeft
					changeSetting={(obj) => this.props.dispatch(changeSetting(obj))}
					setting={this.props.setting}
					store={this.props.store}
					sale={this.props.sale}
					authority={this.props.authority}
					delete_authorization={() => this.props.dispatch(delete_authorization())}
					guide={this.props.guide}
					fullsub={fullsub}
					eidtStore={(obj) => this.props.dispatch(eidtStore(obj))}
					agms={this.props.store.data ? this.props.store.data.show_order_report : null}
				/>

				<div className="right row">
					<div className="section1">
						<span>
							总金额（元）
												</span>
						<span className="price">{this.state.totalPrice}</span>
					</div>
					<div
						className="section2"
						style={{ display: this.state.discountBox }}
						onClick={() => {
							// this.state.discountsType === 'amount' ? this.setState({
							// 	focusInputName: 'discount_fee',
							// }) : this.setState({
							// 	focusInputName: 'discount_num',
							// })
							
							this.setState({
								discountVisible: true,
								focusInputName: '',
							}, () => {
								setTimeout(() => {
									[this.inputRefMoney.current, this.inputRefDis.current].forEach(i => {
										i && i.focus()
									})
								}, 0);
							})
						}}
					>
						<span>减免／折扣</span>
						<span className="price">
							{/*{this.state.discountsType ==='amount' ? `${this.state.discount_fee}元` : `${this.state.discount_num / 10}折`}*/}
							{
								this.state.discountsType === 'amount'
									? (
										this.state.discount_fee != 0 ? `${this.state.discount_fee}元` : "0元"
										// this.state.totaldiscount_fee > 0 ? `${this.state.totaldiscount_fee}元` : `${this.state.discount_fee}元`
									)
									: `${String(this.state.discount_num / 10).match(/\d{0,}\.{0,1}\d{0,3}/)[0]}折`}
						</span>
					</div>
					<div className="section3 row" onClick={this.paymentSettlement.bind(this)}>
						<div>
							<span className="complete-icon"><i className="iconfont icon-jsq" /></span>
						</div>
						<div className="complete-title">
							<span>结算金额（元）</span>
							<span className="price">{calcPayment}</span>
						</div>
					</div>
				</div>
				<Modal
					width={804}
					zIndex={200}
					title={
						<p>结算            
						{
							JSON.parse(localStorage.getItem('__member')).data
							?
							(
								JSON.parse(localStorage.getItem('__member')).data.member_balance-calcPayment > 0 ? `\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0结算金额：${calcPayment}元，会员余额：${JSON.parse(localStorage.getItem('__member')).data.member_balance}元，余额充足`:
							`\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0结算金额：${calcPayment}元，会员余额：${JSON.parse(localStorage.getItem('__member')).data.member_balance}元，还差${(calcPayment-JSON.parse(localStorage.getItem('__member')).data.member_balance).toFixed(2)}元`
							)
							:''
							
								
									// (JSON.parse(localStorage.getItem('__member')).data.member_balance-this.state.amountReceived > 0
									// ? '余额充足' 
									// :
									// `还差${this.state.amountReceived-JSON.parse(localStorage.getItem('__member')).data.member_balance}元`)
								// (
								// 	JSON.parse(localStorage.getItem('__member')).data.member_balance-this.state.amountReceived > 0 ? `余额充足` : `还差${this.state.amountReceived-JSON.parse(localStorage.getItem('__member')).data.member_balance}元`
								// )
								
							// {
							// 	(JSON.parse(localStorage.getItem('__member')).data.member_balance-this.state.amountReceived)>0?
							// 	`余额充足` ：
							// 	`还差${this.state.amountReceived-JSON.parse(localStorage.getItem('__member')).data.member_balance}`
							// }
							// :
							
							// ''
						}
						
						
						</p>
					}
					bodyStyle={{
						overflow: 'hidden',
					}}
					maskClosable={false}
					keyboard={false}
					visible={this.state.visible}
					onCancel={() => {
						if (this.state.second) {
							notification.open({
								description: '已完成一次支付，为保障数据准确性，请结算完毕，如需退款请结算后在收银单处理',
								style: {
									width: 600,
									marginLeft: 350 - 600,
									color: 'red',
									zIndex: 2000,
								},
							})
							return false
						}
						this.stopTimeout();
						this.setState({
							visible: false,
							loading: false,
							giftCardData: [],
							mixingPayment: false,
							amountReceived: 0.00,
							switchdisabled: false,
							quibinary_status: true,
							cashier_box_x: 0,
						},()=>{
							localStorage.setItem('paytype',false)
						})
						if (this.iterator.clearTimeout) this.iterator.clearTimeout()
					}}
					footer={null}
				>
					{/**/}
					<div
						className='cashier_box'
						style={{
							transform: `translate3d(${this.state.cashier_box_x}px, 0px, 0.1px)`,
						}}
					>
						<div
							className='cashier_left'
						>
							<Spin
								spinning={this.state.loading}
								tip={'本次支付有效时间剩余' + this.state.countInter + '秒'}
							>
								<Row gutter={16}>
									{
										PAYEMNTMETHODS.map((item, index) => (
											<div>
												{
													this.props.setting.payType[index] ?
														<Col span={6} key={index} className='gggg'>
															<Button
																size="large"
																disabled={
																	(
																		this.state.netStatusGoPricePay == 0
																			? (
																				index == 1 || index == 2 || index == 3 || index == 7
																					? "disabled"
																					: ""
																			)
																			: ""
																	)
																	|| (
																		this.state.mbsw1217 && index == 3
																	)
																}
																className={this.state.pay_type === item.pay_type ? 'btn-active' : null}
																style={{
																	marginBottom: 20,
																	width: this.props.setting.isbig ? 190 : 150,
																	height: this.props.setting.isbig ? 50 : 40,
																	backgroundColor: this.props.setting.paytypeBackground ? this.props.setting.paytypeBackground[index] : '#fff'
																}}
																onClick={() => this.setState({
																	pay_type: item.pay_type,
																	// cashier_box_x: this.props.store.data.show_payment_qrcode == 2 && (item.pay_type == 9 || item.pay_type == 5 || item.pay_type == 6) ? -804 : 0,
																}, () => {
																	if (this.state.pay_type === 8) {
																		this.setState({
																			giftCardValue: '',
																			giftCardModel: true,
																			giftCardData: []
																		})
																	} else if (
																		(
																			this.props.store.data.membersaddpasswords == 1
																			|| this.props.store.data.is_payment == 1
																		)
																		&& this.state.pay_type === 3
																		&& !this.state.is_login
																	) {
																		this.setState({
																			show_password: true,
																			mem_password: '',
																		}, () => {
																			setTimeout(() => {
																				if (this.props.store.data.is_payment == 1) {
																					this.refBarcode.current.focus()
																				} else {
																					this.refPassword.current.focus()
																				}
																			}, 100)
																		})
																	}
																	if (this.state.pay_type === 0) {
																		this.setState((state, props) => ({
																			focusInputName: !state.second ? 'amountReceived' : 'payTwo'
																		}))
																	}
																	if (!this.state.mixingPayment && item.pay_type != 0) {
																		this.setState({
																			amountReceived: calcPayment
																		})
																	}
																	if (this.state.focusInputName == 'payTwo' && item.pay_type != 0) {
																		this.setState({
																			payTwo: (calcPayment - this.state.amountReceived).toFixed(2)
																		})
																	}
																	// console.log(calcPayment)
																	if (this.state.mixingPayment) {
																		if (!this.state.second) {
																			this.setState({
																				mixingPayment: false,
																				amountReceived: calcPayment
																			})
																		}
																	}
																})}
															>
																{item.title}
															</Button>
														</Col>
														:
														''
												}
											</div>
										))
									}
									{
										this.state.pay_type === 4 ?
											<Input
												addonBefore="银联凭证号"
												type="number"
												size="large"
												style={{ width: 250 }}
												value={this.state.transid}
												onChange={(e) => this.setState({ transid: e.target.value })}
												onFocus={() => this.setState({ focusInputName: 'transid' })}
											/>
											:
											null
									}

								</Row>

								<Row>
									{this.props.member.data ? this.renderScore() : null}
									<Col style={{ opacity: 0, height: 1 }}>
										<Input.Search
											ref="authCodeInput"
											value={this.state.auth_code}
											onChange={(e) => this.setState({ auth_code: e.target.value })}
											onSearch={() => this.sendAuthCode()}
											onBlur={() => {
												this.state.loading && this.refs.authCodeInput.focus()
											}}
											style={{ width: 200 }}
										/>
									</Col>
								</Row>

								<Row type="flex" justify="space-between">
									<Col span={12}>

										<FormItem
											{...formItemLayout}
											label="应收："
										>
											<Input type="number" disabled size="large" value={calcPayment} />
										</FormItem>
										<FormItem
											{...formItemLayout}
											label="实收金额："
										>
											<div style={{ display: 'flex' }}>
												<Input
													min={0}
													// precision={(this.props.store.data&&this.props.store.data.total_accuracy) || 2}
													size="large"
													ref={this.inputRef}
													disabled={this.state.second || (this.state.pay_type !== 0 && !this.state.mixingPayment)}
													// formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
													// parser={value => value.replace(/\$\s?|(,*)/g, '')}
													value={this.state.amountReceived}
													onChange={(e) => this.setState({
														amountReceived: this.fat_num(e.target.value)
													})}
													// value={this.state.focusInputName=='amountReceived'?this.state.amountReceived:calcPayment}
													onFocus={() => this.setState({ focusInputName: 'amountReceived', amountReceived: '' })}
													style={{ width: '100%', flex: 1 }}
												/>
												{
													this.state.mixingPayment && (
														<Input
															// type="number"
															size="large"
															style={{ flex: 1 }}
															disabled={!(this.state.second && this.state.pay_type == '0')}
															// disabled={!this.state.second || this.state.pay_type !== 0}
															// formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
															// parser={value => value.replace(/\$\s?|(,*)/g, '')}
															value={this.state.payTwo || ((this.state.amountReceived && calcPayment - this.state.amountReceived) || 0).toFixed(2)}
															onFocus={() => this.setState({ focusInputName: 'payTwo', payTwo: ' ' })}
															onChange={(e) => this.setState({
																payTwo: this.fat_num(e.target.value)
															})}
														/>)
												}
											</div>
										</FormItem>
										{
											(this.state.second || !this.state.mixingPayment) && (
												<FormItem
													{...formItemLayout}
													style={{ marginBottom: 0 }}
													label="找零："
												>
													<h2 style={{ color: 'red', fontSize: 28 }}>{change}</h2>
												</FormItem>
											)
										}
										<div style={{ display: 'flex' }}>
											<FormItem
												style={{ flex: 1 }}
												labelCol={{ span: 16 }}
												label="零钱转入会员余额"
											>
												<Switch checked={this.state.toye} onChange={(value) => {
													if (this.state.netStatusGoPricePay == 0) {
														message.warning("断网模式下不支持")
													} else {
														this.setState({ toye: value })
													}
												}} />
											</FormItem>
											<FormItem
												style={{ flex: 1 }}
												labelCol={{ span: 8 }}
												label="混合支付"
											>
												<Switch checked={this.state.mixingPayment} onChange={(value) => {
													if (this.state.second) {
														notification.open({
															description: '已完成一次支付，为保障数据准确性，请结算完毕，如需退款请结算后在收银单处理',
															style: {
																width: 600,
																marginLeft: 350 - 600,
																color: 'red'
															},
														});
														return false
													} else {
														if (value) {
															if (this.state.netStatusGoPricePay == 0) {
																this.setState({
																	bbbvisible: true
																})
															} else {
																this.setState({
																	aaavisible: true
																})
															}
														} else {
															this.setState({
																mixingPayment: value,
																amountReceived: calcPayment,
															})
														}
													}
												}} />
												<Modal
													title="温馨提示"
													visible={this.state.aaavisible}
													onOk={this.handleOk.bind(this)}
													onCancel={this.handleCancel.bind(this)}
													style={{ 'top': '23%' }}
												>
													<p>启用混合支付后，为保障数据准确性，不能中断交易，请与用户确认完毕再启用，确定启用吗？</p>
												</Modal>
												<Modal
													title="温馨提示"
													visible={this.state.bbbvisible}
													onOk={this.notconnect.bind(this)}
													onCancel={this.notconnect.bind(this)}
													style={{ 'top': '23%' }}
												>
													<p>本地模式下，混合支付不可使用！</p>
												</Modal>
											</FormItem>
										</div>
										<FormItem
											labelCol={{ span: 8 }}
											label="结算后打印小票"
										>
											<Switch checked={this.state.print_xp} onChange={(value) => this.setState({ print_xp: value })} />
										</FormItem>
										{
											this.state.guiderName != '' || localStorage.getItem("_guider") ?
												<span style={{ "color": 'red' }}>导购会员：{(!!this.state.guiderName || this.state.guiderName) || (JSON.parse(localStorage.getItem("_guider")) && JSON.parse(localStorage.getItem("_guider")).guiderName)}</span> :
												null
										}
										{
											this.state.pay_type === 8 ?
												<Modal
													title="购物卡信息"
													visible={this.state.giftCardModel}
													onOk={this.hideModal}
													onCancel={this.hideModal}
													okText="确认"
													cancelText="取消"
													width='700px'
												>
													<Input.Search
														placeholder="请刷购物卡"
														enterButton="获取"
														size="large"
														value={this.state.giftCardValue}
														onSearch={value => this.giftCardSearch(value)}
														onChange={this.giftChange.bind(this)}
													/>
													{
														this.state.giftCardData.length ?
															<Table columns={columns} dataSource={this.state.giftCardData} pagination={false} />
															: ''
													}
												</Modal>

												: ''
										}
										{
											this.state.pay_type === 3 && this.state.show_password ?
												<Modal
													visible={this.state.show_password}
													footer={null}
													onCancel={() => {
														this.setState({
															show_password: false,
														})
													}}
													maskClosable={false}
													width='378px'
												>
													<Tabs
														onChange={this.switch}
														animated={false}
													>
														{
															this.props.store.data.is_payment == 1 ? <TabPane tab="扫码验证" key="1">
																<Spin
																	size='large'
																	spinning={this.state.spinBarcode}
																>
																	<i
																		className="iconfont icon-erweima"
																		style={{
																			fontSize: '170px',
																			height: '170px',
																			display: 'flex',
																			justifyContent: 'center',
																			alignItems: 'center',
																			margin: '49px 0',
																		}}
																	/>
																	<p
																		style={{
																			textAlign: "center",
																			fontSize: "18px",
																			fontWeight: "bold",
																			marginBottom: "-32px",
																		}}
																	>扫描顾客付款码</p>
																	<Input.Search
																		style={{
																			opacity: 0,
																		}}
																		size="large"
																		ref={this.refBarcode}
																		value={this.state.memBarcode}
																		onChange={this.changeBarcode}
																		onSearch={this.requestBarcode}
																		onBlur={() => {
																			this.refBarcode.current.focus()
																		}}
																	/>
																</Spin>
															</TabPane> : null
														}
														{
															this.props.store.data.membersaddpasswords == 1 ? <TabPane tab="密码验证" key="2">
																<Input.Search
																	type="password"
																	placeholder="请输入密码"
																	enterButton="确认"
																	size="large"
																	ref={this.refPassword}
																	value={this.state.mem_password}
																	onChange={this.change_password}
																	onSearch={this.request_password}
																/>
																<NumericKeypad Num={true} onClick={this.pwd_keyboard} />
															</TabPane> : null
														}
													</Tabs>
												</Modal>
												: null
										}

									</Col>

									{
										this.state.NumericKeypadOrPrCode ?
											<QRCode value="http://facebook.github.io/react/" size={300} />
											:
											<NumericKeypad Num onClick={(value) => this.calcPaymentInput(value)} bordWidth />
									}
								</Row>
							</Spin>
						</div>
						<div
							className='cashier_right'
						>
							<div
								className='back'
								onClick={this.on_cashier_back}
							>
								<Icon
									style={{ fontSize: '20px', color: 'rgb(215,215,215)' }}
									type="left"
								/>
							</div>
							<div
								className='content'
							>
								<p className='p'><span style={{
									color: cashier_color,
									padding: '0 3px',
									fontSize: '24px',
								}}>{cashier_text}</span></p>
								<img className='img' src={cashier_img} alt="" />
								<div
									onClick={this.completion_payment}
									className='zfwc'
								>支付完成</div>
							</div>
						</div>
					</div>
				</Modal>
				<Modal
					width={378}
					title="减免/折扣"
					visible={this.state.discountVisible}
					onCancel={() => this.setState({ is_first: true, discountVisible: false, isuseCoupon: false, discount_fee:0,
						discount_num:100 })}
					footer={null}
					maskClosable={false}
					style={{ 'top': '-5px' }}
				>
					<div className="totalmoney_derating_box">
						<span>总金额：</span>
						<span
							className="totalmoney_derating"
						>￥{this.state.totalPrice}</span>
					</div>
					{
						this.props.store.data && this.props.store.data.show_order_deduct == 2
							? <Fragment>
								<div>
									<span>优惠方式</span>
								</div>
								<br />
								<div style={{ textAlign: 'center' }}>
									<RadioGroup
										onChange={(e) => {
											'amount' === e.target.value ? this.setState({
												focusInputName: 'discount_fee',
											}) : this.setState({
												focusInputName: 'discount_num',
											})
											this.setState({ discountsType: e.target.value })
										}
										}
										defaultValue="amount"
										size="large">
										<RadioButton value="amount" style={{ width: 165 }}>总价减免</RadioButton>
										<RadioButton value="rate" style={{ width: 165 }}>整单折扣</RadioButton>
									</RadioGroup>
								</div>
							</Fragment>
							: null
					}
					<br />
					<div>
						<span>{this.state.discountsType === 'amount' ? '减免金额' : '折扣率'}：</span>
						<span style={{ fontSize: '9px' }}>（包含优惠券优惠的金额）</span>
					</div>
					<div style={{ display: 'flex', alignItem: 'center' }}>
						{
							this.state.discountsType === 'amount' ?
								<Input
									min={0}
									disabled={!(this.props.store.data && this.props.store.data.show_order_deduct == 2)}
									precision={2}
									size="large"
									ref={this.inputRefMoney}
									addonBefore="￥"
									value={this.state.discount_fee}
									onChange={(e) => this.setState({ discount_fee: this.fat_num(e.target.value) })}
									onFocus={() => this.setState({ focusInputName: 'discount_fee', discount_fee: '' })}
									style={{ 'width': '50%' }}
								/>
								:
								<Input
									min={0}
									precision={2}
									size="large"
									ref={this.inputRefDis}
									addonAfter="%"
									value={this.state.discount_num || 0}
									onChange={(e) => this.setState({ discount_num: this.fat_num(e.target.value) })}
									onFocus={() => this.setState({ focusInputName: 'discount_num', discount_num: '' })}
									style={{ 'width': '50%' }}
								/>
						}
						{
							fullsub.data && fullsub.data.remark ? (
								<Select defaultValue="优惠备注" size="large"
									onChange={index => this.setState({ remark: fullsub.data.remark[index] })} style={{ width: '50%' }}>
									{
										fullsub.data.remark.map((item, index) => <Option value={index} key={item.id}>{item.remark}</Option>)
									}
								</Select>
							) : <div style={{
								display: 'inline-block',
								width: '50%',
								height: 38,
								borderWidth: 1,
								borderStyle: 'dashed',
								borderRadius: 6,
								borderColor: '#ccc'
							}}>
									<h5 style={{ height: 38, lineHeight: '38px', textAlign: 'center' }}>暂无备注选项</h5>
								</div>
						}
					</div>
					<div className="totalmoney_derating_box">
						<span>应收金额：</span>
						<span
							className="totalmoney_derating"
						>￥{calcPayment}</span>
					</div>
					{
						this.state.discountsType === 'amount' && (this.props.store.data && (this.props.store.data.discard_small_change == 1 ? true : false)) ? (
							<div className="do_not_count_the_small_change_box">
								<div className="do_not_count_the_small_change" onClick={() => this.smallchange(1)}>抹零1角</div>
								<div className="do_not_count_the_small_change" onClick={() => this.smallchange(2)}>抹零2角</div>
								<div className="do_not_count_the_small_change" onClick={() => this.smallchange(3)}>抹零3角</div>
								<div className="do_not_count_the_small_change" onClick={() => this.smallchange(4)}>抹零4角</div>
								<div className="do_not_count_the_small_change" onClick={() => this.smallchange(0)}>一键抹零</div>
							</div>
						) : null
					}
					{
						this.props.store.data && this.props.store.data.show_coupon_deduct == 2
							? <Fragment>
								<div
									style={{
										margin: '20px 0'
									}}
								>
									<Switch
										checked={this.state.yhsw1128}
										onChange={(e) => {
											this.setState({
												yhsw1128: e,
											})
										}}
									/>优惠券
					</div>
								<Input.Search
									style={{
										marginBottom: '20px',
										display: this.state.yhsw1128 ? 'block' : 'none',
									}}
									placeholder="输入优惠券码"
									onFocus={() => this.setState({ focusInputName: 'va1125' })}
									enterButton="确定"
									onSearch={this.onPressEnter1125}
									value={this.state.va1125}
									onChange={this.onChange1125}
								/>
							</Fragment>
							: null
					}
					{
						this.props.store.data && this.props.store.data.show_prepay_deduct == 2
							? <Fragment>
								<div
									style={{
										margin: '20px 0'
									}}
								>
									<Switch
										checked={this.state.djsw1128}
										onChange={(e) => {
											this.setState({
												djsw1128: e,
											})
										}}
									/>订金减免
					</div>
								<Input.Search
									style={{
										marginBottom: '20px',
										display: this.state.djsw1128 ? 'block' : 'none',
									}}
									placeholder="输入订金减免码"
									onFocus={() => this.setState({ focusInputName: 'vdj1128' })}
									enterButton="确定"
									onSearch={this.sdj1128}
									value={this.state.vdj1128}
									onChange={(e) => {
										this.setState({
											vdj1128: e.target.value,
										})
									}}
								/>
							</Fragment>
							: null
					}
					{/* <div style={{ dispaly: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
						<Switch
							checked={this.state.isuseCoupon}
							onChange={(value) => this.setState({
								isuseCoupon: value
							}, () => {
								if (this.state.isuseCoupon) {

								} else {
									let a = this.state.coupon_fee;
									this.setState({
										couponId: '',
										coupon_fee: 0,
										totaldiscount_fee: 0,
										hascoupon: false,
										couponTemid: ''
									})
								}
							})}
						/>
						<span style={{ marginLeft: '10px' }}>是否使用电子优惠券</span>
					</div> */}
					{/* <div>
						{
							this.state.isuseCoupon ?
								<div>
									<Search
										style={{ 'width': '100%', 'marginBottom': '20px' }}
										value={this.state.couponId}
										placeholder="输入优惠券号"
										enterButton="确定"
										onChange={(e) => this.setState({ couponId: e.target.value })}
										onFocus={() => this.setState({ focusInputName: 'couponId' })}
										onSearch={this.getCoupon.bind(this)}
									/>
								</div>
								:
								''
						}
					</div> */}
					{
						this.state.hascoupon ?
							<div>
								<span style={{
									'margin_bottom': '10px',
									'color': 'red',
									'fontSize': '25px'
								}}>优惠金额{this.state.coupon_fee} </span>
							</div>
							:
							''
					}
					{/* <div style={{ dispaly: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
						<Switch checked={this.state.isuseGuider} onChange={(value) => this.setState({ isuseGuider: value }, () => {
							if (this.state.isuseGuider) {

							} else {
								this.setState({
									guiderId: '',
									isuseGuider: false,
									guiderName: '',
									guiderTel: '',
									hasGuilder: false,
									guiderCode: ''
								})
							}
						})} />
						<span style={{ marginLeft: '10px' }}>是否开启导购会员</span>
						{
							this.state.isuseGuider ?
								<Button type="primary" style={{ 'marginLeft': '60px' }}
									onClick={this.selectGuider.bind(this)}>选择导购员</Button> :
								''
						}
					</div> */}
					{
						this.state.selectGuiderModal ?
							<Modal
								width={804}
								title="选择导购员"
								visible={this.state.selectGuiderModal}
								footer={false}
								cancelText=''
								onCancel={() => {
									this.state.discountsType === 'amount' ? this.setState({

									}) : setTimeout(() => {
										this.inputRefDis.current.focus()
									}, 0)
									this.setState({
										selectGuiderModal: false
									})
								}
								}
							>
								<Spin spinning={this.state.loading}>
									<div>
										{/* <Table
																						rowKey="id"
																						size="small"
																						columns={this.state.guiderColumns}
																						pagination={{pageSize: 6}}
																						dataSource={this.state.guiderList}
																				/> */}
										{content}
									</div>
									<Row type="flex" justify="space-between" style={{ paddingTop: 20 }}>
										<Col style={{ marginTop: 40, flex: 1 }}>
											<FormItem
												{...formItemLayout}
												label="姓名字母"
											>
												<Input
													size={'large'}
													value={this.state.guidername}
													onFocus={() => this.setState({ focusInputName: 'guidername' })}
												// style={{width: '100%'}}

												/>
											</FormItem>
											<FormItem
												{...formItemLayout}
												label="手机号"
											>
												<Input
													size={'large'}
													value={this.state.guiderPhone}
													onFocus={() => this.setState({ focusInputName: 'guiderPhone' })}
												// style={{width: '100%'}}
												/>
											</FormItem>
											{/*<Button onClick={() => this.requestOrder(this.state.orderno)} size={'large'}>搜索</Button>*/}
										</Col>
										<NumericKeypad style={{ flex: 1 }} onClick={this.searchGuiderList.bind(this)} />
									</Row>
								</Spin>
							</Modal> : ''
					}

					<div>
						{
							this.state.isuseGuider ?
								<div>
									<Search
										style={{ 'width': '100%', 'marginBottom': '20px' }}
										value={this.state.guiderCode}
										placeholder="输入导购会员码"
										enterButton="确定"
										onChange={(e) => this.setState({ guiderCode: e.target.value })}
										onFocus={() => this.setState({ focusInputName: 'guiderCode' })}
										onSearch={this.getGuider.bind(this)}
									/>
								</div>
								:
								''
						}
					</div>
					<div>

					</div>
					{
						this.state.hasGuilder ?
							<div style={{ 'marginBottom': '20px' }}>
								<div style={{ 'display': 'flex', 'align-items': 'center' }}>
									<span>导购会员名: </span><Input style={{ 'flex': '1', 'marginLeft': '10px' }} value={this.state.guiderName}
										disabled />
								</div>
								<div style={{ 'display': 'flex', 'align-items': 'center', 'marginTop': '10px' }}>
									<span>导购手机号: </span><Input style={{ 'flex': '1', 'marginLeft': '10px' }} value={this.state.guiderTel}
										disabled />
								</div>
							</div>
							:
							''
					}
					<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<NumericKeypad Num onClick={(value) => this.calcDiscount(value)} />
					</div>
				</Modal>

				{/*
										if(item.pay_type == 5 || item.pay_type == 6){
																														this.setState({
																																qrcode_visible: true,
																														})
																												}
								<Modal
					title="二维码"
					visible={this.state.qrcode_visible}
					width={378}
					footer={null}
					onCancel={() => this.setState({qrcode_visible: false})}
				>
										<div style={{textAlign: 'center'}}>
												<img  src={tsIcon} alt="img" style={{width: 200,marginBottom: 20}} />
												<h3>请扫描二维码支付</h3>
										</div>
				</Modal> */}
			</div>
		)
	}
}

export default withRouter(connect(mapStateToProps)(FooterCustom))