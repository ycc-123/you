/**
 * 主界面下方按钮组
 */
import React, { Component, Fragment, createRef } from 'react'
import { withRouter } from 'react-router-dom'
import {
	Progress,
	Modal,
	Button,
	message,
	Form,
	Input,
	Row,
	Col,
	Table,
	DatePicker,
	Switch,
	Spin,
	Popover,
	Alert,
	notification,
	Select,
	Drawer,
	Comment,
	Tooltip,
	List
} from 'antd'
import { EditableCell, WithModal, } from '@/widget'
import Verify from '@/widget/PrivilegeVerifier'
import NumericKeypad, { onVirtualKeyboard, fat_num } from '@/widget/NumericKeypad'

import moment from 'moment'
import { addgoods, disconnect, printStock, getStockSafe, synchronizedData, syncCategoryGoods,refundPrintTicket,rechargePrintTicket,splitscreen } from '@/api'
import 'moment/locale/zh-cn'

import {
	GetGoodsHead,
	SearchGoods,
	getOrders,
	refund,
	getGoodsByOrder,
	printTicket,
	upweightinfo,
	labelPrint,
	getOpen,
	getWarehouse,
	getGoodsByWarehouseId,
	warehoseChange,
	getRecord,
	refundRechargeRecord,
	getTempShow,
	printCashierRecord,
	getCashierRecords,
	oenCashbox,
	downpluAll,
	getmember,
	erpStoresGoods
} from '@/api'

import Append from "./Append"
import PromotionsView from './PromotionsView'
import StoreInfoView from './StoreInfoView'
import FooterBtnGroup from './FooterBtnGroup'
import SelectReason from './SelectReason'
import ShortcutKeyCustom from '../../ShortcutKeyCustom'
import CheckingSale from './CheckingSale'
import Setting from './Setting'
import { connect } from 'react-redux'
import styles from './index.module.less'

moment.locale('zh-cn')

const { RangePicker } = DatePicker
const FormItem = Form.Item
const { Option } = Select;
const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 6 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 },
	},
}

const COLUMNS = [
	{
		title: '',
		dataIndex: 'title',
		key: 'title',
	},
	{
		title: '笔数',
		dataIndex: 'num',
		key: 'num',
	},
	{
		title: '现金',
		dataIndex: 'cash',
		key: 'cash',
	},
	{
		title: '微信扫码',
		dataIndex: 'wechat',
		key: 'wechat',
	},
	{
		title: '支付宝扫码',
		dataIndex: 'alipay',
		key: 'alipay',
	},
	{
		title: '个人微信',
		dataIndex: 'personWechat',
		key: 'personWechat',
	},
	{
		title: '个人支付宝',
		dataIndex: 'personAlipay',
		key: 'personAlipay',
	},
	{
		title: '银行卡',
		dataIndex: 'bank',
		key: 'bank',
	},
	{
		title: '会员余额',
		dataIndex: 'member',
		key: 'member',
	},
	{
		title: '购物卡',
		dataIndex: 'shopCard',
		key: 'shopCard',
	},
	// {
	//   title: '口碑支付',
	//   dataIndex: 'koubei',
	//   key: 'koubei',
	// },
]

class FooterLeft extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cz1128: false,
			typeRebates: '',
			numRebates: { numSurplus: 0, numIntegral: 0 },
			dataRebates: null,
			synchronize_value: 0,
			show_mask: false,
			redshow_Inventory: false,
			data_Inventory: null,
			q: 0, //getOrders接口返回的data（总数）
			endtime: '',
			loading: false,
			shopvisible: false,
			left1217: '',
			right1217: '',
			visible: false,//Popover display
			focusInputName: 'actualRefund',//当前焦点所在的input框
			commonModalVisible: false,//公共模态框
			selectedModalName: '',//渲染对应点击的按钮的模态框
			goodsDataSource: [],//*****商品搜索信息列表
			goodsColumns: [],//*****商品搜索信息表头
			orderno: '',//订单号
			starttime: '',//订单查询日期 YYYY-MM-DD
			selectedItem: {},//部分退款对象
			orderDataSource: [],//订单信息
			actualRefund: 0,//实际退款金额
			orderGooodsDataSource: [],//订单商品列表
			tableCurrentEidtInputValue: 0,//table 当前编辑的input的值
			tableCurrentEidtInputInfo: {},//table 当前编辑的input的barcode 和 num
			goods_name: '', //商品名称
			goods_code: '', //商品编码
			barcode: '', //国际条形码
			reason: '', //退款原因 （部分退款）
			orderDetail: false, //查看订单详情
			tableshow: false,
			unshift: '请选择',
			push: '请选择',
			ISpushShow: false,
			goodName: '请选择商品',
			pusnNum: '',
			addProduct: [],
			itemData: [],
			addrow: null,
			paybackModal: false,
			actualRefundo: 0,     //部分退款第一个input值
			actualRefundt: 0,     //部分退款第二个input值
			numoma: 0,     //部分退款第一个最大值
			numtma: 0,     //部分退款第二个最大值
			isshow: false,  //显示混合支付退款
			data: [],
			redshow: false,
			singlepageNum: null,
			show_append: false,
			show_printStock: false,
			show_ftcgoods: false,
			selectoption:"",
			selectchuzhioption:'',
			product:'',
			store_ids : [],
			sumsubtotal_all:''
		};

		this.refRebates = createRef()
		this.iterator = {}
	}

	componentDidMount() {
		this.gettemp()
		this.getInventory()
		this.setState({
			starttime: moment().subtract(10, 'day').format('YYYY/MM/DD'),
			endtime: moment().format('YYYY/MM/DD'),
			product_starttime: moment().subtract(10, 'day').format('YYYY/MM/DD'),
			product_endtime: moment().format('YYYY/MM/DD'),
		})
		// console.log(this.porps)
	}

	off_append = () => {
		this.props.delete_authorization()
		this.setState({
			show_append: false,
		})
	}
	erpStoresGoods(){
		console.log(this.props.store.data.store)
		if(this.state.store_ids.length == 0){
			message.error('请选择门店')
			return false
		}
		erpStoresGoods({
			starttime: this.state.product_starttime,
			endtime: this.state.product_endtime,
			goods_name: this.state.product,
			store_ids: this.state.store_ids,
		  }).then(res => {
			// console.log(res);
			console.log(res.data)
			if(res.data.length>0){
				let aa = res.data.replace('"','').replace(/[\\]/g,'')
			
				let bb = aa.slice(0,2)+'"'+aa.slice(2) 
				console.log(bb)
				console.log(JSON.parse(bb))
				let cc = JSON.parse(bb)
				// let addp = 0
				for(let i=0;i<cc.length;i++){
					cc[i].category_name = unescape(cc[i].category_name.replace(/u/g,"%u"))
					// cc[i].code = unescape(cc[i].code.replace(/u/g,"%u"))
					cc[i].goods_name = unescape(cc[i].goods_name.replace(/u/g,"%u"))
					cc[i].num = unescape(cc[i].num.replace(/u/g,"%u"))
					// cc[i].num = unescape(cc[i].num.replace(/u/g,"%u"))
					// addp+=Number(cc[i].sumsubtotal)
				}
				// console.log(addp)
				this.setState({
				  danpinmingxi: cc,
				  sumsubtotal_all:cc[0].sumsubtotal_all
				},()=>{
					message.info('查询成功')
				});
			}else{
				this.setState({
					danpinmingxi: null,
					sumsubtotal_all:0
				  },()=>{
					 message.info('暂无数据')
				  });
			}
			
		  });
	}
	getInventory = () => {
		if (this.props.setting.Inventory) {
			setInterval(() => {
				getStockSafe({ store_id: this.props.store.data.id, uniacid: this.props.store.data.uniacid })
					.then(({ data }) => {
						if (data.msg.length === 0) {
							return
						}
						this.setState({
							data_Inventory: data.msg,
							redshow_Inventory: true
						})
					})
			}, 180000)
		}
	}
	
	// 获取温度预警
	gettemp() {
		let that = this;
		if (this.props.setting.istemp) {
			setInterval(function () {
				getTempShow({ store_id: that.props.store.data.id })
					.then(res => {
						if (res.data.status == 9002) {

						} else {
							if (res.status == 200 && res.data != "" && res.data.data != "") {
								that.setState({
									data: res.data.data,
									redshow: true
								})
							}
						}
					})
			}, 180000)
		}
	}

	labelPrint1202 = (params) => () => {
		labelPrint({
			type: 2,
			data: { ...params }
		})
	}

	//请求商品表头
	async getGoodsHead() {
		let response = await GetGoodsHead()//发起商品表头请求
		let columns = []
		if (!!response.data) {
			for (let o in response.data.msg) {
				let obj = {}
				obj.title = response.data.msg[o]
				obj.dataIndex = o
				obj.key = o
				columns.push(obj)
			}
			columns.push({
				title: '操作',
				key: 'name',
				render: (text, record) => (
					<span>
						<Button onClick={this.labelPrint1202(text)}>标签打印</Button>
					</span>
				)
			})
			this.setState({ goodsColumns: columns })
		}
	}

	//搜索商品
	async searchGoods() {
		var date = new Date();
		let { goods_name, goods_code, barcode } = this.state
		let response = await SearchGoods({ goods_name, goods_code, barcode, warehouseid: this.props.store.data.warehouseid })//发起请求
		console.log(response.data)
		if (!!response.data) {
			this.setState({ goodsDataSource: response.data.status !== 4002 ? response.data.msg : [] })
		}
	}

	async requestOrder() {
		try {
			let { orderno, starttime, endtime, left1217, right1217,selectoption } = this.state
			// Date.prototype.toLocaleString = function () { //eslint-disable-line
			//   return this.getFullYear() + "/" + (this.getMonth() + 1) + "/" + this.getDate() + "/ " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
			// }
			const createtimeToString = (time) => {
				return moment(time * 1000).format('YYYY/MM/DD|HH:mm:ss')
			}
			let response = await getOrders({
				orderno,
				starttime,
				endtime,
				store_id: this.props.store.data.id,
				startmoney: left1217,
				endmoney: right1217,
				status: selectoption
			})

			const payTypeText = item => {
				let text = '';
				switch (item.pay_type) {
					case 0:
						text = '现金'
						break
					case 1:
						text = '微信扫码'
						break
					case 2:
						text = '支付宝扫码'
						break
					case 3:
						text = '会员余额'
						break
					case 4:
						text = '银行卡'
						break
					case 5:
						text = '个人微信'
						break
					case 6:
						text = '个人支付宝'
						break
					case 7:
						item.pay_info.forEach(v => {
							text += " \n " + payTypeText(v)
						})
						break
					case 8:
						text = '购物卡'
						break
					case 9:
						text = '口碑支付'
						break
					case 20:
						text = '积分兑换'
						break
					default:
						text = '其他'
				}
				return text
			}

			response.data.msg.forEach(item => {
				item.pay_type = payTypeText(item)
				item.createtime = createtimeToString(item.createtime)
				item.orderno = item.orderno + " / " + item.transid;
			})

			let bool = orderno.length > 0 ? true : false

			this.setState({
				q: response.data.data,
				orderDataSource: response.data.msg,
				syd_bool: bool,
			})
		} catch (error) {
			console.log(error)
		}
	}

	*requestRefund(orderno, refund_fee, reason) {
		if (this.props.store.data.show_order_refund_permission == 2) {
			yield (() => {
				this.setState({
					cz1128: true,
				})
			})()
		}
		yield (async () => {
			try {
				var date = new Date()
				let print_number = localStorage.getItem('print_number')?localStorage.getItem('print_number'):1
				let response = await refund({ orderno, refund_fee, reason,print_number: print_number})
				if(response.data.status!=1001){
					// aaaaaaa
					notification.info({
						message: response.data.data,
					})
					return false
				}
				this.requestOrder()
				
				if (response.data.msg.orderinfo.memberid != 0) {
					localStorage.setItem('genxinmember',true)
				}
				
				const target = (response.data.msg.refund_info.length !== 0) && response.data.msg.refund_info.find(item => {
					return item.pay_type === 0 || item.pay_type === 4 || item.pay_type === 5 || item.pay_type === 6
				})
				if (target) {
					notification.open({
						message: <h2
							style={{ fontSize: 40, marginLeft: 40, marginBottom: 0, color: 'red' }}>找零：{target.refund_fee}</h2>,
						duration: 5,
					});
				}
			} catch (error) {
				console.log(error)
			}
		})()
	}

	// async requestRefund(orderno, refund_fee, reason) {
	// 	try {
	// 		var date = new Date();
	// 		let response = await refund({ orderno, refund_fee, reason })
	// 		this.requestOrder()
	// 		const target = (response.data.msg.refund_info.length !== 0) && response.data.msg.refund_info.find(item => {
	// 			return item.pay_type === 0 || item.pay_type === 4 || item.pay_type === 5 || item.pay_type === 6
	// 		})
	// 		if (target) {
	// 			notification.open({
	// 				message: <h2
	// 					style={{ fontSize: 40, marginLeft: 40, marginBottom: 0, color: 'red' }}>找零：{target.refund_fee}</h2>,
	// 				duration: 5,
	// 			});
	// 		}

	// 	} catch (error) {
	// 		console.log(error)
	// 	}
	// }

	async requestGoodsByOrder(orderno, success) {
		let order = orderno.split("/")[0].replace(/\s*/g, "");
		try {
			let { data } = await getGoodsByOrder(order)
			success && success(data)
		} catch (error) {
			console.log(error)
		}
	}

	async requestPrintTicket(orderno,refund) {
		try {
			printTicket({
				orderno:orderno,
				refund:refund
			})
		} catch (error) {
			console.log(error)
		}
	}

	onToggleLoading(value) {
		this.setState({
			loading: value
		})
	}

	eidtInput(value) {
		//计算退款总金额
		const countActualRefund = (list) => {
			let total = 0;
			list.forEach(item => total += (item.refund_num / item.num) * item.goods_price)
			return total
		}

		const refundSuccessed = (res) => {
			console.log(res.data)
			if(res.data.status != 1001){
				console.log(res.data.status)
				notification.info({
					message: res.data.data,
				})
				return false
				
			}
			this.setState({
				reason: '',
				commonModalVisible: false,
				orderDataSource: [],
				actualRefund: 0,
				actualRefundo: 0,    //部分退款第一个input值
				actualRefundt: 0,    //部分退款第二个input值
				numoma: 0,           //部分退款第一个最大值
				numtma: 0,           //部分退款第二个最大值
				isshow: false        //显示混合支付退款
			})
		}

		let { focusInputName, tableCurrentEidtInputInfo, orderGooodsDataSource, selectedItem, reason } = this.state

		let output = onVirtualKeyboard(value, this.state[focusInputName], () => {
			let arr = []

			/**
			 * 筛选出退货数量大于0的数组
			 */
			orderGooodsDataSource.forEach(item => {
				if (Number(item.refund_num) > 0) {
					arr.push(item)
				}
			})


			// 混合支付部分退款
			// if(this.state.actualRefund<=0 || this.state.actualRefundo<=0 || this.state.actualRefundt<=0){
			// 	notification.info({
			// 		message: "退款金额不能为0",
			// 	})
			// 	return false
			// }
			if(this.state.actualRefund>this.state.selectedItem.pay_price){
				notification.info({
					message: "退款金额不能大于订单支付金额",
				})
				return false
			}
			let refundArrs
			if (this.state.isshow) {
				refundArrs = [
					{
						pay_type: selectedItem.pay_info[0].pay_type,
						pay_price: this.state.actualRefundo
					},
					{
						pay_type: selectedItem.pay_info[1].pay_type,
						pay_price: this.state.actualRefundt
					}
				]
			}

			/**
			 * [退款]
			 */

			refund({
				orderno: selectedItem.orderno.split("/")[0].replace(/\s*/g, ""),
				refund_fee: this.state.actualRefund,
				list: arr,
				reason,
				refundArrs,
				print_number:localStorage.getItem('print_number')?localStorage.getItem('print_number'):1
			}).then(res => refundSuccessed(res))
		})

		if (focusInputName === 'tableCurrentEidtInputValue') {
			const dataSource = [...this.state.orderGooodsDataSource]
			const target = dataSource.find(item => item.barcode === tableCurrentEidtInputInfo.barcode)
			if (target) {
				output = Number(output) > Number(tableCurrentEidtInputInfo.max) ? tableCurrentEidtInputInfo.max : output
				target['refund_num'] = output
				this.setState({
					orderGooodsDataSource: dataSource,
					tableCurrentEidtInputValue: output,
					actualRefund: countActualRefund(dataSource)
				})
			}
		} else {
			this.setState({
				//保留小数位数
				[focusInputName]: output
				//.indexOf('.') === -1 ? output : output.substring(0, output.indexOf('.') + 3)
			})
		}

		// 判断混合退款是否超过所消费的金额
		if (focusInputName === 'actualRefundo') {
			if (Number(selectedItem.pay_info[0].pay_price) < Number(output)) {
				this.setState({
					actualRefundo: selectedItem.pay_info[0].pay_price,
				})
			}
		}
		if (focusInputName === 'actualRefundt') {
			if (Number(selectedItem.pay_info[1].pay_price) < Number(output)) {
				this.setState({
					actualRefundt: selectedItem.pay_info[1].pay_price,
				})
			}
		}
	}

	editOrdernoInput(value) {
		let { focusInputName } = this.state
		let output = onVirtualKeyboard(value, this.state[focusInputName], () => {
			if (this.state.selectedModalName === 'goodslist') {
				this.searchGoods()
			}else{
				this.requestOrder()
			}
			// else if(this.state.selectedModalName === 'erpStoreGoods') {
			// 	this.erpStoresGoods()
			// }
		})

		this.setState({
			//保留小数位数
			[focusInputName]: output
		})
	}

	//搜索充值记录
	searchList(value) {
		let { focusInputName } = this.state
		console.log(this.state)

		let output = onVirtualKeyboard(value, this.state[focusInputName], () => {
			this.GetRecord();
		})
		console.log(output)
		this.setState({
			//保留小数位数
			[focusInputName]: output
		})
	}

	/**
	 * [显示部分退款model]
	 * @param data Obj 退款详情
	 */
	*showRebates(data) {
		if (this.props.store.data.show_recharge_refund_permission == 2) {
			yield this.setState({
				cz1128: true,
			})
		}
		yield this.setState({
			getRecorddata: null,
			dataRebates: data,
			typeRebates: '',
			numRebates: { numSurplus: 0, numIntegral: 0 },
		}, () => {
			this.setState({
				selectedModalName: 'rebates',
			}, () => {
				this.refRebates.current.focus()
			})
		})
	}
	// showRebates = (data) => {
	// 	this.setState({
	// 		getRecorddata: null,
	// 		dataRebates: data,
	// 		typeRebates: '',
	// 		numRebates: { numSurplus: 0, numIntegral: 0 },
	// 	}, () => {
	// 		this.setState({
	// 			selectedModalName: 'rebates',
	// 		}, () => {
	// 			this.refRebates.current.focus()
	// 		})
	// 	})
	// }

	/**
	 * [部分退款element]
	 */
	elementRebates = () => {
		let { numRebates, typeRebates, dataRebates: {
			createtime,
			id,
			member_balance,
			member_selling,
			member_amount,
			orderno,
			member_id,
		} } = this.state
		let bool = +member_balance >= +member_amount
		let change = (e) => {
			let val = fat_num(e.target.value)
			if (val != numRebates[typeRebates]) {
				if (numRebates[typeRebates].length < val.length || !numRebates[typeRebates]) {
					numClick(val.slice(-1))
				} else if (numRebates[typeRebates].length > val.length) {
					numClick('退格')
				}
			}
		}
		let numClick = (v) => {
			let value = onVirtualKeyboard(v, numRebates[typeRebates], async () => {
				if (numRebates.numSurplus <= 0 || !numRebates.numSurplus) {
					notification.info({
						message: "退款金额不能为0",
					})
					return false
				}
				let response = await refundRechargeRecord({
					id,
					surplus: numRebates.numSurplus,
					integral: numRebates.numIntegral ? numRebates.numIntegral : 0,
					print_number:localStorage.getItem('print_number')?localStorage.getItem('print_number'):1
				})
					.catch(err => console.log(err))
				if (response && response.data["status"]) {
					let { data: { status } } = response
					if (status === 4001) {
						notification.open({
							message: <span>退款成功</span>,
							duration: 3,
						})
						this.setState({
							commonModalVisible: false,
							isshow: false,
							redshow: false,
							redshow_Inventory: false,
						})
					}
				}
			})
			if (typeRebates === 'numSurplus') {
				numRebates[typeRebates] = +member_selling > +value ? value : member_selling
			} else if (typeRebates === 'numIntegral') {
				numRebates[typeRebates] = bool ? (+member_amount > +value ? value : member_amount) : (+member_balance > +value ? value : member_balance)
			}
			this.setState({
				numRebates,
			})
		}
		return (
			<div className="boxRebates">
				<FormItem {...formItemLayout} className="item index1" label="充值时间">
					<Input disabled={true} value={createtime} />
				</FormItem>
				<FormItem {...formItemLayout} className="item index3" label="订单号">
					<Input disabled={true} value={orderno} />
				</FormItem>
				<FormItem {...formItemLayout} className="item index6" label="会员余额">
					<Input disabled={true} value={member_balance} />
				</FormItem>
				<FormItem {...formItemLayout} className="item index5" label="会员手机号">
					<Input disabled={true} value={member_id} />
				</FormItem>
				<FormItem {...formItemLayout} className="item index2" label="充值面额">
					<Input disabled={true} value={member_amount} />
				</FormItem>
				<FormItem {...formItemLayout} className="item index4" label="充值售价">
					<Input disabled={true} value={member_selling} />
				</FormItem>
				<FormItem {...formItemLayout} className="item index7" label="扣除会员余额">
					<Input
						ref={this.refRebates}
						value={numRebates.numIntegral}
						onChange={change}
						onFocus={() => {
							this.setState((state, props) => ({
								typeRebates: "numIntegral",
								numRebates: { ...state.numRebates, numIntegral: '' }
							}))
						}}
					/>
				</FormItem>
				<FormItem {...formItemLayout} className="item index8" label="退款售价">
					<Input
						value={numRebates.numSurplus}
						onChange={change}
						onFocus={() => {
							this.setState((state, props) => ({
								typeRebates: "numSurplus",
								numRebates: { ...state.numRebates, numSurplus: '' }
							}))
						}}
					/>
				</FormItem>
				<NumericKeypad className="item index9" onClick={(v) => numClick(v)} />
			</div>
		)
	}

	onMoreMenuBtn(clickName, q) {
		if (q == 1) {
			notification.warning({
				message: '提示',
				description: '网络异常或阻塞，此功能暂无法使用',
			})
			return
		}
		disconnect()
			.then(({ data }) => {
				if (data.status == 9002 && clickName !== 'cashbox') {
					notification.warning({
						message: '提示',
						description: '断网中，功能无法使用',
					})
				} else {
					if (clickName === 'goodslist') this.getGoodsHead()
					if (clickName === 'append') {
						this.setState({
							show_append: true,
						})
						return
					}
					if(clickName === 'ftcgoods'){
						this.setState({
							show_ftcgoods: true,
						})
						return
					}
					if (clickName === 'printStock') {
						this.setState({
							show_printStock: true,
						})
						return
					}
					if (clickName === 'cashbox') {
						this.props.setting.xj1126
							? oenCashbox()
							: getOpen({
								store_id: this.props.store.data.id,
								cashier_id: this.props.sale.data.id,
							})
						return
					}
					if (clickName === 'priceAdjustment') {
						this.props.history.push('/priceadjustment')
						return
					}
					if (clickName === 'reportDamage') {
						this.props.history.push('/reportdamage')
						return
					}
					if (clickName === 'fundTransfer') {
						this.props.history.push('/fundTransfer')
						return
					}
					if (clickName === 'putaway') {
						this.props.history.push('/putaway')
						return
					}
					if (clickName === 'soldout') {
						this.props.history.push('/soldout')
						return
					}
					if (clickName === 'purchase') {
						this.props.history.push('/purchase')
						return
					}
					if (clickName === 'computer') {
						// window.open('/huodieposV3/sys/sysuser/home/#/cannibalizing')
						this.openRequestedPopup()
						return
					}
					if (clickName === 'declaration') {
						this.props.history.push('/declaration')
						return
					}
					// if(clickName === 'cannibalizing'){
					//     // this.props.history.push('/cannibalizing')
					//     return
					// }
					this.setState({
						selectedModalName: clickName,
						commonModalVisible: true,
						visible: false,
					})
				}
			})
	}

	//获取充值记录
	async GetRecord() {
		this.onToggleLoading(true)
		let { member_mobile, orderno, starttime, endtime,selectchuzhioption } = this.state
		let response = await getRecord({ member_mobile, orderno, starttime, endtime,status: selectchuzhioption })
		if (!!response.data) {
			this.setState({ getRecorddata: response.data.status !== 4002 ? response.data.msg : [] }, () => {
				this.onToggleLoading(false)
			})
		}
	}
	
	  
	openRequestedPopup() {
		let wscript;
		
		// wscript = new ActiveXObject('WScript.Shell')
		
		
		// windowObjectReference = window.open("http://www.w3school.com.cn", "CNN_WindowName", strWindowFeatures);
		var strWindowFeatures = "width=1000,height=500,menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,left=3000";
        window.open("/huodieposV3/sys/sysuser/home/#/cannibalizing", "B_page", strWindowFeatures);
	  // window.open('/huodieposV3/sys/sysuser/home/#/cannibalizing')
	//   setTimeout(()=>{
	// 	// splitscreen()
	// 	// wscript.SendKeys('{F11}')
	// 	this.fireKeyEvent(document.getElementById('root'),'keydown',122);
	//   },1000)
	
       
    }

	*RefundRechargeRecord(data) {
		if (+data.member_balance < +data.member_amount) {
			notification.info({
				message: "会员余额不足,请选择部分退款"
			})
		} else if (this.props.store.data.show_recharge_refund_permission == 2) {
			yield (() => {
				this.setState({
					cz1128: true,
				})
			})()
		}

		yield (async () => {
			let response = await refundRechargeRecord({ id: data.id,print_number:localStorage.getItem('print_number')?localStorage.getItem('print_number'):1 })
			if (response.data.status == 4001) {
				localStorage.setItem('genxinmember',true)
				notification.open({
					message: <span>退款成功</span>,
					duration: 5,
				});
				this.GetRecord();
			}
		})()
	}

	//获取id退款
	// async RefundRechargeRecord(data) {
	// 	if (+data.member_balance < +data.member_amount) {
	// 		notification.info({
	// 			message: "会员余额不足,请选择部分退款"
	// 		})
	// 		return false
	// 	}
	// 	let response = await refundRechargeRecord({ id: data.id })
	// 	if (response.data.status == 4001) {
	// 		notification.open({
	// 			message: <span>退款成功</span>,
	// 			duration: 5,
	// 		});
	// 		this.GetRecord();
	// 	}
	// }
	rechargePrintTicket(record){
		console.log(record)
		rechargePrintTicket({
			member_id:record.member_id,
			recharge_id:record.id,
			uniacid:record.uniacid,
			pay_type:record.pay_type,
			store_id:record.store_id
		}).then((res)=>{
			console.log(res)
			if(res.data.status == 4001){
				message.success('补打成功');
			}else{
				message.error('补打失败');
			}
		})
	}
	refundPrintTicket(record){
		console.log(record)
		refundPrintTicket({
			member_id:record.member_id,
			recharge_id:record.id,
			uniacid:record.uniacid,
			pay_type:record.pay_type,
			store_id:record.store_id,
		}).then((res)=>{
			console.log(res)
			if(res.data.status == 4001){
				message.success('补打成功');
			}else{
				message.error('补打失败');
			}
		})
	}
	//会员退款Modal
	payBack() {
		const ele = (text, record) => (
			<span
				onClick={() => this.setState({
					orderDetail: true
				}, () => {

				})}
			>{text}</span>
		)

		const columns = [
			{
				title: '充值时间',
				dataIndex: 'createtime',
				key: 'createtime',
				render: (text, record) => (
					<span
						onClick={() => this.setState({
							orderDetail: true
						}, () => {
						})}
					>
						<div>{text.replace(/-/g, '/').split(/ /)[0]}</div>
						<div>{text.replace(/-/g, '/').split(/ /)[1]}</div>
					</span>
				),
			},
			{
				title: '订单号',
				dataIndex: 'orderno',
				key: 'orderno',
				render: ele,
			},
			{
				title: '充值方式',
				dataIndex: 'pay_mode',
				key: 'pay_mode',
				render: ele,
			},
			{
				title: '充值面额',
				dataIndex: 'member_amount',
				key: 'member_amount',
				render: ele,
			},
			{
				title: '实际支付',
				dataIndex: 'member_selling',
				key: 'member_selling',
				render: ele,
			},
			{
				title: '会员名字',
				dataIndex: 'member_name',
				key: 'member_name',
				render: ele,
			},
			{
				title: '会员手机号',
				dataIndex: 'member_id',
				key: 'member_id',
				render: ele,
			},
			{
				title: '操作',
				key: 'action',
				render: (text, record) => (
					<Fragment>
						{
							/[346]/.test(record.status) ? (
								/[34]/.test(record.status) ?
								<div>
								<Button
									style={{
										border: '1px solid #91d5ff',
										backgroundColor: '#e6f7ff',
									}}
								>已全额退款</Button>
								<Button onClick={() => {
									 this.rechargePrintTicket(record)
					
								}}>充值补打</Button>
								<Button onClick={() => {
									 this.refundPrintTicket(record)
								
								}}>退款补打</Button>
								</div>
								 : 
								<div>
									<Button
									style={{
										border: '1px solid #91d5ff',
										backgroundColor: '#e6f7ff',
									}}
								>已部分退款</Button>
								<Button onClick={() => {
								 this.rechargePrintTicket(record)
								
								}}>充值补打</Button>
								<Button onClick={() => {
									 this.refundPrintTicket(record)
								
								}}>退款补打</Button>
								</div>
								
								
							) : (
									<Fragment>
										<span
											style={{
												marginRight: '10px',
											}}
										>
											<Button onClick={() => {
												this.iterator = this.RefundRechargeRecord(record)
												this.iterator.next()
											}}>退款</Button>
										</span>
										<span>
											<Button onClick={() => {
												this.iterator = this.showRebates(record)
												this.iterator.next()
											}}>部分退款</Button>
											
										</span>
										<span
											style={{
												marginLeft: '10px',
											}}
										>
											<Button onClick={() => {
												this.rechargePrintTicket(record)
												}}>充值补打</Button>
										</span>
									</Fragment>
								)
						}
					</Fragment>
				)
			},
		]
		const onChangeDatePickerPayback = (date, dateString) => {
			this.setState({
				starttime: dateString
			})
		}

		const onChangePickerPayback = (date, dateString) => {
			this.setState({
				endtime: dateString
			})
		}
		const onChangeDate = (dates, dateStrings) => {
			this.setState({
				starttime: dateStrings[0],
				endtime: dateStrings[1]
			})
		}
		const onChangeInputOrdernoPayback = (e) => {
			console.log(e.target.value)
			this.setState({
				orderno: e.target.value
			})
		}
		const onChangeInputPhonePayback = (e) => {
			console.log(e.target.value)
			this.setState({
				member_mobile: e.target.value
			})
		}
		const chuzhichange = value => {
			console.log(`selected ${value}`);
			this.setState({
			  selectchuzhioption: value
			});
		  };
		return (
			<Spin spinning={this.state.loading}>
				<div>
					<Table
						rowKey="id"
						size="small"
						columns={columns}
						pagination={{ pageSize: 3 }}
						dataSource={this.state.getRecorddata}
					/>
				</div>
				<Row type="flex" justify="space-between">
					<Col style={{ marginTop: 40, flex: 1 }}>
					<FormItem {...formItemLayout} label="状态类型">
					<Select
						size={"large"}
						style={{ width: "100%" }}
						defaultValue="全部"
						optionFilterProp="children"
						onChange={chuzhichange}
						filterOption={(input, option) =>
						option.props.children
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
						}
					>
						<Option value="0">全部</Option>
						<Option value="1">已付款</Option>
						<Option value="4">全额退款</Option>
						<Option value="6">部分退款</Option>
					</Select>
					</FormItem>
						<FormItem
							{...formItemLayout}
							label="日期："
						>
							<RangePicker
								defaultValue={[moment(this.state.starttime, "YYYY-MM-DD"), moment(this.state.endtime, "YYYY-MM-DD")]} onChange={onChangeDate}
								size={'large'}
								style={{ width: '100%' }}
							/>
						</FormItem>
						{/* <FormItem
							{...formItemLayout}
							label="结束日期："
						>
							<DatePicker onChange={onChangePickerPayback} size={'large'} style={{ width: '100%' }} />
						</FormItem> */}
						<FormItem
							{...formItemLayout}
							label="手机号"
						>
							<Input
								size={'large'}
								value={this.state.member_mobile}
								onFocus={() => this.setState({ focusInputName: 'member_mobile' })}
								// style={{width: '100%'}}
								onChange={onChangeInputPhonePayback}
							/>
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="订单号"
						>
							<Input
								size={'large'}
								value={this.state.orderno}
								onFocus={() => this.setState({ focusInputName: 'orderno' })}
								// style={{width: '100%'}}
								onChange={onChangeInputOrdernoPayback}
							/>
						</FormItem>

						{/*<Button onClick={() => this.requestOrder(this.state.orderno)} size={'large'}>搜索</Button>*/}
					</Col>
					<NumericKeypad style={{ flex: 1 }} onClick={this.searchList.bind(this)} />
				</Row>
			</Spin>
		)

	}
	erpStores() {
		const ele = (text, record) => <span>{text}</span>;
		const columns = [
		  {
			title: "门店名称",
			dataIndex: "storename",
			key: "storename",
			render: ele
		  },
		  {
			title: "商品分类",
			dataIndex: "category_name",
			key: "category_name",
			render: ele
		  },
		  {
			title: "商品名称",
			dataIndex: "goods_name",
			key: "goods_name",
			render: ele
		  },
		  {
			title: "订单数量",
			dataIndex: "order_num",
			key: "order_num",
			render: ele
		  },
		  {
			title: "售出数量",
			dataIndex: "num",
			key: "num",
			render: ele
		  },
		  {
			title: "销售金额",
			dataIndex: "sumsubtotal",
			key: "sumsubtotal",
			render: ele
		  }
		];
		const aonChangeDatePicker = (dates, dateStrings) => {
		  this.setState({
			product_starttime: dateStrings[0],
			product_endtime: dateStrings[1]
		  });
		};
	
		const onChangeInput = e => {
		  console.log(e.target.value);
		  this.setState({
			product: e.target.value
		  });
		};
	
		const onPartialRefund1130 = function*(selectedItem) {
		  if (this.props.store.data.show_order_refund_permission == 2) {
			yield (() => {
			  this.setState({
				cz1128: true
			  });
			})();
		  }
		  yield onPartialRefund(selectedItem);
		};
	
		const onPartialRefund = selectedItem => {
		  if (selectedItem.pay_info.length == 2) {
			this.setState({
			  isshow: true
			});
		  }
		  this.onToggleLoading(true);
		  this.requestGoodsByOrder(selectedItem.orderno, res => {
			// res.msg.forEach(item => {
			//     item.refund_num = item.num
			// })
			this.setState(
			  {
				selectedItem,
				orderGooodsDataSource: res.msg
			  },
			  () => {
				this.onToggleLoading(false);
				this.onMoreMenuBtn("partialRefund");
			  }
			);
		  });
		};
	
		const singlepageamount = ({ current }) => {
		  let a = this.state.orderDataSource.slice(
			0 + 3 * (Number(current) - 1),
			3 + 3 * (Number(current) - 1)
		  );
		  this.setState({
			singlepageNum: a
		  });
		};
		const onseChange = value => {
		  console.log(`selected ${value}`);
		  this.setState({
			selectoption: value
		  });
		};
		const handleChanges = value => {
		  console.log(value);
		  this.setState({
			store_ids: value,
			// selectedModalName:'erpStoreGoods'
		  });

		};
		
		// this.getstores()
		return (
		  <Spin spinning={this.state.loading}>
			<div>
			  <Table
				rowKey="id"
				size="small"
				columns={columns}
				pagination={{ pageSize: 10 }}
				dataSource={this.state.danpinmingxi}
				onChange={singlepageamount}
			  />
			</div>
			<div className="addproduct" style={{
				//  display: 'flex',
				 width: '374px',
				//  justifyContent:'space-between'
			}}>
				{
					this.state.sumsubtotal_all ? <div>总销售金额：{this.state.sumsubtotal_all}</div> : ''
				}
				
			
			</div>
			<Row >
			  <Col style={{ marginTop: 40, flex: 1 }}>
				<FormItem {...formItemLayout} label="门店选择：">
				  <Select
					mode="multiple"
					style={{ width: "100%" }}
					placeholder="请选择"
					onChange={handleChanges}
					value={this.state.store_ids}
				  >
					{this.props.store.data.store.map((item, idx) => {
					  return (
						<Option value={item.id} label={item.name}>
						  <div className="demo-option-label-item">
							<span role="imga" aria-label="aa"></span>
							{item.name}
						  </div>
						</Option>
					  );
					})}
				  </Select>
				</FormItem>
				<FormItem {...formItemLayout} label="日期：">
				  <RangePicker
					defaultValue={[
					  moment(this.state.product_starttime, "YYYY-MM-DD"),
					  moment(this.state.product_endtime, "YYYY-MM-DD")
					]}
					onChange={aonChangeDatePicker}
					size={"large"}
					style={{ width: "100%" }}
					format="YYYY-MM-DD"
				  />
				</FormItem>
			
				<FormItem {...formItemLayout} label="商品名称">
				  <Input
					size={"large"}
					value={this.state.product}
					onFocus={() => this.setState({ focusInputName: "product" })}
					// style={{width: '100%'}}
					onChange={onChangeInput}
				  />
				</FormItem>
			  </Col>
			  {/* <NumericKeypad
				style={{ flex: 1 }}
				onClick={this.editOrdernoInput.bind(this)}
			  /> */}
			  <div className="product">
				<Button
				 type="primary" 
				 size={"large"} 
				 style={{
					margin:"20px auto"
				 }}

				 onClick={this.erpStoresGoods.bind(this)}
				>
					查询
				</Button>
			  </div>
			  
			</Row>
		  </Spin>
		);
	  }
	//退款
	renderRefund() {
		const ele = (text, record) => (
			<span
				onClick={() => this.setState({
					orderDetail: true
				}, () => {
					onPartialRefund(record)
				})}
			>{text}</span>
		)
		const columns = [
			{
				title: '单据日期',
				dataIndex: 'createtime',
				key: 'createtime',
				render: (text, record) => (
					<span
						onClick={() => this.setState({
							orderDetail: true
						}, () => {
							onPartialRefund(record)
						})}
					>
						<div>{text.split('|')[0]}</div>
						<div>{text.split('|')[1]}</div>
					</span>
				),
			},
			{
				title: '订单号/商户单号',
				dataIndex: this.state.syd_bool ? 'transid' : 'orderno',
				key: 'orderno',
				render: ele,
			},
			{
				title: '总金额',
				dataIndex: 'goodsprice',
				key: 'goodsprice',
				render: ele,
			},
			{
				title: '应收',
				dataIndex: 'price',
				key: 'price',
				render: ele,
			},
			{
				title: '实收',
				dataIndex: 'pay_price',
				key: 'pay_price',
				render: ele,
			},
			{
				title: '找零',
				dataIndex: 'return_price',
				key: 'return_price',
				render: ele,
			},
			{
				title: '支付方式',
				dataIndex: 'pay_type',
				key: 'pay_type',
				width: 80,
				render: ele,
			},
			{
				title: '收银员',
				dataIndex: 'cashier',
				key: 'cashier',
				render: ele,
			},
			{
				title: '操作',
				key: 'action',
				render: (text, record) => (
					<span>
						{
							(record.status === 1 || record.status === 2) ?
								<Popover
									onClick={e => e.stopPropagation()}
									content={<SelectReason
										onChange={(value) => {
											this.iterator = this.requestRefund(record.orderno.split("/")[0].replace(/\s*/g, ""), record.price, value)
											this.iterator.next()
										}}
									/>}
									trigger="click"
								>
									<Button>退款</Button>
								</Popover>
								: (
									record.status === 0 ? <Alert message="未付款" type="info" style={{
										display: 'inline-block',
										marginRight: 5,
										paddingTop: 3.5,
										paddingBottom: 3.5
									}} /> : (record.status === 4 ? <Alert message="已全额退款" type="info" style={{
										display: 'inline-block',
										marginRight: 5,
										paddingTop: 3.5,
										paddingBottom: 3.5
									}} /> : <Alert message="已部分退款" type="info" style={{
										display: 'inline-block',
										marginRight: 5,
										paddingTop: 3.5,
										paddingBottom: 3.5
									}} />)
								)
						}
						{record.status === 1 ? <Button
							onClick={() => this.setState({ orderDetail: false }, () => {
								this.iterator = onPartialRefund1130.call(this, record)
								this.iterator.next()
							})}
						>部分退款</Button> : null}
						{
							record.status === 0 ? null : <Button onClick={() => this.requestPrintTicket(record.orderno.split("/")[0].replace(/\s*/g, ""),'')}>订单补打</Button>
						}
						{
							record.status === 4 || record.status === 6 ? <Button onClick={() => this.requestPrintTicket(record.orderno.split("/")[0].replace(/\s*/g, ""),'1')}>退款补打</Button> : null
						}
					</span>
				)
			},
		]
		const onChangeDatePicker = (dates, dateStrings, ) => {
			this.setState({
				starttime: dateStrings[0],
				endtime: dateStrings[1],
			})
		}

		const onChangeInput = (e) => {
			console.log(e.target.value)
			this.setState({
				orderno: e.target.value
			})
		}

		const onPartialRefund1130 = function* (selectedItem) {
			if (this.props.store.data.show_order_refund_permission == 2) {
				yield (() => {
					this.setState({
						cz1128: true,
					})
				})()
			}
			yield onPartialRefund(selectedItem)
		}

		const onPartialRefund = (selectedItem) => {
			if (selectedItem.pay_info.length == 2) {
				this.setState({
					isshow: true
				})
			}
			this.onToggleLoading(true)
			this.requestGoodsByOrder(selectedItem.orderno, (res) => {
				// res.msg.forEach(item => {
				//     item.refund_num = item.num
				// })
				this.setState({
					selectedItem,
					orderGooodsDataSource: res.msg
				}, () => {
					this.onToggleLoading(false)
					this.onMoreMenuBtn('partialRefund')
				})
			})
		}
		const onseChange = value => {
			console.log(`selected ${value}`);
			this.setState({
			  selectoption: value
			});
		  };
		const singlepageamount = ({ current }) => {
			let a = this.state.orderDataSource.slice(0 + 3 * (Number(current) - 1), 3 + 3 * (Number(current) - 1))
			this.setState({
				singlepageNum: a
			})
		}

		return (
			<Spin spinning={this.state.loading}>
				<div>
					<Table
						rowKey="id"
						size="small"
						columns={columns}
						pagination={{ pageSize: 3 }}
						dataSource={this.state.orderDataSource}
						onChange={singlepageamount}
					/>
				</div>
				<Row type="flex" justify="space-between">
					<Col style={{ marginTop: 40, flex: 1 }}>	
					<FormItem {...formItemLayout} label="类型：">
						<Select
							size={"large"}
							style={{ width: "100%" }}
							defaultValue="全部"
							optionFilterProp="children"
							onChange={onseChange}
							value={this.state.selectoption}
							filterOption={(input, option) =>
							option.props.children
								.toLowerCase()
								.indexOf(input.toLowerCase()) >= 0
							}
						>
							<Option value="0">全部</Option>
							<Option value="1">已付款</Option>
							<Option value="4">全额退款</Option>
							<Option value="6">部分退款</Option>
							<Option value="10">会员订单</Option>
						</Select>
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="日期："
						>
							<RangePicker
								defaultValue={[moment(this.state.starttime, "YYYY-MM-DD"), moment(this.state.endtime, "YYYY-MM-DD")]}
								onChange={onChangeDatePicker}
								size={'large'}
								style={{ width: '100%' }}
								format='YYYY-MM-DD'
							/>
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="应收金额"
						>
							<div
								style={{
									display: 'flex',
									flexFlow: 'row nowrap',
								}}
							>
								<Input
									size={'large'}
									value={this.state.left1217}
									onFocus={() => this.setState({ focusInputName: 'left1217' })}
									onChange={(e) => this.setState({
										left1217: e.target.value
									})}
								/>~<Input
									size={'large'}
									value={this.state.right1217}
									onFocus={() => this.setState({ focusInputName: 'right1217' })}
									onChange={(e) => this.setState({
										right1217: e.target.value
									})}
								/>
							</div>
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="订单号/商户单号"
						>
							<Input
								size={'large'}
								value={this.state.orderno}
								onFocus={() => this.setState({ focusInputName: 'orderno' })}
								// style={{width: '100%'}}
								onChange={onChangeInput}
							/>
						</FormItem>
						{//this.props.store.data.show_order_report == 2
							this.props.agms == 2 ? (<div className={styles.box}>
								<div>
									当前数量:{
										this.state.singlepageNum ? this.state.singlepageNum.length : this.state.orderDataSource.slice(0, 3).length
									}
									<span className={styles.top}>当前金额:</span>
									{
										this.state.singlepageNum ? String(this.state.singlepageNum.reduce((a, b) => {
											return a + b.goodsprice
										}, 0)).match(/\d{0,}\.{0,1}\d{0,2}/) : String(this.state.orderDataSource.slice(0, 3).reduce((a, b) => {
											return a + b.goodsprice
										}, 0)).match(/\d{0,}\.{0,1}\d{0,2}/)
									}
								</div>
								<div>
									全部数量:{
										this.state.q
									}<span className={styles.btn}>全部金额:</span>{
										String(this.state.orderDataSource.reduce((a, b) => {
											return (b.status == 1 || b.status == 2 || b.status == 4 || b.status == 6) ? a + b.price : a
											// return (b.status == 2) ? a + b.price : a
										}, 0)).match(/\d{0,}\.{0,1}\d{0,2}/)
									}
								</div>
							</div>) : null
						}
						{/*<Button onClick={() => this.requestOrder(this.state.orderno)} size={'large'}>搜索</Button>*/}
					</Col>
					<NumericKeypad style={{ flex: 1 }} onClick={this.editOrdernoInput.bind(this)} />
				</Row>
			</Spin>
		)
	}

	//部分退款
	renderPartialRefund() {
		let { selectedItem, orderGooodsDataSource } = this.state

		const columns = [
			{
				title: '商品名称',
				dataIndex: 'goods_name',
				key: 'goods_name',
			},
			{
				title: '商品条码',
				dataIndex: 'barcode',
				key: 'barcode',
			},
			{
				title: '售出金额',
				dataIndex: 'goods_price',
				key: 'goods_price',
			},
			{
				title: '售出数量',
				dataIndex: 'num',
				key: 'num',
			},
			{
				title: '退款数量',
				key: 'refund_num',
				render: (text, record, index) => {
					return (
						<EditableCell
							value={record.refund_num}
							setValue={setValue}
							index={index}
							num={record.num}
							barcode={record.barcode}
							onFocus={(barcode) => onCellFocus(record.refund_num, barcode, record.num)}
						/>
					)
				}
			}
		]

		const setValue = (val, index) => {
			let { orderGooodsDataSource } = this.state
			let oldVal = orderGooodsDataSource[index].refund_num
			val = fat_num(val)
			if (val != oldVal) {
				if (!oldVal) {
					this.eidtInput(val.slice(-1))
				}
				if (oldVal.length < val.length) {
					this.eidtInput(val.slice(-1))
				} else if (oldVal.length > val.length) {
					this.eidtInput('退格')
				}
			}
		}

		const onCellFocus = (value, barcode, max) => {
			value = Number(value) > max ? max : value
			if (this.state.focusInputName !== 'tableCurrentEidtInputValue' || this.state.tableCurrentEidtInputInfo.barcode !== barcode) {
				this.setState({
					focusInputName: 'tableCurrentEidtInputValue',
					tableCurrentEidtInputValue: value,
					tableCurrentEidtInputInfo: { barcode, max }
				})
			}
		}

		const handleChange = (reason) => {
			this.setState({
				reason
			})
		}

		return (
			<div>
				<Row gutter={16}>
					<Col span={10}>
						<FormItem
							{...formItemLayout}
							label="订单号："
						>
							<Input
								size={'large'}
								style={{ width: '100%' }}
								value={selectedItem.orderno}
								disabled
							/>
						</FormItem>
					</Col>
					<Col span={8}>
						<FormItem
							{...formItemLayout}
							label="可退金额："
						>
							<Input
								size={'large'}
								style={{ width: '100%' }}
								value={selectedItem.pay_price}
								disabled
							/>
						</FormItem>
					</Col>
					<Col span={6}>
						支付方式： {selectedItem.pay_type}
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={10}>
						<FormItem
							{...formItemLayout}
							label="商户单号："
						>
							<Input
								size={'large'}
								style={{ width: '100%' }}
								value={selectedItem.transid}
								disabled
							/>
						</FormItem>
					</Col>
				</Row>
				<Table
					rowKey="id"
					pagination={{ pageSize: 2 }}
					columns={columns}
					dataSource={orderGooodsDataSource}
				/>
				<Row type="flex" justify="space-between" style={{ display: this.state.orderDetail ? 'none' : 'flex' }}>
					<Col style={{ flex: 1 }}>
						{
							this.state.isshow ? this.renderRefundOrder() :
								<FormItem
									{...formItemLayout}
									label="退款金额："
								>
									<Input
										value={this.state.actualRefund}
										onChange={(e) => this.setState({ actualRefund: e.target.value })}
										size="large"
										style={{ width: '100%' }}
										onFocus={() => this.setState({ focusInputName: 'actualRefund' })}
									/>
								</FormItem>
						}
						<FormItem
							{...formItemLayout}
							label="退款原因"
						>
							<SelectReason onChange={handleChange} />
						</FormItem>

						<FormItem
							labelCol={{ span: 8 }}
							label="结算后打印小票"
						>
							<Switch defaultChecked onChange={(e) => this.setState({ print_xp: e.target.value })} />
						</FormItem>
					</Col>
					<NumericKeypad style={{ flex: 1 }} onClick={(value) => this.eidtInput(value)} />
				</Row>
			</div>
		)
	}

	// 部分退款退款内容项
	renderRefundOrder() {
		let { selectedItem } = this.state
		let PAY_INFO = selectedItem.pay_info
		let payinfo = [
			{
				title: PAY_INFO[0].pay_type,
				pay_price: PAY_INFO[0].pay_price
			},
			{
				title: PAY_INFO[1].pay_type,
				pay_price: PAY_INFO[1].pay_price
			}
		]
		return (
			<div>
				<FormItem
					{...formItemLayout}
					label={
						payinfo[0].title == 0 ? "现金：" : payinfo[0].title == 1 ? "微信扫码：" : payinfo[0].title == 2 ? "支付宝扫码：" : payinfo[0].title == 3 ? "会员余额：" : payinfo[0].title == 4 ? "银行卡：" : payinfo[0].title == 5 ? "个人微信：" : payinfo[0].title == 6 ? "个人支付宝：" : "购物卡："
					}
				>
					<Input
						value={this.state.actualRefundo}
						onChange={(e) => this.setState({ actualRefundo: e.target.value })} 
						size="large"
						style={{ width: '50%', marginRight: '5%' }}
						onFocus={() => this.setState({ focusInputName: 'actualRefundo', numoma: payinfo[0].pay_price })}
					/>
					最高可退{payinfo[0].pay_price}
				</FormItem>
				<FormItem
					{...formItemLayout}
					label={
						payinfo[1].title == 0 ? "现金：" : payinfo[1].title == 1 ? "微信扫码：" : payinfo[1].title == 2 ? "支付宝扫码：" : payinfo[1].title == 3 ? "会员余额：" : payinfo[1].title == 4 ? "银行卡：" : payinfo[1].title == 5 ? "个人微信：" : payinfo[1].title == 6 ? "个人支付宝：" : "购物卡："
					}
				>
					<Input
						value={this.state.actualRefundt}
						onChange={(e) => this.setState({ actualRefundt: e.target.value })}
						size="large"
						style={{ width: '50%', marginRight: '5%' }}
						onFocus={() => this.setState({ focusInputName: 'actualRefundt', numtma: payinfo[1].pay_price })}
					/>
					最高可退{payinfo[1].pay_price}
				</FormItem>
			</div>
		)
	}

	//商品搜索modal
	renderSearchGoods() {
		let titles = [
			{ key: 1, label: '商品名称', name: 'goods_name' },
			{ key: 2, label: '商品编码', name: 'goods_code' },
			{ key: 3, label: '国际条形码', name: 'barcode' },
		]
		return (
			titles.map((item, index) => (
				<FormItem
					{...formItemLayout}
					label={item.label}
					key={index}
				>
					<Input
						size="large"
						value={this.state[item.name]}
						onChange={e => this.setState({ [item.name]: e.target.value })}
						onFocus={() => this.setState({ focusInputName: item.name })}
					/>
				</FormItem>
			))
		)
	}

	renderPushGoods() {
		let titles = [
			{ key: 1, label: '商品名称', name: 'goodName' },
			{ key: 2, label: '新增数量', name: 'goodNum' },

		]
		return (
			titles.map((item, index) => (

				<div>
					<FormItem

						{...formItemLayout}
						label={item.label}
						key={index}
					>
						<Input
							size="large"
							value={this.state[item.name]}
							onChange={e => this.setState({ [item.name]: e.target.value })}
							onFocus={() => this.setState({ focusInputName: item.name })}
						/>

					</FormItem>

				</div>


			))
		)
	}

	getWarehouse() {
		getWarehouse().then(res => {
			this.setState({
				getWarehouse: res.data.data
			})
			// data = res.data.data
			// console.log(data)
		})
	}

	clickRows(row) {
		console.log(row)

		this.setState({
			goodName: row.goods_name,
			addrow: row,
			goodNum: row.gnum
		})
		console.log(row)
	}

	pushClick() {
		let data = []

		getGoodsByWarehouseId(this.state.pushid).then((res) => {
			data = res.data.data
			if (res.data.status === 4001) {
				this.setState({
					getGoodsByWarehouseId: data,
					ISpushShow: true
				})
			} else {
				return;
			}

		})


	}

	addClick() {

		let itemData = []
		const data = {
			'barcodeid': this.state.addrow.barcodeid,
			'realnum': this.state.goodNum,
			'goodsid': this.state.addrow.goodsid,
			'goods_name': this.state.unshiftid,
			'specid1': this.state.addrow.specid1,
			'specid2': this.state.addrow.specid2,
			'specid3': this.state.addrow.specid3,
			'specitemid1': this.state.addrow.specitemid1,
			'specitemid2': this.state.addrow.specitemid2,
			'specitemid3': this.state.addrow.specitemid3,
			'barcode': this.state.addrow.barcode
		}
		itemData.push(data)
		// let jsonData = {}
		// jsonData.itemData = itemData;
		// jsonData.warehouse_out = this.state.pushid;
		// jsonData.warehouse_in = this.state.unshiftid;
		// console.log(jsonData)
		console.log(itemData)
		warehoseChange({
			itemData: itemData,
			warehouse_out: this.state.pushid,
			warehouse_in: this.state.unshiftid,
		}).then(res => {
			if (res.data.status === 4001) {
				message.success('调拨成功！', 10);
				this.setState({
					goodName: '请选择商品',
					goodNum: ''
				})
			}
		})
		console.log(this.state.addrow)
	}

	goodsPush() {
		let titles = [
			{ key: 1, label: '转出仓库', name: 'unshift' },
			{ key: 2, label: '转入仓库', name: 'push' },
		]
		const columns = [

			{ title: 'id', dataIndex: 'id', key: 'id' },
			{ title: 'name', dataIndex: 'name', key: 'name' },

			{
				title: '选择',
				key: 'operation',
				fixed: 'right',
				width: 100,
				render: () => <a href="javascript:;" onSelect={(changeableRowKeys) => {
					console.log(changeableRowKeys)
				}}>选择</a>,
			},
		];
		//   const data = [{
		//     key: '1',
		//     name: 'John Brown',
		//     age: 32,
		//     address: 'New York Park',
		//   }, {
		//     key: '2',
		//     name: 'Jim Green',
		//     age: 40,
		//     address: 'London Park',
		//   }];
		// let tableshow = false
		const clickPush = ((name) => {
			if (this.state.tableshow) {
				this.setState({
					tableshow: false
				})
			} else {
				this.getWarehouse()
				this.setState({
					tableshow: true
				})
			}
			this.setState({
				qiehuan: name
			})

		})
		const clickRow = ((row, record, rowkey) => {
			// console.log(name)
			if (this.state.qiehuan === 'unshift') {
				this.setState({
					unshift: row.name,
					pushid: row.id
				})
			} else {
				this.setState({
					push: row.name,
					unshiftid: row.id
				})
			}
			this.setState({
				tableshow: false,
			})

		})
		return (

			titles.map((item, index) => (
				<FormItem
					{...formItemLayout}
					label={item.label}
					key={index}
				>

					<Input
						size="large"
						value={this.state[item.name]}
						onChange={e => this.setState({ [item.name]: e.target.value })}
						onFocus={() => this.setState({ focusInputName: item.name })}
						onClick={() => {
							clickPush(item.name)
						}}
					/>
					<div>
						{
							this.state.tableshow ?
								<Table columns={columns} dataSource={this.state.getWarehouse}
									onRow={(record, rowkey) => {//表格行点击事件
										return {
											onClick: clickRow.bind(this, record, rowkey, item.name)
										};
									}}
								/>
								:
								''
						}
					</div>
				</FormItem>


			))


		)
	}

	addPropsToRecord = data => {
		const ARR = ['订单收款', '会员充值', '订单退款', '小计']

		const obj = (item) => {
			let keys = Object.keys(item)
			let obj = {};
			// keys.forEach(item => {
			// 	obj[item] = +(data.slice(0, 2).reduce((prev, cur) => {
			// 		return Number(cur[item]) + Number(prev)
			// 	}, 0) - data.slice(2).map(cur => Number(cur[item]))).toFixed(2)
			// })
			keys.forEach(item => {
				obj[item] = +(
				  data.slice(0, 2).reduce((prev, cur) => {
					return Number(cur[item]) + Number(prev);
				  }, 0) - data.slice(2).map(cur => Number(cur[item]))
				).toFixed(2);
			  });
			return obj
		}
		data.push(obj(data[0]))
		console.log(data)
		data.forEach((item, index) => {
			item['key'] = index
			item['title'] = ARR[index]
		})

		return data
	}

	onHistoryCashierRecord = () => {
		const columns = [
			{
				title: '开始时间',
				key: 'createtime',
				render: (text, record) => (
					<span>{record.other.createtime}</span>
				)
			},
			{
				title: '结束时间',
				key: 'end_at',
				render: (text, record) => (
					<span>{record.other.end_at}</span>
				)
			},
			{
				title: '收银员',
				key: 'cashier',
				render: (text, record) => (
					<span>{record.other.cashier}</span>
				)
			},
			{
				title: '操作',
				key: 'action',
				render: (text, record) => (
					<Button onClick={() => printCashierRecord(record)}>打印</Button>
				)
			},
		]
		
		const expandedRowRender = (record, index) => {
			const data = this.addPropsToRecord(record.data.slice())
			return (
				<Table
					size="small"
					columns={COLUMNS}
					dataSource={data}
					pagination={false}
				/>
			)
		}
		const onChange = (date, dateString) => {
			if (dateString[0] === '' || dateString[1] === '') return
			getCashierRecords({ starttime: dateString[0], endtime: dateString[1] })
				.then(res => {
					console.log(res)
					this.withmodal.show({
						title: '交班记录',
						width: 870,
						content: () => render({ list: res.data.msg, start: dateString[0], end: dateString[1] }),
					})
				})
		}
		const render = ({ list, start, end }) => (
			<div>
				<Row gutter={16}>
					<Col span={24}>
						<FormItem
							labelCol={{ span: 4 }}
							label="时间段"
						>
							<RangePicker
								size="large"
								onChange={onChange}
								defaultValue={[moment(start), moment(end)]} />
						</FormItem>
					</Col>
				</Row>

				<Table
					size="middle"
					columns={columns}
					dataSource={list}
					expandedRowRender={expandedRowRender}
					rowKey={(item, index) => `history${index}`}
				/>
			</div>
		)
		onChange('', [moment(moment().subtract(10, 'days').calendar(), 'YYYY-MM-DD'), moment().format('YYYY-MM-DD')])
	}

	//公共modal

	renderCommonModal() {
		const columns = [

			{ title: '仓库', dataIndex: 'warehousename', key: 'warehousename' },
			{ title: '商品条码', dataIndex: 'barcode', key: 'barcode' },
			// { title: '仓库', dataIndex: 'id', key: 'id' },
			{ title: '商品名称', dataIndex: 'goods_name', key: 'goods_name' },
			{ title: '当前库存', dataIndex: 'gnum', key: 'gnum' },
			{ title: '商品ID', dataIndex: 'goodsid', key: 'goodsid' },
			{ title: '条码ID', dataIndex: 'barcodeid', key: 'barcodeid' },

			{
				title: '选择',
				key: 'operation',
				fixed: 'right',
				width: 100,
				// eslint-disable-next-line no-script-url
				render: () => <a href="javascript:;">选择</a>,
			},
		];
		let commonModalTitle;
		let element;
		let width = 500
		const updateWeight = (val, key) => {
			let { store: { data } } = this.props
			let { weightinfo, gorge, printerType } = {
				...{
					weightinfo: data.weight,
					gorge: data.gorge,
					printerType: data.printerType,
				},
				[key]: val
			}
			upweightinfo({ weightinfo, gorge, printerType }).then(res => {
				let obj = {
					...data,
					weight: weightinfo,
					gorge,
					printerType,
				}
				this.props.eidtStore(obj)
			})
		}

		if (this.state.selectedModalName != 'slip') {
			switch (this.state.selectedModalName) {
				case 'rebates':
					width = '800px'
					commonModalTitle = '储值部分退款'
					element = this.elementRebates()
					break
				case 'sorting':
					commonModalTitle = '拖拽排序'
					element = <div>排序前需要同步商品列表,请确保网络通畅</div>
					break
				case 'synchronize':
					commonModalTitle = '同步信息'
					element = <div>同步时请不要关闭页面或刷新页面</div>
					break
				case 'storeInfo':
					commonModalTitle = '店铺信息'
					element = <StoreInfoView info={this.props.store.data} onChange={updateWeight} />
					break
				case 'promotions':
					commonModalTitle = '促销详情'
					element = <PromotionsView info={this.props.fullsub.data} />
					break
				case 'goodslist':
					commonModalTitle = '商品信息'
					width = '100%'
					element = <div>
						<Table dataSource={this.state.goodsDataSource} columns={this.state.goodsColumns} />
						<Row type="flex" justify="space-between">
							<Col style={{ flex: 1 }}>
								{
									this.renderSearchGoods()
								}
							</Col>
							<NumericKeypad style={{ flex: 1 }} onClick={this.editOrdernoInput.bind(this)} />
						</Row>
					</div>
					break
				case 'refund':
					width = '100%'
					commonModalTitle = '收银明细'
					element = this.renderRefund()
					break
				case "erpStores":
					width = "100%";
					commonModalTitle = "单品明细";
					element = this.erpStores();
					break;
				case 'payback':
					width = '100%'
					commonModalTitle = '储值明细'
					element = this.payBack()
					break
				case 'partialRefund':
					width = '80%'
					commonModalTitle = '收银部分退款'
					element = this.renderPartialRefund()
					break
				case 'ShortcutKey':
					width = '55%'
					commonModalTitle = '指定导购员'
					element = <ShortcutKeyCustom
						onClose={() => this.setState({ commonModalVisible: false })}
					/>
					break
				case 'checkingsale':
					commonModalTitle = '到店核销'
					element = <CheckingSale />
					break
				case 'setting':
					width = '666px'
					commonModalTitle = '设置'
					element = <Setting />
					break
				case 'fenping':
				default:
					commonModalTitle = '错误'
					element = <p>空</p>
					break
				case 'cannibalizing':
					commonModalTitle = '新增移库单'
					width = '100%'
					element = <div>
						{/* <Table dataSource={this.state.goodsDataSource} columns={this.state.goodsColumns} /> */}
						<Row type="flex">
							<Col style={{ flex: 1 }}>
								{
									this.goodsPush()
								}
								<div className='pushForm'>
									<Button className='pushSearch' onClick={() => {
										this.pushClick()
									}} type="primary">查询</Button>
								</div>
							</Col>
							<NumericKeypad style={{ flex: 1 }} onClick={this.eidtInput.bind(this)} />
							{
								this.state.ISpushShow ? this.renderPushGoods()
									: ''
							}
							{
								this.state.ISpushShow ?
									<Button type="primary" onClick={() => {
										this.addClick()
									}}>调拨</Button>
									: ''
							}

							{/* {
																this.state.ISpushShow?
															 
														} */}
						</Row>
						<Table className='pushTable' columns={columns} dataSource={this.state.getGoodsByWarehouseId}
							onRow={(record, rowkey) => {//表格行点击事件
								return {
									onClick: this.clickRows.bind(this, record, rowkey)
								}
							}
							}
						/>

					</div>
					break
				case 'earlywarning':
					commonModalTitle = '温控预警'
					width = '50%'
					element = <div>
						{
							this.state.data.map((item, index) => (
								<p key={index}>
									{index + 1}、{item.devname} 里面温度 {item.alert_type == 1 ? '偏高' : '偏低'} 温度为 {item.temperature} 摄氏度。
								</p>
							))
						}
					</div>
					break
				case 'Inventory':
					commonModalTitle = '库存预警'
					width = '100%'
					let c = [
						{ title: '门店', dataIndex: 'warehousename' },
						{ title: '商品', dataIndex: 'goodsname' },
						{ title: '库存', dataIndex: 'gnum' },
						{ title: '单位', dataIndex: 'unitname' },
						{ title: '最小库存', dataIndex: 'minstock' },
						{ title: '安全库存', dataIndex: 'safestock' },
						{ title: '提示', dataIndex: 'alert_message' },
					]
					element = <div>
						{
							<Table
								dataSource={this.state.data_Inventory}
								columns={c}
							/>
						}
					</div>
					break
			}


			return { commonModalTitle, element, width }
		} else {
			this.setState({ selectedModalName: '', commonModalVisible: false })
			this.onHistoryCashierRecord()

			return
		}

	}

	handleVisibleChange = visible => {
		this.setState({
			visible
		})
	}

	/**
	 * [关闭库存打印]
	 * */
	off_printStock = () => {
		this.setState({
			show_printStock: false,
		})
	}

	/**
	 * 【库存打印】
	 * */
	submit_printStock = async () => {
		let { data } = await printStock()
		this.setState({
			show_printStock: false,
		})
	}

	/**
	 * [关闭一键传秤]
	 * */
	off_ftcgoods = () => {
		this.setState({
			show_ftcgoods: false,
		})
	}

	/**
	 * 【一键传秤】
	 * */
	submit_ftcgoods = async () => {
		await downpluAll()
		this.setState({
			show_ftcgoods: false,
		})
	}


	/**
	 * 新增商品提交事件
	 * a 6个input的value组成的数组
	 * b 分类级联选择组成的数组
	 * c 单位的字符串
	 * d 启用会员价单选按钮 1为是 2为否
	 * f 启用会员折扣单选按钮 1为是 2为否
	 * g 导购权益
	 * h id
	 * i uniacid
	 */
	itemaddsubmit = (a, b, c, d, f, g, h, i, ) => {
		// if (a.some(item => item.value.length === 0 && item.text !== "会员价")) {
		// 	a.map(item => {
		// 		item.value.length === 0 ? notification.warning({
		// 			message: "提示",
		// 			description: `${item.text}为空，请填写`,
		// 		}) : null
		// 		return item
		// 	})
		// 	return
		// }
		// let q = [a[2], a[4]]
		// if (q.some(item => item.value == 0)) {
		// 	q.map(item => {
		// 		if (item.value == 0) {
		// 			notification.warning({
		// 				message: "提示",
		// 				description: `${item.text}为0，请重新填写`,
		// 			})
		// 		}
		// 		return item
		// 	})
		// 	return
		// }
		// a[3].value = a[3].value ? a[3].value : a[2].value
		let continuous = true
		for (const [key, item] of a.entries()) {
			if (item.text === "商品编码" || item.text === "商品名称" || item.text === "零售价" || item.text === "首字母搜索") {
				if (item.value === "") {
					notification.warning({
						message: "提示",
						description: `${item.text}为空，请重新填写`,
					})
					continuous = false
					break
				} else if (+item.value === 0 && item.text === "零售价") {
					notification.warning({
						message: "提示",
						description: `零售价为0，请重新填写`,
					})
					continuous = false
					break
				}
			}
		}
		if (!continuous) return false

		if (b == '') {
			notification.warning({
				message: "提示",
				description: "分类为空，请选择",
			})
			return
		} else if (c == '') {
			notification.warning({
				message: "提示",
				description: "单位为空，请选择",
			})
			return
		}

		addgoods({
			categoryid: b,
			store_id: h,
			uniacid: i,
			code: a[0].value,
			name: a[2].value,
			py: a[5].value,
			unit: c,
			posprice: a[3].value,
			memberprice: a[4].value,
			is_membership: f,
			is_memberprice: d,
			commission_model: g == 2 ? 3 : 0,
			intercode: a[1].value,
		})
			.then(({ data }) => {
				if (data.status == 1) {
					notification.success({
						message: '提示',
						description: '商品新增成功',
					})
					this.props.delete_authorization()
					this.setState({
						show_append: false,
					})
				} else {
					notification.warning({
						message: '提示',
						description: '商品已存在',
					})
				}

			})

	}

	/**
	 * 同步信息
	 * */
	synchronize = () => {
		this.setState({
			show_mask: true,
			commonModalVisible: false,
			isshow: false,
			redshow: false,
			redshow_Inventory: false,
		}, async () => {
			try {
				let { data } = await synchronizedData()
				if (data == 1001) {
					notification.success({
						message: '提示',
						description: '更新成功'
					})
					this.setState({
						synchronize_value: 100,
					})
				}
				setTimeout(() => {
					window.history.go(0)
				}, 1000)
			} catch (e) {
			}
		})
		setInterval(() => {
			let { synchronize_value } = this.state
			if (synchronize_value == 100) {
				return
			}
			synchronize_value += 11 + Math.floor(Math.random() * 10)
			synchronize_value = synchronize_value >= 90 ? 90 : synchronize_value
			this.setState({
				synchronize_value
			})
		}, 1000)
	}

	/**
	 * 拖拽排序
	 */
	ranking = async () => {
		await syncCategoryGoods()
		this.props.changeSetting({
			orderby: true,
			showStock: false,
			rowsnum: 16,
			hasnum: false,
		})
		setTimeout(() => {
			window.open(window.location.href)
		}, 500)
		setInterval(() => {
			(() => {
				if (navigator.userAgent.indexOf("MSIE") > 0) {
					if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
						window.opener = null; window.close();
					}
					else {
						window.open('', '_top'); window.top.close();
					}
				}
				else if (navigator.userAgent.indexOf("Firefox") > 0) {
					window.location.href = 'about:blank '; //火狐默认状态非window.open的页面window.close是无效的    
					//window.history.go(-2);     
				}
				else {
					window.opener = null;
					window.open('', '_self', '');
					window.close();
				}
			})()
		}, 1000)
	}

	/**
	 * 关闭拖拽排序
	 */
	stop_ranking = () => {
		this.props.changeSetting({
			orderby: false,
		})
		setTimeout(() => {
			window.history.go(0)
		}, 500)
	}

	render() {
		const mask_style = {
			width: '100vw',
			height: '100vh',
			background: 'radial-gradient(rgba(255,255,255,1), rgba(255,255,255,0.8), rgba(255,255,255,0))',
			position: 'fixed',
			top: '0',
			left: '0',
			zIndex: '2000',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexFlow: 'column wrap',
			cursor: 'default',
		}
		let commonModal = this.renderCommonModal()

		let value = {}

		if (commonModal && commonModal.commonModalTitle) {
			let that = this
			switch (commonModal.commonModalTitle) {
				case '设置':
					value = {
						footer: [
							<Button
								key="back"
								onClick={() => this.setState({
									commonModalVisible: false,
									isshow: false,
									redshow: false,
									redshow_Inventory: false
								})}
							>取消</Button>,
							<Button key="submit" style={{ display: 'none' }}></Button>
						],
					}
					break
				case '同步信息':
					value = {
						footer: [
							<Button
								key="back"
								style={{ display: 'none' }}
							></Button>,
							<Button
								key="submit"
								onClick={this.synchronize}
								style={{
									color: '#fff',
									backgroundColor: '#FD7438',
									borderCcolor: '#FD7438',
								}}
							>
								确定
							</Button>
						],
					}
					break
				case '拖拽排序':
					value = {
						footer: [
							<Button
								key="back"
								style={{
									display: 'none',
								}}
							>
								关闭
							</Button>,
							<Button
								key="submit"
								onClick={this.ranking}
								style={{
									color: '#fff',
									backgroundColor: '#FD7438',
									borderCcolor: '#FD7438',
								}}
							>
								开启
							</Button>
						]
					}
					break
				case '储值明细':
					value = {
						onCancel() {
							that.setState({
								getRecorddata: '',
								commonModalVisible: false,
								isshow: false,
								redshow: false,
								redshow_Inventory: false,
							})
						},
						footer: null,
					}
					break
				default:
					value = {
						footer: null,
					}
					break
			}
		} else {
			value = {
				footer: null,
			}
		}

		return (
			<div
				className="left"
			>
				{
					this.state.show_mask ? <div
						style={mask_style}
					>
						<Progress type="circle" percent={this.state.synchronize_value} />
						<div
							style={{
								color: 'red',
								fontSize: '18px',
								paddingTop: '24px',
							}}
						>同步数据时请不要关闭页面或刷新页面，否则会导致数据丢失</div>
					</div> : null
				}
				<FooterBtnGroup
					store={this.props.store}
					onClick={this.onMoreMenuBtn.bind(this)}
					visible={this.state.visible}
					handleVisibleChange={this.handleVisibleChange}
					guide={this.props.guide}
					colorred={this.state.redshow}
					redshow_Inventory={this.state.redshow_Inventory}
				/>
				{
					commonModal && (
						<Modal
							zIndex={12}
							title={commonModal.commonModalTitle}
							width={commonModal.width}
							visible={this.state.commonModalVisible}
							onCancel={() => this.setState({
								commonModalVisible: false,
								isshow: false,
								redshow: false,
								redshow_Inventory: false,
							})}
							maskClosable={false}
							{...value}
						>
							<Fragment>
								{
									commonModal.element
								}
								<Verify
									visible={this.state.cz1128}
									on_click={() => {
										this.setState({
											cz1128: false,
										})
									}}
									callback={() => {
										this.setState({
											cz1128: false,
										}, () => {
											this.iterator.next()
										})
									}}
								/>
							</Fragment>
						</Modal>
					)
				}
				{/*<Modal*/}
				{/*title='会员退款'*/}
				{/*width='70%'*/}
				{/*visible={this.state.paybackModal}*/}
				{/*onOk={this.showpaybackModal}*/}
				{/*onCancel={this.handlepaybackModal}*/}
				{/*footer={null}*/}
				{/*maskClosable={false}*/}
				{/*>*/}
				{/*</Modal>*/}
				{
					this.state.show_append ? <Fragment>
						{
							!this.props.authority.data || this.props.authority.data.status == 2 ?
								<Verify on_click={this.off_append} /> : <Append
									off_append={this.off_append}
									itemaddsubmit={this.itemaddsubmit}
								/>
						}
					</Fragment> : null
				}
				{
					this.state.show_printStock ? <Modal
						closable={false}
						keyboard={false}
						maskClosable={false}
						visible={true}
						title='库存打印'
						onCancel={this.off_printStock}
						onOk={this.submit_printStock}
					>
						打印内容过多要占用较长时间，是否确认打印？
					</Modal> : null
				}
				{
					this.state.show_ftcgoods ? <Modal
						closable={false}
						keyboard={false}
						maskClosable={false}
						visible={true}
						title='一键传秤'
						onCancel={this.off_ftcgoods}
						onOk={this.submit_ftcgoods}
					>
						将向分体秤传送商品信息，如果传秤内容过多要占用较长时间，是否确认传秤？
					</Modal> : null
				}
				<WithModal
					footer={null}
					ref={(ref) => this.withmodal = ref}
					style={{ top: 20 }}
				/>
			</div>
		);
	}
}

// export default withRouter(connect(mapStateToProps)(FooterLeft))
export default withRouter(FooterLeft)