import React, { Component, Fragment, createRef } from 'react'
import { connect } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import { Modal, Card, Pagination, Input, notification, Icon, Button } from 'antd'
import { withRouter } from 'react-router-dom'

import { WithModal } from '@/widget'
import NumericKeypad, { onVirtualKeyboard, fat_num } from '@/widget/NumericKeypad'
import {
	getGoods,
	addToOrderList,
	updateFromOrderList,
	changePage,
	addToFundTransferList,
	addToPriceAdjustmentList,
	addToPurchaseList,
	addToReportDamageList,
	changeSetting,
	ranking,
	debugCacheDisorderOrderlist,
	getsearchGoods
} from '@/action'
import { getWeight, labelPrint, getCategoryGoods, setSequence, syncCategoryGoods } from '@/api'
import GoodsCell from './GoodsCell'
import './index.less'
import styles from './tea.module.less'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')
const mapStateToProps = (state, ownProps) => ({
	goods: state.goods,
	order: state.order,
	member: state.member,
	store: state.store,
	sale: state.sale,
	setting: state.setting,
	goodweight: state.goodweight,
	leaflet: state.leaflet,
})

/**
 * 商品列表
 *
 * @class CenterCustom
 * @extends {Component}
 */
class CenterCustom extends Component {
	constructor(props) {
		super(props);
		this.state = {
			promotionInfo: undefined,
			showPromotion: false,
			rank_aim: null,
			rank_value: 0,
			rank_onOff: false,
			drag_opacity: 0,
			drag_width: 0,
			drag_heigth: 0,
			active_index: -1,
			Booltea: false,
			arrTea: [],
			selectOne: -1,
			goodsList: [],
			visible: false,
			selectItem: {},
			page: 1,
			prevWeight: 0,// 记录上次称重重量
			newposprice: 0,// 调价单新售价
			num: 0,// 报损单报损数量
			isNum: true,
			realweight: 0,
			keylistener: undefined,
			agms: null,
			on_off: false,
			Num_value: 0,
			drag_i: -1,
			drag_sty: {},
			x: 0,
			y: 0,
		};
		this.controlClick = true
		this.touch_div = createRef()  //拖拽div
		this.dragele = null  //实例
		this.h_change = null  //高的一半
		this.w_change = null  //宽的一半
		this.drag_arr = null  //实例的transform的translate数组
		this.drag_centre = null  //实例中心
		this.drag_h = null  //实例高
		this.drag_w = null  //实例宽
		this.Obj_arr = null //  置换对象的transform的translate数组
		this.Obj_centre = null //  置换对象中心
		this.Obj_ele = null //  置换对象实例
		this.throttle = false  //  节流
		this.touch_X = null  //触摸点x
		this.touch_Y = null  //触摸点y
		this.touch_UI = null  //UI实例
		this.touch_start = false  //从点击开始
		this.rank_SW = false  //节流
		this.iterator = {}
	}

	/**
	 * [计算添加商品后是否符合促销规则]
	 * @param item Obj 商品详细信息
	 */
	onMeetPromotional = (item) => {
		var date = new Date();
		let { leaflet, order: { dataList: [list = []] } } = this.props
		// 过滤出契合商品的促销规则
		leaflet = leaflet.length === 0
			? leaflet
			: leaflet.filter(i => {
				return i.promotion_goodsid == item.goodsid
			})

		if (
			leaflet.length === 0
			|| ("gkg斤克千克吨公斤".includes(item.changeunitname)
				&& JSON.parse(window.localStorage.getItem('__setting')).is_tabulate)
		) return item

		let itemList = list.filter(i => item.goodsid == i.goodsid)
		let replaceItem = {}
		for (const key of Object.keys(item)) {
			if (
				key == "showPromotionImg"
				|| key == "isRestriction"
				|| key == "isPromotion"
			) continue
			replaceItem[key] = ''
		}

		for (const [key, value] of leaflet.entries()) {
			let {
				promotionsales_type,
				promotion_num,
				promotion_price,
				additional_price,
				additional_num,
				once_or_each,
			} = value
			if (promotionsales_type == 11) {
				let {
					barcode,
					goodsid,
					name,
					changeunitname,
					num,
				} = item
				item = {
					...replaceItem,
					barcode,
					goodsid,
					name,
					changeunitname,
					num,
					posprice: promotion_price,
					subtotal: promotion_price * num,
					discount_fee: 0,
					showPromotionImg: 1,
				}
				if (promotion_num > item.num) break
				if (
					itemList.some(i => i.isPromotion)
					&& once_or_each == 1
				) break
				if (
					itemList.find(i => i.isPromotion)
					&& itemList.find(i => i.isPromotion).num == Math.floor(num / promotion_num) * additional_num
					&& once_or_each == 2
				) break

				this.setState({
					showPromotion: true,
					promotionInfo: { ...value, num: num, replaceItem },
				})
				break
			} else if (promotionsales_type == 12) {
				let sum = itemList
					.reduce((a, b) => +a + (b.isPromotion ? +b.num : 0), 0) + +item.num
				item = {
					...replaceItem,
					isRestriction: true,
					barcode: item.barcode,
					goodsid: item.goodsid,
					name: item.name,
					changeunitname: item.changeunitname,
					num: item.num >= promotion_num ? promotion_num : item.num,
					posprice: additional_price,
					subtotal: (item.num >= promotion_num ? promotion_num : item.num) * additional_price,
					discount_fee: 0,
					showPromotionImg: 1,
				}
				let obj = {
					...replaceItem,
					isRestriction: true,
					barcode: item.barcode,
					goodsid: item.goodsid,
					name: item.name,
					changeunitname: item.changeunitname,
					num: sum - promotion_num,
					posprice: promotion_price,
					subtotal: (sum - promotion_num) * promotion_price,
					discount_fee: 0,
					isPromotion: 1,
					showPromotionImg: 1,
				}
				if ((itemList.length == 1 || itemList.length == 0) && sum - promotion_num > 0) {
					this.props.addToOrderList(obj, 0)
				} else if (itemList.length == 2 && sum - promotion_num > 0) {
					this.props.updateFromOrderList(obj, 0, list.findIndex(i => i.isPromotion && i.barcode == item.barcode))
				}
				break
			}
		}
		return item
	}

	/**
	 * [添加促销商品]
	 */
	onAddPromotion = () => {
		var date = new Date();
		let {
			additional_gname,
			additional_unitname,
			additional_num,
			additional_price,
			additional_barcode,
			promotion_goodsid,
			once_or_each,
			num,
			replaceItem,
			promotion_num,
		} = this.state.promotionInfo
		let { dataList: [list] } = this.props.order
		let item = {
			...replaceItem,
			barcode: additional_barcode,
			goodsid: promotion_goodsid,
			name: additional_gname,
			changeunitname: additional_unitname,
			num: once_or_each == 1 ? +additional_num : Math.floor(num / promotion_num) * additional_num,
			posprice: (additional_price / additional_num).toFixed(2),
			subtotal: once_or_each == 1 ? +additional_price : Math.floor(num / promotion_num) * additional_price,
			discount_fee: 0,
			isPromotion: 1,
			showPromotionImg: 1,
		}
		if (list.some(i => i.goodsid == promotion_goodsid && i.isPromotion)) {
			this.props.updateFromOrderList(item, 0)
		} else {
			this.props.addToOrderList(item, 0)
		}
		this.setState({
			showPromotion: false,
		})
	}

	rank_click = (v) => {
		let q = onVirtualKeyboard(v, this.state.rank_value, () => {
			if (this.rank_SW) { return }
			this.rank_SW = true
			let [
				{ rank_value, rank_aim },
				{ data: { msg, category } },
			] = [
					this.state,
					this.props.goods,
				]
			if (isNaN(+rank_value) || rank_value == rank_aim) {
				this.setState({
					rank_onOff: false,
					rank_value: 0,
				}, () => {
					this.rank_SW = false
				})
			} else {
				//  更新本地商品缓存
				rank_value = rank_value >= msg.length
					? msg.length - 1
					: (rank_value <= 0
						? 0
						: Math.ceil(rank_value))
				// msg = msg.map((item, i, arr) => {
				// 	return i == rank_value
				// 		? arr[rank_aim]
				// 		: (i == rank_aim
				// 			? arr[rank_value]
				// 			: item)
				// })
				msg.splice(rank_value, 0, ...msg.splice(rank_aim, 1))
				this.props.ranking(msg)
				//  更新sql商品
				getCategoryGoods({ category_id: category })
					.then(({ data: { data: list } }) => {
						// list = list
						// 	.map((item, i, arr) => {
						// 		return i == rank_value
						// 			? arr[rank_aim]
						// 			: (i == rank_aim
						// 				? arr[rank_value]
						// 				: item)
						// 	})
						// 	.map((item, i) => ({
						// 		sequence: i,
						// 		goods_id: item.id
						// 	}))
						list.splice(rank_value, 0, ...list.splice(rank_aim, 1))
						list = list
							.map((item, i) => ({
								sequence: i,
								goods_id: item.id
							}))
						setSequence({
							category_id: category,
							list
						})
							.then(res => {
								this.setState({
									rank_onOff: false,
									rank_value: 0,
								})
								this.rank_SW = false
							})
					})
			}
		})
		this.setState({
			rank_value: q
		})
	}

	Num_click = (v) => {
		let q = onVirtualKeyboard(v, this.state.Num_value, () => {
			this.setState({
				on_off: false
			}, () => {
				this.state.agms.barcode.length == 1 ? this.onSelectedFormat(this.state.agms.barcode[0], null, true, false) : this.onSelectedFormat(null, null, false, false)
			})
		})

		this.setState({
			Num_value: q
		})
	}

	componentWillReceiveProps(nextProps) {
		var date = new Date();

		/**
		 * [重置选中动画]
		 * 时长控制抖动幅度
		 */
		setTimeout(() => {
			this.setState({ selectOne: -1 })
		}, 0)
	}

	shouldComponentUpdate(nextProps) {

		// console.log(this.props.goods.data)
		// if(this.props.goods.data&&this.props.goods.data.search.length>8&&this.props.goods.data.msg.length==1){
		//
		// }
	
		const is_search = (data) => {

			if (data.search && (data.search !== nextProps.goods.data.search) && this.state.isNum) {
				// this.addAutomatically(nextProps.goods.data)
				this.setState({
					page: 1
				})
				return false
			} else {
				//重置分页当前页
				if (this.props.location.pathname !== nextProps.location.pathname && this.state.page !== 1) {
					this.setState({
						page: 1
					})
				}
				return true
			}
		}
		if (this.props.goods.data) {
			return is_search(this.props.goods.data)
		} else {
			if (nextProps.goods.data && nextProps.goods.data.search !== '') {
				// this.addAutomatically(nextProps.goods.data)
			}
			return true
		}
	}

	componentDidMount = () => {
		var date = new Date();
		//  扫码枪
		var [code, lastTime, nextTime, lastCode, nextCode, setTimer] = ['', null, null, null, null, null]

		var a = (e) => {
			nextCode = e.key;
			nextTime = e.timeStamp;
			if (lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
				code += lastCode
			} else if (lastCode != null && lastTime != null && nextTime - lastTime > 100) {
				code = "";
			}
			lastCode = nextCode;
			lastTime = nextTime;
			//扫商品码直接加入搜索框
			if ((e.which == 13 && (code.length == 8 || code.length == 13)) || (nextCode.length == 8 || nextCode.length == 13)) {
				if (setTimer) {
					clearTimeout(setTimer)
				}
				setTimer = setTimeout(async () => {
					code = code || e.key
					if (
						code.search(/^1\d{6}[012]\d{5}$/) === 0
					) {
						var [search, weigh] = [code.slice(1, 7), code.slice(7, 12)]
						let { msg } = await this.props.getGoods({
							search,
							type: this.props.setting.searchtype,
							rows: this.props.setting.rowsnum
						}).catch()
						if (msg.length > 0) {
							let selectItem = msg[0]
							let item = selectItem.barcode[0]
							switch (selectItem.changeunitname) {
								case "g":
								case "克":
									weigh = +weigh
									break;
								case "kg":
								case "千克":
								case "公斤":
									weigh = +weigh / 1000
									break;
								case "斤":
									weigh = +weigh / 500
									break;
								default:
									weigh = +weigh
									break;
							}
							let specname = []
							for (let [key, value] of Object.entries(item)) {
								if (key.includes("specitemname")) {
									value ? specname.push(key) : null
								}
							}
							let obj = {
								goodsid: item.goodsid,
								name: selectItem.name,// `name`
								uniacid: this.props.store.data.uniacid,// `uniacid` int(11) NOT NULL,
								salerid: this.props.sale.data.id,// `salerid` varchar(200) NOT NULL,
								num: weigh,// `num` int(11) NOT NULL,
								goods_categoryid: selectItem.categoryid,// NOT NULL COMMENT '分类',
								posprice: item.posprice,// `posprice` varchar(100) NOT NULL,
								discount_num: 0,// `discount_num` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '折扣',
								discount_fee: 0,// `discount_fee` decimal(10,2) NOT NULL COMMENT '优惠金额',
								is_score: selectItem.is_score,// `is_score` tinyint(3) NOT NULL DEFAULT '0' COMMENT '该订单是否有积分 0没有 1有',
								score: selectItem.score,// `score` int(11) NOT NULL DEFAULT '0' COMMENT '积分',
								barcode: item.barcode,// `barcode` varchar(50) NOT NULL COMMENT '商品条码',
								specname: specname.join('+'),// `specname` 规格
								unit: selectItem.unit,// `unit` int(11) NOT NULL COMMENT '单位id',
								returntype: 0,// `returntype` int(11) NOT NULL DEFAULT '0' COMMENT '退货 0无1是',
								refund_price: 0,// `refund_price` decimal(10,2) NOT NULL,
								changeunitname: selectItem.changeunitname,// `changeunitname` '售出单位'
								is_membership: selectItem.is_membership,//`is_membership` tinyint(3) NOT NULL DEFAULT '1' COMMENT '是否开启会员权益1否，2是',
								is_memberprice: selectItem.is_memberprice,//`is_menberprice` tinyint(3) NOT NULL DEFAULT '1' COMMENT '会员价 1不启用 2启用',
								memberprice: item.memberprice,//`memberprice` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '会员价',
								specialPrice: (selectItem.promotion === 10 || selectItem.promotion_member === 2) ? null : selectItem.promotion * item.posprice / 10,//优惠价 只限于会员价或会员折扣与会员日
								promotion: selectItem.promotion, //会员日/促销日折扣
								is_freegift: selectItem.is_freegift,//是否為贈品
								allow_balance_pay: selectItem.allow_balance_pay,
							}
							//会员享受会员价或会员折扣
							const { member } = this.props
							let { orderIndex } = this.props.order
							if (member.data) {
								const memeberPriceFunc = () => {
									return selectItem.is_memberprice === 2 ?
										// item.memberprice
										(obj.specialPrice === null ? item.memberprice : (obj.specialPrice > item.memberprice ? item.memberprice : obj.specialPrice))
										: (selectItem.is_membership === 2 ? item.posprice * member.data.rights / 10 : null)
								}
								/**
								 * [优先使用会员日折扣，其次才是会员价，然后是会员折扣，最后是正常商品单价，但是以上所有优先级不如手动修改商品价格]
								 */
								obj.specialPrice = member.data.is_promotion !== 1 && item.promotion_member === 2 ?
									selectItem.promotion * item.posprice / 10 : memeberPriceFunc()
								obj.specialPrice = obj.specialPrice === null ? null : Number(obj.specialPrice).toFixed(2)
							} else {
								if (selectItem.promotion_member === 2) obj.promotion = null
							}
							orderIndex = orderIndex > -1 ? orderIndex : 0
							obj = this.onMeetPromotional(obj)
							this.props.addToOrderList(obj, orderIndex)
						}
						code = "";
						return false
					}
					this.props.getGoods({
						search: code,
						type: this.props.setting.searchtype,
						rows: this.props.setting.rowsnum
					}).then(res => {
						// this.setState({searchValue: ''})
						code = "";
						this.addAutomatically(res)
					})
					// setTimeout(()=>{
					// this.props.getGoods({search: ''}).then(res=>{})
					// },2000)
				}, 100)
			}
		}

		this.setState({
			keylistener: a
		}, () => {
			window.addEventListener('keypress', this.state.keylistener)
		})
	}

	componentWillUnmount = () => {
		// window.removeEventListener('keypress',this.state.keylistener)
	}

	//奶茶店
	useTea = (index) => {
		let { arrTea } = this.state
		if (arrTea.some(item => item === index)) {
			this.setState({
				arrTea: arrTea.filter(item => item !== index)
			})
		} else {
			this.setState({
				arrTea: arrTea.concat([index])
			})
		}
	}

	handPlot = () => {
		this.setState(state => ({
			Booltea: !state.Booltea
		}))
	}

	/**
	 * [addAutomatically 自动添加到订单]
	 * 查询商品 若是 单商品 且 单规格 自动添加到订单
	 * @param {[type]} obj [后台返回值 包括商品数组msg 与 搜索条件 search]
	 */
	addAutomatically(obj) {
		console.log(obj)
		if (obj.msg.length === 1 && obj.msg[0].barcode.length === 1) {
			this.onSelected(obj.msg[0], 0)
			this.props.changeSetting({ search: '' })
		} else {
			this.props.changeSetting({ search: '' })
		}
	}

	onSelected(item, index) {
		this.setState({
			selectItem: item,
			selectOne: index,
			Booltea: JSON.parse(window.localStorage.getItem('__setting')).teashop
		}, () => {
			item.barcode.length === 1 ? this.onSelectedFormat(item.barcode[0]) : (item.barcode.length !== 0 ? this.setState({ visible: true }) : notification.error({
				message: '提示',
				description: '该商品没有对应条码',
			}))
		})
	}

	onSelectedFormat(item, index, Bool = true, SW_num = true, ) {
		const { member, history } = this.props
		let { selectItem, prevWeight, selectItem: { tealist }, active_index } = this.state
		let { orderIndex } = this.props.order
		let specname = []

		if ((selectItem.barcode.length > 1) && Bool) {
			this.setState({
				active_index: index
			})
			return
		}
		if (!Bool) {
			if (active_index === -1) {
				notification.open({
					message: '提示',
					description:
						'请选择规格',
					onClick: () => {
					},
				})
				return
			}
			item = selectItem.barcode[active_index]
		}

		// 添加商品前选择数量
		let hasnum = JSON.parse(localStorage.getItem('__setting')).hasnum
		if (hasnum && SW_num) {
			'gkg斤克千克吨公斤'.indexOf(selectItem.changeunitname) == -1 ? this.setState({
				agms: selectItem,
				on_off: true,
				Num_value: 0,
			}) : this.onSelectedFormat(item, null, true, false)
			return
		}

		//奶茶店
		let { arrTea, Booltea } = this.state
		if (Booltea && history.location.pathname.split('/').reverse()[1] != 'priceadjustment') {

			let date = new Date()

			let datetime = ` 日期：${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

			let title = ''
			let lght = (14 - selectItem.name.length * 2) / 4
			for (let i = 0; i < lght; i++) {
				title += '\xa0'
			}
			title += selectItem.name

			let specifications = item.specitemname1 ? ` ${item.specitemname1}` : ''

			let seat = ''
			arrTea.map(item => {
				seat += ` ${Object.values(tealist[+item])[0]}`
				return item
			})


			labelPrint({
				title,
				specifications,
				seat,
				datetime
			}).then(res => {
			})

		}
		this.setState({
			arrTea: [],
			active_index: -1
		})
		//奶茶店

		const ARR = [1, 2, 3]
		ARR.forEach(num => {
			if (
				!(
					!item['specitemname' + num]
					&& typeof item['specitemname' + num] === 'object'
				)
				&& item['specitemname' + num] !== ''
			) {
				specname.push(item['specitemname' + num])
			}
		})
		if (history.location.pathname.split('/')[1] === 'priceadjustment') {
			this.iterator = this.onAddToPriceAdjustList({ item, selectItem, specname })
			this.iterator.next()
			return
		}
		let obj = {
			goodsid: item.goodsid,
			name: selectItem.name,// `name`
			uniacid: this.props.store.data.uniacid,// `uniacid` int(11) NOT NULL,
			salerid: this.props.sale.data.id,// `salerid` varchar(200) NOT NULL,
			num: 1,// `num` int(11) NOT NULL,
			goods_categoryid: selectItem.categoryid,// NOT NULL COMMENT '分类',
			posprice: item.posprice,// `posprice` varchar(100) NOT NULL,
			discount_num: 0,// `discount_num` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '折扣',
			discount_fee: 0,// `discount_fee` decimal(10,2) NOT NULL COMMENT '优惠金额',
			is_score: selectItem.is_score,// `is_score` tinyint(3) NOT NULL DEFAULT '0' COMMENT '该订单是否有积分 0没有 1有',
			score: selectItem.score,// `score` int(11) NOT NULL DEFAULT '0' COMMENT '积分',
			barcode: item.barcode,// `barcode` varchar(50) NOT NULL COMMENT '商品条码',
			specname: specname.join('+'),// `specname` 规格
			unit: selectItem.unit,// `unit` int(11) NOT NULL COMMENT '单位id',
			returntype: 0,// `returntype` int(11) NOT NULL DEFAULT '0' COMMENT '退货 0无1是',
			refund_price: 0,// `refund_price` decimal(10,2) NOT NULL,
			changeunitname: selectItem.changeunitname,// `changeunitname` '售出单位'
			is_membership: selectItem.is_membership,//`is_membership` tinyint(3) NOT NULL DEFAULT '1' COMMENT '是否开启会员权益1否，2是',
			is_memberprice: selectItem.is_memberprice,//`is_menberprice` tinyint(3) NOT NULL DEFAULT '1' COMMENT '会员价 1不启用 2启用',
			memberprice: item.memberprice,//`memberprice` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '会员价',
			specialPrice: (selectItem.promotion === 10 || selectItem.promotion_member === 2) ? null : selectItem.promotion * item.posprice / 10,//优惠价 只限于会员价或会员折扣与会员日
			promotion: selectItem.promotion, //会员日/促销日折扣
			is_freegift: selectItem.is_freegift,//是否為贈品
			allow_balance_pay: selectItem.allow_balance_pay,
		}
		if ('gkg斤克千克吨公斤'.indexOf(selectItem.changeunitname) == -1) {

			const is_weight_goods = 'gkg斤克千克吨公斤'.indexOf(selectItem.changeunitname)
			//( this.state.Num_value ? this.state.Num_value : obj.num )
			obj.num = this.state.Num_value ? +this.state.Num_value : obj.num
			//会员享受会员价或会员折扣
			if (member.data) {
				const memeberPriceFunc = () => {
					return selectItem.is_memberprice === 2 ?
						// item.memberprice
						(obj.specialPrice === null ? item.memberprice : (obj.specialPrice > item.memberprice ? item.memberprice : obj.specialPrice))
						: (selectItem.is_membership === 2 ? item.posprice * member.data.rights / 10 : null)
				}
				/**
				 * [优先使用会员日折扣，其次才是会员价，然后是会员折扣，最后是正常商品单价，但是以上所有优先级不如手动修改商品价格]
				 */
				obj.specialPrice = member.data.is_promotion !== 1 && item.promotion_member === 2 ?
					selectItem.promotion * item.posprice / 10 : memeberPriceFunc()
				obj.specialPrice = obj.specialPrice === null ? null : Number(obj.specialPrice).toFixed(2)
			} else {
				if (selectItem.promotion_member === 2) obj.promotion = null
			}

			let old_storag = localStorage.getItem('__order')
			this.setState({
				visible: false,
				Num_value: 0,
			}, () => {
				orderIndex = orderIndex > -1 ? orderIndex : 0
				let target = this.props.order.dataList[orderIndex]
					? this.props.order.dataList[orderIndex]
						.find(a => a.barcode === item.barcode && !a.isPromotion)
					: this.props.order.dataList[orderIndex]
				
				let is_pieces = localStorage.getItem('is_pieces') ? localStorage.getItem('is_pieces') : '2'
				//is_pieces 1:计件不叠加  2:计件叠加
				if(is_pieces=='2'){
					if (target && !is_weight_goods !== -1) {
						// console.log('1'+is_pieces) //订单中已有商品，去重添加，改变数量/重量
						target = Object.assign({}, target)
						console.log('12111223')
						// if (
						// 	target.changeunitname == '公斤'
						// 	|| target.changeunitname == 'kg'
						// 	|| target.changeunitname == '千克'
						// ) {
						// 	target.num += Number(obj.num)
						// } else {
						// 	target.num += Number(obj.num)
						// }
						target.num = +target.num + (+obj.num)
						target = this.onMeetPromotional(target)
						this.props.updateFromOrderList(target, orderIndex)
						if (this.time_storag) {
							clearTimeout(this.time_storag)
						}
						this.time_storag = setTimeout(() => {
							if (localStorage.getItem('__order') == old_storag) {
								let info = {
									"添加的商品信息": {
										item: target,
										"dataList的index": orderIndex
									}
								}
								this.props.debugCacheDisorderOrderlist({ info })
							}
						}, 1000)
					} else if (!target) {
						console.log('2'+ is_pieces)
						obj = this.onMeetPromotional(obj)
						this.props.addToOrderList(obj, orderIndex)
						if (this.time_storag) {
							clearTimeout(this.time_storag)
						}
						this.time_storag = setTimeout(() => {
							if (localStorage.getItem('__order') == old_storag) {
								let info = {
									"添加的商品信息": {
										item: obj,
										"dataList的index": orderIndex
									}
								}
								this.props.debugCacheDisorderOrderlist({ info })
							}
						}, 1000)
					}
				}else{
						obj = this.onMeetPromotional(obj)
						this.props.addToOrderList(obj, orderIndex)
						if (this.time_storag) {
							clearTimeout(this.time_storag)
						}
						this.time_storag = setTimeout(() => {
							if (localStorage.getItem('__order') == old_storag) {
								let info = {
									"添加的商品信息": {
										item: obj,
										"dataList的index": orderIndex
									}
								}
								this.props.debugCacheDisorderOrderlist({ info })
							}
						}, 1000)
				}
				
			})

		} else {
			getWeight()
				.then(res => {
					let weightnum = selectItem.unitname == '斤'
						? res.data * 2
						: res.data
					setTimeout(function () {
						getWeight()
							.then(res => {
								if (weightnum != (selectItem.unitname == '斤' ? res.data * 2 : res.data)) {
									notification.open({
										message: '提示',
										description: '秤不稳，请重新称重',
										onClick: () => {
										},
									})
								}
							})
					}, 200)
					this.props.changeSetting({ goodweight: res.data })
					this.setState({
						realweight: res.data
					})
					const is_weight_goods = 'gkg斤克千克吨公斤'.indexOf(selectItem.changeunitname)
					//( this.state.Num_value ? this.state.Num_value : obj.num )
					obj.num = is_weight_goods === -1 ? (this.state.Num_value ? +this.state.Num_value : obj.num) : (selectItem.unitname == '斤' ? res.data * 2 : res.data)
					//会员享受会员价或会员折扣
					if (member.data) {
						const memeberPriceFunc = () => {
							return selectItem.is_memberprice === 2 ?
								// item.memberprice
								(obj.specialPrice === null ? item.memberprice : (obj.specialPrice > item.memberprice ? item.memberprice : obj.specialPrice))
								: (selectItem.is_membership === 2 ? item.posprice * member.data.rights / 10 : null)
						}
						/**
						 * [优先使用会员日折扣，其次才是会员价，然后是会员折扣，最后是正常商品单价，但是以上所有优先级不如手动修改商品价格]
						 */
						obj.specialPrice = member.data.is_promotion !== 1 && item.promotion_member === 2 ?
							selectItem.promotion * item.posprice / 10 : memeberPriceFunc()
						obj.specialPrice = obj.specialPrice === null ? null : Number(obj.specialPrice).toFixed(2)
					} else {
						if (selectItem.promotion_member === 2) obj.promotion = null
					}

					let old_storag = localStorage.getItem('__order')
					this.setState({
						visible: false,
						Num_value: 0,
					}, () => {
						orderIndex = orderIndex > -1 ? orderIndex : 0
						let target = this.props.order.dataList[orderIndex]
							? this.props.order.dataList[orderIndex]
								.find(a => a.barcode === item.barcode && !a.isPromotion)
							: this.props.order.dataList[orderIndex]
						// console.log(target.num != res.data)
						if (target && (is_weight_goods !== -1) && !JSON.parse(window.localStorage.getItem('__setting')).is_tabulate&&(target.num != res.data)) { //订单中已有商品，去重添加，改变数量/重量
							target = Object.assign({}, target)
							// if(target.num != res.data){
								target.num = +target.num + (+obj.num)
							// }
							
							target = this.onMeetPromotional(target)
							this.props.updateFromOrderList(target, orderIndex)
							if (this.time_storag) {
								clearTimeout(this.time_storag)
							}
							this.time_storag = setTimeout(() => {
								if (localStorage.getItem('__order') == old_storag) {
									let info = {
										"添加的商品信息": {
											item: target,
											"dataList的index": orderIndex
										}
									}
									this.props.debugCacheDisorderOrderlist({ info })
								}
							}, 1000)
						} else if (!target || JSON.parse(window.localStorage.getItem('__setting')).is_tabulate) {
							obj = this.onMeetPromotional(obj);
							this.props.addToOrderList(obj, orderIndex);
							if (this.time_storag) {
								clearTimeout(this.time_storag);
							}
							this.time_storag = setTimeout(() => {
							if (localStorage.getItem("__order") == old_storag) {
								let info = {
								添加的商品信息: {
									item: obj,
									dataList的index: orderIndex
								}
								};
								this.props.debugCacheDisorderOrderlist({ info });
							}
							}, 1000);
						}
					
						this.setState({ prevWeight: res.data })
					})
				})
				.catch(error => Modal.confirm({
					title: '称出问题了?',
					content: '请检查称是否出现故障并将称置零，确认后点击确定. 此操作会刷新页面',
					onOk() {
						window.location.reload()
					},
					onCancel() {
					},
				}))
		}
	}

	/**
	 * [onAddToPriceAdjustList 添加商品到调价单]
	 * @param  {[type]} options.item       [商品项]
	 * @param  {[type]} options.selectItem [商品项]
	 * @param  {[type]} options.specname   [规格名]
	 * @return {[type]}                    [description]
	 */
	* onAddToPriceAdjustList({ item, selectItem, specname }) {
		const { history } = this.props
		let obj = {
			is_freegift: selectItem.is_freegift,
			is_memberprice: selectItem.is_memberprice,
			name: selectItem.name,// `name`
			posprice: item.posprice,// `posprice` varchar(100) NOT NULL,
			supprices: item.supprices,// `posprice` varchar(100) NOT NULL COMMENT '采购价',
			goodsid: selectItem.id,
			barcodeid: item.id,
			barcode: item.barcode,// `barcode` varchar(50) NOT NULL COMMENT '商品条码',
			specname: specname.join('+'),// `specname` 规格
			changeunitname: selectItem.changeunitname,// `changeunitname` '售出单位'
		}
		const key = 'newposprice'
		const key1125 = 'newmemberprice'
		yield (() => {
			const next = () => {
				this.iterator.next()
			}

			this.setState({
				[key]: item.posprice,
				[key1125]: item.memberprice,
			})

			const editInput = value => {
				let output = onVirtualKeyboard(value, this.state[this.state.middle], () => {
					next()
				})

				this.setState({
					[this.state.middle]: output
				})
			}
			const render = () => (
				<div>
					<Input
						addonBefore="零售价"
						size="large"
						style={{ marginBottom: 20 }}
						onChange={e => this.setState({ [key]: e.target.value })}
						value={this.state[key]}
						onFocus={() => {
							this.setState({
								middle: key,
								[key]: "",
							})
						}}
					/>
					{
						selectItem.is_memberprice == 2
							? <Input
								addonBefore="会员价"
								size="large"
								style={{ marginBottom: 20 }}
								onChange={e => this.setState({ [key1125]: e.target.value })}
								value={this.state[key1125]}
								onFocus={() => {
									this.setState({
										middle: key1125,
										[key1125]: "",
									})
								}}
							/>
							: null
					}
					<NumericKeypad onClick={editInput} />
				</div>
			)
			this.withmodal.show({
				title: '修改售价',
				content: render,
			}).then(res => {
				// focus()
			})
		})()
		obj[key] = this.state[key]
		obj[key1125] = this.state[key1125]

		// history.location.pathname.split('/')[1] === 'priceadjustment' ? this.props.addToPriceAdjustmentList(obj) : this.props.addToReportDamageList(obj)
		switch (history.location.pathname.split('/')[1]) {
			case 'priceadjustment':
				this.props.addToPriceAdjustmentList(obj)
				break
			default:
				break
		}
		this.setState({
			[key]: 0
		})
		this.withmodal.colse()
	}
	/**
	 *
	 *
	 * @param {*} page
	 * @param {*} pageSize
	 * @memberof CenterCustom
	 */
	onPageChange(page, pageSize) {
		if (!this.controlClick) return false
		this.controlClick = false
		const { pathname } = this.props.location
		// localStorage.setItem('goods_page',page)
		let params = pathname.split('/')
		let category = params[params.length - 1]
		if (isNaN(Number(category))) return
		/**
		 * [if 页码*每页条数 大于 当前商品数组条数 才去请求]
		 */
		let { data: { msg, total } } = this.props.goods
		if (page * pageSize > msg.length && total > msg.length) {
			if (this.props.setting.search == '') {
				this.props.getGoods({
					search: this.props.setting.search,
					page,
					category,
					store_id: this.props.store.data.id,
					rows: this.props.setting.rowsnum,
					a:this.props.setting.a 
				})
					.then(() => {
						this.controlClick = true
					})
				// this.props.getsearchGoods({ a: this.props.setting.a, search: this.props.setting.search,rows: this.props.setting.rowsnum, category: category })
			} else {
				this.props.getGoods({
					search: this.props.setting.search,
					page,
					store_id: this.props.store.data.id,
					type: this.props.setting.searchtype,
					rows: this.props.setting.rowsnum,
					a:this.props.setting.a
				})
					.then(() => {
						this.controlClick = true
					})
			}
		} else {
			this.props.changePage(page)
			this.controlClick = true
		}
		this.setState({
			page
		})
	}

	/**
	 * [curPageGoods 节选出当前页码下的商品]
	 */
	curPageGoods() {
		//  显示商品
		let { data } = this.props.goods
		data.msg = data.msg.map((item, i, arr) => {
			item.rank = i
			return item
		})
		let start = (data.page - 1) * data.rows
		let end = (data.page * data.rows)
		return data.msg.slice(start, end)
		// let arr = data.msg.slice(start, end)
		// if (arr.length > 0) {
		//   return this.uniqueArray(arr)
		// } else {
		//   return arr
		// }
	}

	//分页去重商品
	// uniqueArray(array) {
	//   var result = [array[0]];
	//   for (var i = 1; i < array.length; i++) {
	//     var item = array[i];
	//     var repeat = false;
	//     for (var j = 0; j < result.length; j++) {
	//       if (item.id == result[j].id) {
	//         repeat = true;
	//         break;
	//       }
	//     }
	//     if (!repeat) {
	//       result.push(item);
	//     }
	//   }
	//   return result;
	// }
	// }

	getValue = (dom, string, value = 0) => {
		return dom.offsetParent ? this.getValue(dom.offsetParent, string, value + dom[string]) : value
	}

	touchStart = e => {
		if (this.throttle) {
			return
		}
		if (this.dragele && this.Obj_ele) {
			this.dragele.style.transition = `transform 0.3s`
			this.Obj_ele.style.transition = `transform 0.3s`
			this.dragele = null
			this.Obj_ele = null
		}
		this.dragele = e.currentTarget
		this.drag_h = e.currentTarget.offsetHeight
		this.drag_w = e.currentTarget.offsetWidth
		this.h_change = e.currentTarget.offsetHeight / 2
		this.w_change = e.currentTarget.offsetWidth / 2
		this.drag_arr = [0, 0]
		this.drag_centre = [+(this.getValue(e.currentTarget, 'offsetLeft') + this.w_change), +(this.getValue(e.currentTarget, 'offsetTop') + this.h_change)]
		// 触摸点x保留0位小数
		this.touch_X = +String(e.changedTouches[0].pageX).match(/\d{0,}/)[0]
		// 触摸点y保留0位小数
		this.touch_Y = +String(e.changedTouches[0].pageY).match(/\d{0,}/)[0]
		// 显示被拖拽div
		this.setState({
			drag_opacity: 0.6,
			drag_width: this.drag_w + 'px',
			drag_heigth: this.drag_h + 'px',
		})
		this.touch_div.current.style.transform = `translate3d(${this.touch_X - this.w_change}px, ${this.touch_Y - this.h_change}px, 0.1px)`
		this.touch_start = true
	}

	touchMove = e => {
		if (this.throttle) {
			return
		}
		if (!this.touch_start) {
			return
		}
		//  保存UI实例
		this.touch_UI = e.currentTarget
		//  对实例进行隐藏
		this.dragele.style.opacity = 0.4
		// 触摸点x保留0位小数
		this.touch_X = +String(e.changedTouches[0].pageX).match(/\d{0,}/)[0]
		// 触摸点y保留0位小数
		this.touch_Y = +String(e.changedTouches[0].pageY).match(/\d{0,}/)[0]
		//  移动div
		this.touch_div.current.style.transform = `translate3d(${this.touch_X - this.w_change}px, ${this.touch_Y - this.h_change}px, 0.1px)`
	}

	touchEnd = e => {
		if (this.throttle) {
			return
		}
		if (!this.touch_start) {
			return
		}
		//  对实例还原
		this.dragele.style.opacity = 1
		//  还原拖拽div
		this.setState({
			drag_opacity: 0,
			drag_width: 0,
			drag_heigth: 0,
		})
		this.touch_div.current.style.transform = `translate3d(0px, 0px, 0.1px)`
		//  没有经过move时
		if (!this.touch_UI) {
			return
		}
		//  开启节流
		this.throttle = true
		this.touch_start = false
		// 触摸点x保留0位小数
		this.touch_X = +String(e.changedTouches[0].pageX).match(/\d{0,}/)[0]
		// 触摸点y保留0位小数
		this.touch_Y = +String(e.changedTouches[0].pageY).match(/\d{0,}/)[0]
		//  UI宽高
		let [UI_w, UI_h] = [this.touch_UI.offsetWidth, this.touch_UI.offsetHeight]
		//  相对位置
		let [LI_left, LI_top] = [this.touch_X - this.getValue(this.touch_UI, 'offsetLeft'), this.touch_Y - this.getValue(this.touch_UI, 'offsetTop')]
		//  LI行列
		let [X_num, Y_num, length, len] = [Math.floor(UI_w / this.drag_w), Math.floor(UI_h / this.drag_h), 0, this.touch_UI.children.length - 4]
		//  获取length
		if (LI_left > 0 && LI_left < UI_w && LI_top > 0 && LI_top < UI_h) {
			length = Math.floor(LI_top / this.drag_h) * X_num + Math.floor(LI_left / this.drag_w)
			length = len >= length ? length : -1
		} else {
			length = -1
		}
		//  换位的dom
		if (length == -1) {
			this.throttle = false
			return
		}
		this.Obj_ele = this.touch_UI.children[length]
		//  是否为同一元素
		if (this.dragele.dataset.index == this.Obj_ele.dataset.index) {
			this.throttle = false
			return
		}
		//  translate数组
		this.Obj_arr = [0, 0]
		//  实例中心
		this.Obj_centre = [+(this.getValue(this.Obj_ele, 'offsetLeft') + this.w_change), +(this.getValue(this.Obj_ele, 'offsetTop') + this.h_change)]
		//  宽
		if (Math.abs(this.Obj_centre[0] - this.drag_centre[0]) > 1) {
			let value = Math.abs(this.Obj_centre[0] - this.drag_centre[0])
			if (this.Obj_centre[0] > this.drag_centre[0]) {
				this.drag_arr[0] += value
				// this.drag_centre[0] += value
				this.Obj_arr[0] -= value
			} else {
				this.drag_arr[0] -= value
				// this.drag_centre[0] -= value
				this.Obj_arr[0] += value
			}
		}
		//  高
		if (Math.abs(this.Obj_centre[1] - this.drag_centre[1]) > 1) {
			let value = Math.abs(this.Obj_centre[1] - this.drag_centre[1])
			if (this.Obj_centre[1] > this.drag_centre[1]) {
				this.drag_arr[1] += value
				// this.drag_centre[1] += value
				this.Obj_arr[1] -= value
			} else {
				this.drag_arr[1] -= value
				// this.drag_centre[1] -= value
				this.Obj_arr[1] += value
			}
		}
		//  对移入dom和实例进行移动
		this.dragele.style.transform = `translate(${this.drag_arr[0]}px, ${this.drag_arr[1]}px)`
		this.Obj_ele.style.transform = `translate(${this.Obj_arr[0]}px, ${this.Obj_arr[1]}px`
		setTimeout(() => {
			let [
				drag_index,
				Obj_index,
				{ data: { page, rows, msg, category } },
			] = [
					+this.dragele.dataset.index,
					+this.Obj_ele.dataset.index,
					this.props.goods,
				]
			let start = (page - 1) * rows
			let end = (page * rows)
			//  更新本地商品缓存
			let data = msg.splice(start, end - start)
			data = data.map((item, i, arr) => {
				return i == drag_index ? arr[Obj_index] : (i == Obj_index ? arr[drag_index] : item)
			})
			msg.splice(start, 0, ...data)
			this.props.ranking(msg)
			this.dragele.style.transition = `none`
			this.Obj_ele.style.transition = `none`
			this.dragele.style.transform = `translate(0px, 0px)`
			this.Obj_ele.style.transform = `translate(0px, 0px)`
			//  更新sql商品
			getCategoryGoods({ category_id: category })
				.then(({ data: { data: list } }) => {
					let d = list
						.splice(start, end - start)
						.map((item, i, arr) => {
							return i == drag_index ? arr[Obj_index] : (i == Obj_index ? arr[drag_index] : item)
						})
					list.splice(start, 0, ...d)
					list = list.map((item, i) => ({
						sequence: i,
						goods_id: item.id
					}))
					setSequence({
						category_id: category,
						list
					})
						.then(res => {
							//  关闭节流
							this.throttle = false
						})
				})
		}, 300)
	}

	changerank = (v, e) => {
		this.setState({
			rank_onOff: true,
			rank_aim: v,
		})
		e.stopPropagation()
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

	/**
	 * [关闭排序]
	 */
	closeRank = () => {
		let that = this
		Modal.confirm({
			content: "是否关闭排序?",
			async onOk() {
				await syncCategoryGoods()
				that.props.changeSetting({
					orderby: false,
				})

				setTimeout(() => {
					let store = JSON.parse(localStorage.getItem('__order'))
					store.dataList[0] = []
					store.orderIndex = 0
					localStorage.removeItem('__order')
					localStorage.setItem('__order', JSON.stringify(store))
					window.history.go(0)
				}, 500)

			},
			maskClosable: true,
		})
	}

	/**
	 * [刷新页面]
	 */
	reloadPage = () => {
		Modal.confirm({
			content: "是否刷新页面?",
			onOk() {
				setTimeout(() => {
					window.history.go(0)
				}, 500)
			},
			maskClosable: true,
		})
	}

	render() {
		let {
			selectItem,
			visible,
			drag_opacity,
			drag_width,
			drag_heigth,
		} = this.state
		//拖拽div样式
		const styles_touch = {
			background: `#fff`,
			opacity: drag_opacity,
			width: drag_width,
			height: drag_heigth,
			position: `fixed`,
			top: 0,
			left: 0,
		}
		// ul属性
		const args_ul = this.props.setting.orderby ? {
			onTouchMove: this.touchMove
		} : null
		//  GoodsCell属性
		const args_GoodsCell = this.props.setting.orderby ? {
			onTouchStart: this.touchStart,
			onTouchEnd: this.touchEnd,
		} : null
		return (
			<Fragment>
				<ul
					className="center-custom-container"
					style={{ flexWrap: 'wrap', paddingRight: 5 }}
					{...args_ul}
				>
					{
						this.props.goods.data && this.curPageGoods().map((item, index) => {
							return (
								<GoodsCell
									key={index.id}
									index={index}
									selectOne={this.state.selectOne}
									item={item}
									changerank={this.changerank}
									rank={item.rank}
									onSelected={this.onSelected.bind(this)}
									setting={this.props.setting}
									member={this.props.member}
									{...args_GoodsCell}
									localtion={this.props.match && this.props.match.url}
								/>
							)
						})
					}
					<div
						ref={this.touch_div}
						style={styles_touch}
					/>
					{
						this.props.goods.data && this.props.goods.data.msg.length === 0 ? <h1 className="tips">此分类暂无商品</h1> : null
					}
					{
						args_ul && <div
							className={styles.rank}
						>
							<Button
								onClick={this.closeRank}
								style={{
									height: "28px",
									lineHeight: "28px",
									border: "none",
								}}
							>关闭排序</Button>
							<Button
								onClick={this.reloadPage}
								style={{
									border: "none",
									background: "#FD7438",
									height: "28px",
									color: "#fff",
									lineHeight: "28px",
								}}
							>刷新页面</Button>
						</div>
					}
					<Pagination
						simple
						className="pagination"
						size="large"
						defaultCurrent={1}
						current={this.state.page}
						pageSize={this.props.goods.data ? this.props.goods.data.rows : 1}
						total={this.props.goods.data ? this.props.goods.data.total : 1}
						onChange={this.onPageChange.bind(this)}
					/>
				</ul>
				<WithModal footer={null} zIndex={3000} ref={(ref) => this.withmodal = ref} />
				<Modal
					title={selectItem.name}
					visible={visible}
					width={700}
					bodyStyle={{ padding: 0 }}
					onCancel={() => this.setState({
						visible: false,
						arrTea: [],
						active_index: -1
					})}
					footer={null}
				>
					<div className="format_modal">
						<div className="box">
							{
								selectItem.barcode
								&& selectItem.barcode
									.map((item, index) => (
										<Card
											key={index}
											className={this.state.active_index === index ? styles.cardavtive : ''}
											title={`${item.posprice}/${selectItem.unitname}`}
											bordered={false}
											style={{
												margin: '10px',
											}}
											onClick={() => this.onSelectedFormat(item, index)}
										>
											{`${item.specitemname1 ? item.specitemname1 : ''}+${item.specitemname2 ? item.specitemname2 : ''}+${item.specitemname3 ? item.specitemname3 : ''}`.replace(/^\+{0,}|\+{0,}$/g, "")}
										</Card>
									))
							}
						</div>
						{
							<Fragment>
								<div className={styles.tea}>
									{
										selectItem.tealist
										&& selectItem.tealist
											.map((item, index) => Object.values(item)[0].length !== 0
												? (
													<div
														key={index}
														className={`${styles.item} ${this.state.arrTea.some(item => item === index) ? styles.active : ''}`}
														onClick={() => this.useTea(index)}
													>
														{Object.values(item)[0]}
														{/*{item[`attribute${index+1}`]}*/}
													</div>
												)
												: null)
									}
								</div>
								<div className={styles.plot}>
									<div
										className={styles.input}
										onClick={this.handPlot}
									>
										{
											this.state.Booltea ? (
												<div className={styles.yuan}>
												</div>
											) : null
										}
									</div>
									<div className={styles.text}>打印不干胶小票</div>
									<div
										className={styles.subipt}
										onClick={() => this.onSelectedFormat(null, null, false)}
									>
										确定
									</div>
								</div>
							</Fragment>
						}
					</div>
				</Modal>
				<Modal
					footer={null}
					keyboard={false}
					maskClosable={false}
					title="设置数量"
					onCancel={() => this.setState({ on_off: false })}
					visible={this.state.on_off}
					zIndex={2000}
					width={400}
				>
					<Input
						value={this.state.Num_value}
						onChange={(e) => {
							this.setState({
								Num_value: this.fat_num(e.target.value)
							})
						}}
						onFocus={() => this.setState({ Num_value: '' })}
						style={{
							width: '330px'
						}}
					/>
					<NumericKeypad onClick={this.Num_click} />
				</Modal>
				<Modal
					footer={null}
					keyboard={false}
					maskClosable={false}
					title="排序"
					onCancel={() => this.setState({ rank_onOff: false })}
					visible={this.state.rank_onOff}
					width={400}
				>
					<Input
						value={this.state.rank_value}
						onChange={(e) => {
							this.setState({
								rank_value: fat_num(e.target.value)
							})
						}}
						onFocus={() => {
							this.setState({
								rank_value: '',
							})
						}}
						style={{
							width: '330px',
							rank_value: '',
						}}
					/>
					<NumericKeypad onClick={this.rank_click} />
				</Modal>
				{/* 促销规则弹窗 */}
				{
					this.state.promotionInfo
						? <Modal
							visible={this.state.showPromotion}
							title="促销"
							cancelText="忽略"
							okText="添加"
							onOk={this.onAddPromotion}
							onCancel={() => this.setState({ showPromotion: false })}
						>
							<p>
								{`${this.state.promotionInfo.promotionsales_name},购买${this.state.promotionInfo.promotion_gname}达到${+this.state.promotionInfo.promotion_num}${this.state.promotionInfo.promotion_unitname},增加${this.state.promotionInfo.additional_price}元便赠送${+this.state.promotionInfo.additional_num + this.state.promotionInfo.additional_unitname + this.state.promotionInfo.additional_gname}`}
							</p>
						</Modal>
						: null
				}
			</Fragment>
		)
	}
}

export default withRouter(connect(mapStateToProps, {
	getGoods,
	addToOrderList,
	updateFromOrderList,
	changePage,
	addToPurchaseList,
	addToFundTransferList,
	addToPriceAdjustmentList,
	addToReportDamageList,
	getWeight,
	changeSetting,
	ranking,
	debugCacheDisorderOrderlist,
	getsearchGoods
})(CenterCustom))
