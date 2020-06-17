/**
 * file 设置
 */
import React, { Component } from 'react'
import { Modal, Menu, Dropdown, Form, Select, Layout, Divider, Badge, Icon, Switch, Button, notification } from 'antd'
import { TwitterPicker } from 'react-color'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { clearTare, fallbackVersion, getDeletelog } from '@/api'
import { changeSetting } from '@/action'
import styles from './index.module.less'

const { Content, Sider, Header, Footer } = Layout
const FormItem = Form.Item

const Option = Select.Option


const FONTSIZE = [
	{ title: '小', size: 8 },
	{ title: '中', size: 14 },
	{ title: '大', size: 17 },
]
const PRINTNUM = [
	{ title: '1', size: 1 },
	{ title: '2', size: 2 },
	{ title: '3', size: 3 },
]
const WITDSIZE = [
	{ title: '默认', size: 150 },
	{ title: '大', size: 190 },
]
const ColumnSzie = [
	{ title: '2', size: 2 },
	{ title: '3', size: 3 },
	{ title: '4', size: 4 },
]
const rowSzie = [
	{ title: '8', size: 8 },
	{ title: '12', size: 12 },
	{ title: '16', size: 16 },
	// { title: '20', size: 20 },
	// { title: '24', size: 24 },
	// {title: '28', size: 28},
	// {title: '34', size: 34},
	// {title: '38', size: 38},
]
const paytype = [
	{ title: '现金', pay_type: 0 },
	{ title: '微信扫码', pay_type: 1 },
	{ title: '支付宝扫码', pay_type: 2 },
	{ title: '会员余额', pay_type: 3 },
	// {title: '口碑支付', pay_type: 9},
	{ title: '个人微信', pay_type: 5 },
	{ title: '个人支付宝', pay_type: 6 },
	{ title: '购物卡', pay_type: 8 },
	{ title: '银行卡', pay_type: 4 },
]


const mapStateToProps = (state, ownProps) => ({
	setting: state.setting,
	store: state.store
})

class Setting extends Component {
	constructor(props) {
		super(props)
		this.state = {
			delete_onoff: false,
			ranking_onoff: false,
			rollback: false,
			a1025: false,
			is_pieces:localStorage.getItem('is_pieces')
		}
	}

	onFontSize = value => {
		this.props.changeSetting({ fontSize: value })
	}
	onPrintnum = value =>{
		localStorage.setItem('print_number',value)
	}
	onWidthSize = value => {
		this.props.changeSetting({ width: value })
	}
	onColumnSzie = value => {
		this.props.changeSetting({ columnNum: value })
	}
	oRowsnumSzie = value => {
		this.props.changeSetting({ rowsnum: value })
		setTimeout(() => {
			window.location.reload()
		}, 1500)
	}
	onLayout = value => {
		this.props.changeSetting({ layout: value })
		setTimeout(() => {
			window.location.reload()
		}, 1500)
	}
	onDeleteColor = index => {
		let categoryColor = this.props.setting.categoryColor.slice()
		categoryColor.splice(index, 1)
		this.props.changeSetting({ categoryColor })
	}

	onHandleChangeComplete = value => {
		let categoryColor = this.props.setting.categoryColor.slice();
		categoryColor.push(value.hex)
		this.props.changeSetting({ categoryColor })
	}
	onDeleteBgColor = index => {
		let goodbackground = this.props.setting.goodbackground.slice();
		goodbackground.splice(index, 1)
		this.props.changeSetting({ goodbackground })
	}
	onHandleChangegoodBg = value => {
		let goodbackground = this.props.setting.goodbackground ? this.props.setting.goodbackground.slice() : [];
		goodbackground.push(value.hex)
		this.props.changeSetting({ goodbackground })
	}
	onDeletepayTypeBgColor = index => {
		let paytypeBackground = this.props.setting.paytypeBackground.slice();
		paytypeBackground.splice(index, 1)
		this.props.changeSetting({ paytypeBackground })
	}
	onHandleChangepayTypeBg = value => {
		let paytypeBackground = this.props.setting.paytypeBackground ? this.props.setting.paytypeBackground.slice() : [];
		paytypeBackground.push(value.hex)
		this.props.changeSetting({ paytypeBackground })
	}

	onShowStock = value => {
		this.props.changeSetting({ showStock: value })
	}
	onisBig = value => {
		this.props.changeSetting({ isbig: value })
	}
	onshowGimg = value => {
		this.props.changeSetting({ isshowgimg: value })
	}

	onShowNum = value => {
		this.props.changeSetting({ hasnum: value })
	}

	onorderNumber = value => {
		this.props.changeSetting({ sw_orderNumber: value })
	}
	onis_tabulate = value => {
		this.props.changeSetting({ is_tabulate: value })
	}
	onis_pieces = value => {
		if(value){
			localStorage.setItem('is_pieces','1')
		}else{
			localStorage.setItem('is_pieces','2')
		}
		// localStorage.setItem('is_pieces',value)
	}
	isRemake = value => {
		if(value){
			localStorage.setItem('isRmake','1')
		}else{
			localStorage.setItem('isRmake','2')
		}
		setTimeout(() => {
			window.location.reload()
		}, 1000)
		// localStorage.setItem('is_pieces',value)
	}
	wifi_print = value => {
		console.log(value)
		if(value){
			localStorage.setItem('wifi_print','1')
		}else{
			localStorage.setItem('wifi_print','2')
		}
	}
	isMemberMsg = value =>{
		console.log(value)
		if(value){
			localStorage.setItem('isMemberMsg','1')
		}else{
			localStorage.setItem('isMemberMsg','2')
		}
		setTimeout(() => {
			window.location.reload()
		}, 1000)
	}
	onVoice = v => {
		this.props.changeSetting({ Voice: v })
	}
	onremove = v => {
		this.props.changeSetting({ remove: v })
	}
	onA = v => {
		this.props.changeSetting({ a: v ? 1 : 0 })
	}
	handleisFissionScale = v => {
		this.props.changeSetting({ isFissionScale: v })
	}
	onothejoin = value => {
		this.props.changeSetting({ thejoiningtogetheroftwoyards: value })
	}

	onTemp = value => {
		this.props.changeSetting({ istemp: value })
		setTimeout(() => {
			window.location.reload()
		}, 1000)
	}
	onInventory = v => {
		this.props.changeSetting({ Inventory: v })
		setTimeout(() => {
			window.location.reload()
		}, 1000)
	}
	onshowpayType = (index, value) => {
		console.log(index, value)
		let payType = this.props.setting.payType.slice();
		payType[index] = value
		console.log(payType[index], this.props.setting.payType)
		this.props.changeSetting({ payType })
	}
	onShowisblod = value => {
		this.props.changeSetting({ isblod: value })
	}
	onTeashop = value => {
		this.props.changeSetting({ teashop: value })
	}
	onShowisweight = value => {
		console.log(value)
		this.props.changeSetting({ isweight: value })
		setTimeout(() => {
			window.location.reload()
		}, 1500)
	}

	onChange1126 = (type) => (value) => {
		this.props.changeSetting({ [type]: value })
	}

	clearTare() {
		clearTare().then(res => {
			if (res.data == 1) {
				notification.open({
					message: '提示',
					description: '重量置零成功',
					onClick: () => {
						console.log('Notification Clicked!');
					},
				});
			} else {
				notification.open({
					message: '提示',
					description: '重量置零失败',
					onClick: () => {
						console.log('Notification Clicked!');
					},
				});
			}
		})
	}

	morenzffs = value => {
		this.props.changeSetting({ payNum: value })
	}

	render() {
		const style1126 = {
			textAlign: 'center',
			fontSize: '14px',
			lineHeight: '24px',
			border: '1px solid rgb(200, 200, 200)',
			borderRadius: '4px',
			cursor: 'default',
			width: '120px',
		}
		const { setting } = this.props
		const defaultFontSzie = FONTSIZE.find((v, i) => v.size === setting.fontSize)
		// const defaultPrintnum = PRINTNUM.find((v, i) => v.size === setting.printNum)
		const defaultColumnSzie = ColumnSzie.find((v, i) => v.size === setting.columnNum)
		const defaultrowsnumSzie = rowSzie.find((v, i) => v.size === setting.rowsnum)
		const defaultPrintnum = localStorage.getItem('print_number') ? localStorage.getItem('print_number') : 1 
		return (
			<div>
				<Form layout="inline" className='forml'>
					
					<FormItem
						label="字体大小"
					>
						<Select defaultValue={defaultFontSzie.title || '默认'} size="large" onChange={this.onFontSize}>
							{
								FONTSIZE.map((item, index) => <Option value={item.size} key={`font${index}`}>{item.title}</Option>)
							}
						</Select>
					</FormItem>
					<FormItem
						label="商品列数"
					>
						<Select defaultValue={defaultColumnSzie ? defaultColumnSzie.title : '2'} size="large"
							onChange={this.onColumnSzie}>
							{
								ColumnSzie.map((item, index) => <Option value={item.size} key={`font${index}`}>{item.title}</Option>)
							}
						</Select>
					</FormItem>
					<FormItem
						label="商品数量"
					>
						<Select defaultValue={defaultrowsnumSzie ? defaultrowsnumSzie.title : '16'} size="large"
							onChange={this.oRowsnumSzie}>
							{
								rowSzie.map((item, index) => <Option value={item.size} key={`font${index}`}>{item.title}</Option>)
							}
						</Select>
					</FormItem>
					<FormItem
						label="小票联数"
					>
						<Select defaultValue={defaultPrintnum || '默认'} size="large" onChange={this.onPrintnum}>
							{
								PRINTNUM.map((item, index) => <Option value={item.size} key={`font${index}`}>{item.title}</Option>)
							}
						</Select>
					</FormItem>
					<FormItem
						label="支付框变大"
						style={{ marginLeft: '1px' }}
					>

						<Switch defaultChecked={setting.isbig} onChange={this.onisBig} />
					</FormItem>
					<FormItem
						label="显示商品图"
					>
						<Switch defaultChecked={setting.isshowgimg} onChange={this.onshowGimg} />
					</FormItem>
					<FormItem
						label="字体加粗"
					>
						<Switch defaultChecked={setting.isblod} onChange={this.onShowisblod} />
					</FormItem>
					<FormItem
						label="显示库存"
						style={{ marginLeft: '8px' }}
					>
						<Switch defaultChecked={setting.showStock} onChange={this.onShowStock} />
					</FormItem>
					{
						this.props.store.data.weight == 'TUOLIDUO' || this.props.store.data.weight == 'ZHONGKEYINTAI' ? <FormItem
							label="自动称重"
						>
							<Switch defaultChecked={setting.isweight} onChange={this.onShowisweight} />
						</FormItem> : null
					}
					<FormItem
						label="温度预警"
					>
						<Switch defaultChecked={setting.istemp} onChange={this.onTemp} />
					</FormItem>
					<FormItem
						label="库存预警"
					>
						<Switch defaultChecked={setting.Inventory} onChange={this.onInventory} />
					</FormItem>
					
					<div
						className={styles.w}
					>
						默认打印不干胶:&nbsp;&nbsp;<Switch defaultChecked={setting.istemp} onChange={this.onTeashop} />
					</div>
					<FormItem
						label="弹窗输入数量"
					>
						<Switch defaultChecked={setting.hasnum} onChange={this.onShowNum} />
					</FormItem>
					
					<FormItem
						label="序号打印"
					>
						<Switch defaultChecked={setting.sw_orderNumber} onChange={this.onorderNumber} />
					</FormItem>
					<FormItem
						label="称重不叠加"
					>
						<Switch defaultChecked={setting.is_tabulate} onChange={this.onis_tabulate} />
					</FormItem>
					<FormItem
						label="计件不叠加"
					>
						<Switch defaultChecked={localStorage.getItem('is_pieces')=='1'?true:false} onChange={this.onis_pieces} />
					</FormItem>
					<FormItem
						label="语音播报"
					>
						<Switch defaultChecked={setting.Voice} onChange={this.onVoice} />
					</FormItem>
					<FormItem
						label="删除原因"
					>
						<Switch defaultChecked={setting.remove} onChange={this.onremove} />
					</FormItem>
					<FormItem
						label="非首字母搜索"
					>
						<Switch defaultChecked={setting.a} onChange={this.onA} />
					</FormItem>
					<FormItem
						label="只现金开钱箱"
					>
						<Switch defaultChecked={setting.xj1126} onChange={this.onChange1126('xj1126')} />
					</FormItem>
					{/* <FormItem
						label="分体秤"
					>
						<Switch defaultChecked={setting.isFissionScale} onChange={this.handleisFissionScale} />
					</FormItem> */}
					{/* <FormItem
						label="二码合一"
					>
						<Switch defaultChecked={setting.thejoiningtogetheroftwoyards} onChange={this.onothejoin} />
					</FormItem> */}
					{
						this.props.store.data.weight == 'TUOLIDUO' || this.props.store.data.weight == 'ZHONGKEYINTAI' ?
							<FormItem
								label="清零"
							>
								<Button onClick={this.clearTare.bind(this)}>重量清零</Button>
							</FormItem> :
							''
					}
					<FormItem
						label="挂单备注"
					>
						<Switch defaultChecked={localStorage.getItem('isRmake')=='1'?true:false} onChange={this.isRemake} />
					</FormItem>
					<FormItem
						label="会员区消费信息"
					>
						<Switch defaultChecked={localStorage.getItem('isMemberMsg')=='1'?true:false} onChange={this.isMemberMsg} />
					</FormItem>
					<FormItem
						label="挂单wifi打印"
					>
						<Switch defaultChecked={localStorage.getItem('wifi_print')=='1'?true:false} onChange={this.wifi_print} />
					</FormItem>
				</Form>
				<Divider>支付方式设置</Divider>
				<Form layout="inline" className='forml form2'>
					{paytype.map((item, index) => (
						<FormItem
							label={item.title}
						>
							<Switch defaultChecked={this.props.setting.payType[index]}
								onChange={(value) => this.onshowpayType(index, value)} />
						</FormItem>
					))}
					<div
						className={styles.w}
						style={{ width: '400px' }}
					>
						默认支付方式：<Select
							defaultValue={paytype[this.props.setting.payNum] ? paytype[this.props.setting.payNum].title : '默认'}
							style={{ width: '120px' }}
							onChange={this.morenzffs}
						>
							{
								paytype.map((item, index) => {
									return this.props.setting.payType[index] ? (
										<Option value={item.pay_type} key={`font${index}`}>{item.title}</Option>
									) : null
								})
							}
						</Select>
					</div>
				</Form>
				<Divider>布局选择</Divider>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Layout onClick={() => this.onLayout('style1')}>
						<Header style={{ height: 40, backgroundColor: 'rgba(16, 142, 233, .3)' }} />
						<Layout style={{ height: 80 }}>
							<Sider width={15} style={{ backgroundColor: 'rgba(16, 142, 233, .5)' }} />
							<Content style={{ backgroundColor: 'rgba(16, 142, 233, 1)' }} />
							<Sider width={50} style={{ backgroundColor: 'rgba(16, 142, 233, .5)' }} />
						</Layout>
						<Footer style={{ height: 40, backgroundColor: 'rgba(16, 142, 233, .3)' }} />
					</Layout>
					<Layout onClick={() => this.onLayout('style2')} style={{ marginLeft: 20 }}>
						<Header style={{ height: 40, backgroundColor: 'rgba(16, 142, 233, .3)' }} />
						<Layout style={{ height: 80 }}>
							<Sider width={50} style={{ backgroundColor: 'rgba(16, 142, 233, .5)' }} />
							<Content style={{ backgroundColor: 'rgba(16, 142, 233, 1)' }} />
							<Sider width={15} style={{ backgroundColor: 'rgba(16, 142, 233, .5)' }} />
						</Layout>
						<Footer style={{ height: 40, backgroundColor: 'rgba(16, 142, 233, .3)' }} />
					</Layout>
				</div>
				<Divider>分类颜色调整</Divider>
				<div className='mr'>
					<div style={{ marginBottom: 10 }}>
						{setting.categoryColor.map((item, index) => (
							<div key={`categoryColor${index}`} style={{ display: 'inline-block', marginLeft: 20 }}
								onClick={() => this.onDeleteColor(index)}>
								<Badge count={<Icon type="close" />}>
									<div style={{
										display: 'inline-block',
										width: 40,
										height: 40,
										backgroundColor: `${item}`,
										borderRadius: 4,
										borderStyle: 'solid',
										borderWidth: 1,
										borderColor: '#aaa'
									}} />
								</Badge>
							</div>
						))}
					</div>
					<TwitterPicker onChangeComplete={this.onHandleChangeComplete} />
				</div>
				<Divider>商品背景色</Divider>
				<div className='mr'>
					<div style={{ marginBottom: 10 }}>
						{setting.goodbackground ? setting.goodbackground.map((item, index) => (
							<div key={`goodbackground${index}`} style={{ display: 'inline-block', marginLeft: 20 }}
								onClick={() => this.onDeleteBgColor(index)}>
								<Badge count={<Icon type="close" />}>
									<div style={{
										display: 'inline-block',
										width: 40,
										height: 40,
										backgroundColor: `${item}`,
										borderRadius: 4,
										borderStyle: 'solid',
										borderWidth: 1,
										borderColor: '#aaa'
									}} />
								</Badge>
							</div>
						)) : ''}
					</div>
					<TwitterPicker onChangeComplete={this.onHandleChangegoodBg} />
				</div>
				<Divider>支付背景色(顺序依次对应支付顺序)</Divider>
				<div className='mr'>
					<div style={{ marginBottom: 10 }}>
						{setting.paytypeBackground ? setting.paytypeBackground.map((item, index) => (
							<div key={`paytypeBackground${index}`} style={{ display: 'inline-block', marginLeft: 20 }}
								onClick={() => this.onDeletepayTypeBgColor(index)}>
								<Badge count={<Icon type="close" />}>
									<div style={{
										display: 'inline-block',
										width: 40,
										height: 40,
										backgroundColor: `${item}`,
										borderRadius: 4,
										borderStyle: 'solid',
										borderWidth: 1,
										borderColor: '#aaa'
									}} />
								</Badge>
							</div>
						)) : ''}
					</div>
					<TwitterPicker onChangeComplete={this.onHandleChangepayTypeBg} />
				</div>
				<div
					style={{
						paddingTop: "32px",
						display: "flex",
						justifyContent: "space-evenly",
						alignItems: "center",
					}}
				>
					<div
						style={style1126}
						onClick={() => this.setState({ delete_onoff: true })}
					>
						清除收银缓存
					</div>
					<div
						style={style1126}
						onClick={() => {
							Modal.confirm({
								content: '确定清除本地日志',
								onOk: () => getDeletelog()
							})
						}}
					>
						清除本地日志
					</div>
					<div
						style={style1126}
						onClick={() => this.setState({ rollback: true })}
					>
						回退至上一版本
					</div>
					<div
						style={style1126}
						onClick={() => this.setState({ a1025: true })}
					>
						历史版本介绍
					</div>
				</div>
				<Modal
					visible={this.state.delete_onoff}
					onOk={() => {
						let store = JSON.parse(localStorage.getItem('__order'))
						store.orderIndex = 0
						localStorage.removeItem('__order')
						localStorage.setItem('__order', JSON.stringify(store))
						this.setState({ delete_onoff: false })
					}}
					onCancel={() => this.setState({ delete_onoff: false })}
				>
					清除收银缓存会导致购物台商品还原
        </Modal>
				<Modal
					visible={this.state.rollback}
					onOk={() => {
						this.props.history.push({
							pathname: '/update',
							query: {
								rollback: true,
							}
						})
						this.setState({ rollback: false })
					}}
					onCancel={() => this.setState({ rollback: false })}
				>
					请确认回退至上一版本
				</Modal>
				<Modal
					visible={this.state.a1025}
					onOk={() => {
						this.setState({ a1025: false })
					}}
					onCancel={() => this.setState({ a1025: false })}
					width={800}
					title="历史版本介绍"
				>
					<p
						style={{
							whiteSpace: "pre-wrap",
						}}
					>
					<h3 style={{ padding: 0 }}>火蝶云收银台v1.6.3.6.1   2020-05-29</h3>
						{`
1.本版本需要360安全浏览器v10以上的支持。
2.增加了收银端会员信息查询的功能，可通过会员姓名或手机号的部分信息来找到会员。
3.增加了收银端会员订单查询的功能，根据条件列出所有的会员订单信息。
4.增加了个人微信或个人支付宝支付时，二维码直接显示在副屏的功能。
5.增加了挂单可以通过wifi打印机打印的功能。
6.优化了称重不叠加关闭时，相同商品的不同重量可以累加在一起的功能。
7.优化了打包商品报损时的提示问题。
8.优化了非首字母搜索结果有多页时的展示问题。
9.优化了动态付款码的功能。
`}
					
						<h3 style={{}}>火蝶云收银台v1.6.3.6.0   2020-05-09</h3>
						{`
1.本版本需要360安全浏览器v10以上的支持。
2.增加了收银端修改会员信息的功能，包括姓名，手机，密码等。
3.增加了收银端积分商城的功能，与公众号个人中心的积分商城互通。
4.增加了中科因泰机型交班单的新格式。
5.优化了会员中心的信息展示。
6.优化了挂单备注的交互。
7.优化了退款时优惠价格的处理。
8.优化了动态付款码的功能。
`}
						<h3 style={{  }}>火蝶云收银台v1.6.3.5.9   2020-04-27</h3>
						{`
1.本版本需要360安全浏览器v10以上的支持。
2.增加了全场折扣单区分门店的功能。
3.增加了挂单备注，挂单打印，挂单跨天的功能。
4.增加了退款单的补打功能。
5.增加了交班单打印客单价的功能。
6.增加了多款收银打印机的适配。
7.优化了部分退款。
`}
						<h3 style={{ }}>火蝶云收银台v1.6.3.5.8   2020-04-16</h3>
						{`
1.本版本需要360安全浏览器v10以上的支持。
2.增加了在会员登录信息面板处修改会员密码的功能。
3.增加了小票打印商品序号的功能。
4.增加了小票保护会员隐私的功能。
5.增加了会员登录后副屏用*号代替会员部分信息的功能。
6.增加了挂单没被收银，挂单时间一直保持不变的功能。
7.增加了会员退款成功后发送提醒模版消息的功能。
8.优化了退款时优惠价格的处理。
9.优化了会员价小计打折的功能。
`}
						<h3 style={{  }}>火蝶云收银台v1.6.3.5.7   2020-04-04</h3>
						{`
1.本版本需要360安全浏览器v10以上的支持。
2.增加了小票打印一式多份的功能，商家可以自行选择打印的联数。
3.增加了会员手机号码在小票上的显示，商家可以自行选择是否开启。
4.增加了在商品报损时的备注功能。
5.增加了会员在余额支付时余额是否充足的提示。
6.优化了收银小票在部分退款时的打印。
`}
						<h3 style={{  }}>火蝶云收银台v1.6.3.5.6   2020-03-09</h3>
						{`
1.本版本需要360安全浏览器v10以上的支持。
2.增加了火蝶云收银台线下收银的兼职功能，线下收银也可以做分销推广了。
3.增加了火蝶云收银台对商品是否允许会员余额支付的设置。
4.增加了火蝶云收银台对收银商品报损的权限。
5.增加了火蝶云收银台对收银员最大打折折扣的自定义设置。
6.增加了火蝶云收银台对点击商品弹窗修改价格和数量的设置。
7.增加了火蝶云收银台对退款单子的筛选。
8.增加了火蝶云收银台对收银单品明细的汇总。
9.优化了收银小票优惠时的打印和断网时的打印，增加了订单一维码的打印。
10.优化了收银商品档案更改价格而收银界面未刷新时收银不成功的提示。
`}
						<h3 style={{ }}>火蝶云收银台v1.6.3.5.5   2019-12-24</h3>
						{`
1.本版本需要360安全浏览器v10以上的支持。
2.增加了火蝶云收银台的一键传秤功能，商品档案的商品信息可以通过一键传秤同步到分体秤。
3.增加了火蝶云收银台对超市价格标签的打印。
4.增加了火蝶云收银台对交班单当班差额的打印。
5.增加了火蝶云收银台对收银明细的筛选，收银端可以通过金额范围查找出特定订单。
6.增加了火蝶云收银台对储值明细的支付方式显示。
7.优化了储值退款成功后会员余额的显示。
8.优化了会员余额支付在未输入会员号码时的使用情景，按钮将变灰不可用。
9.优化了断网时打开钱箱功能。
10.优化了减免折扣开启后输入时的自动对焦功能。
11.优化了积分抵扣的样式和最大抵扣的限制。
`}
						<h3>火蝶云收银台v1.6.3.5.4   2019-12-02</h3>
						{`
1.本版本需要360安全浏览器v10以上的支持。
2.增加了火蝶云收银台的优惠券入口，客户通过公众号领取优惠券，线下购物时可以在收银端减免。
3.增加了火蝶云收银台的预付款订金减免入口，客户通过公众号下的预付款订金订单，线下收银核销时补上余款就行。
4.增加了火蝶云收银台在小计改价时的权限，在订单退款时的权限，在储值退款时的权限。
5.增加了火蝶云收银台对减免折扣和抹零功能的分离，商家可以单独启用。
6.增加了火蝶云收银台对会员消费次数和平均消费金额的显示。
7.增加了火蝶云收银台在商品调价时对会员价的调价。
8.增加了火蝶云收银台在商品报损时对称重报损的支持。
9.增加了火蝶云收银台在小票补打时对会员余额和会员积分的打印支持。
10.增加了火蝶云收银台“只现金开钱箱”功能。部分打印机需要手动关掉打印机和钱箱的关联。
11.增加了火蝶云收银台“清除本地日志”功能。
`}
						<h3>火蝶云收银台v1.6.3.5.3   2019-10-28</h3>
						{`
1.本版本需要360安全浏览器v10以上的支持。
2.增加了火蝶云收银台对非首字母搜索功能的支持。
3.增加了火蝶云收银台对挂单信息进行存库再读取的功能。
4.增加了火蝶云收银台对个人支付宝和个人微信两种支付方式显示商家二维码的功能。
5.增加了火蝶云收银台对开启了会员短信验证和会员消费短信的商家，当商家后台短信数量不足时进行提醒的功能。
6.增加了火蝶云收银台对单笔支付超过100万的订单进行了限制支付的功能。
7.增加了火蝶云收银台对历史版本介绍的展示。
8.优化了分体秤的扫码兼容，无需单独启用开关。
9.优化了实体会员卡刷卡免密功能。
10.优化了采购报单由采购单转为采购申请单。
11.优化了购物台删除原因的显示。
`}
						<h3>火蝶云收银台v1.6.3.5.2   2019-09-28</h3>
						{`
说明：本次更新需要360安全浏览器v10以上支持，如果浏览器版本过低，请先行下载最新的360安全浏览器。浏览器版本太低导致的不兼容可以在收银设置点击“回退至上一版本”继续使用，在更新了浏览器后可再次更新收银。

1.增加了火蝶云收银台对分体秤的匹配。收银时扫码分体秤打印的价格标签，就可以自动读取客户购买的商品信息和价格信息。
2.增加了火蝶云收银台对满赠满减限购换购等多种促销方式的支持。在管理后台设置相应条件即可。
3.增加了火蝶云收银台对会员余额支付扫码校验和密码校验两种检验的统一。在开启了扫码校验和密码校验的商家，两种校验方式可以并存。
4.增加了火蝶云收银台对口碑帐户的匹配。
5.增加了回退至上一版本功能。
6.优化了收银台新增商品时，会员价非必填和国际条形码的输入。
7.优化了收银台称重商品不叠加显示。
8.优化了收银台商品查询功能和拖动排序功能。
9.优化了存在小计为零的订单提示和60秒后再次确认支付是否成功的提示。
10.优化了无网络时个人支付宝和个人微信支付订单小票的打印。
`}
						<h3>火蝶云收银台v1.6.3.5.1  2019-09-06</h3>
						{`
1.增加了火蝶云收银台的管理后台商品档案新增或修改商品名称时，首字母搜索自动生成功能。商家可以手动修改首字母。
2.增加了火蝶云收银台的管理后台商品档案新增商品时，商品条码按分类编码加四位序号自动生成功能。商家可以手动修改商品条码。
3.增加了火蝶云收银台的管理后台门店零售价的筛选，包括已上架和未上架筛选，会员价和非会员价筛选，热销商品和非热销商品筛选，会员权益和非会员权益筛选。
4.增加了火蝶云收银台对热销分类显示的支持。在管理后台门店设置里开启热销分类，设定热销分类的名称，则收银端分类的最上排会显示热销分类。
5.增加了火蝶云收银台商品拖动排序的功能。同时兼容点击商品右下角的序号，通过修改序号的方式对商品显示进行排序。
6.增加了火蝶云收银台收银会员与其他途径注册的会员的统一和通用，比如客户已在小程序端注册，那么绑定后两者通用会员。
7.优化了储值退款流程，增加了储值退款的面额和余额选项，增加了退款小票打印当下的会员余额。
8.优化了称重商品在修改数量时的显示样式。
9.优化了充值模版未设置时页面的显示样式。
`}
						<h3>火蝶云收银台v1.6.3.5.0  2019-08-21</h3>
						{`
1.增加了火蝶云收银台前端同步数据按钮，收银端可以主动发起同步商品数据和订单数据。
2.增加了火蝶云收银台前端对有会员价的商品，登入会员时显示红色会员价。
3.增加了火蝶云收银台前端商品加到购物台时，价格为零的商品在购物台背景色显示为红色。
4.增加了火蝶云收银台的管理后台商品档案一键上下架商品功能。
5.优化了收银菜单，把收银单、储值单、交班单都放到交易菜单里，并改名称为收银明细，储值明细和交班记录。
6.优化了混合支付展示的部分功能。
`}
						<h3>火蝶云收银台v1.6.3.4.9  2019-08-07</h3>
						{`
1.增加了火蝶云收银台前端注册会员时，可以自行开启是否设置密码，设置了密码的客户在支付时可以输入密码校验。
2.增加了火蝶云收银台对会员在余额支付后发送短信通知的功能，可以自行设置是否开启。
3.增加了火蝶云收银台前端对外接键盘的支持。收银机本身自带触屏键盘，但物理键盘输入更加快捷。
4.增加了火蝶云收银台对指定导购功能的兼容。指定导购可选择公众号上的导购会员或者后台门店管理收银员里的导购。
5.增加了火蝶云收银台收银机识别号，实现一机一号。
6.优化了收银明细和储值明细的日期显示样式。
7.优化了前端清除收银缓存按钮，清除缓存时将不清除挂单和收银设置。
`}
						<h3>火蝶云收银台v1.6.3.4.8  2019-07-10</h3>
						{`
1.增加了火蝶云收银台的管理后台收银分类可以自定义设置序号以调整前端分类按序号展示的功能。
2.增加了火蝶云收银台的管理后台对商品调价进行记录和查询的功能。
3.增加了火蝶云收银台的管理后台对购物台商品删除进行记录和查询的功能。
4.增加了火蝶云收银台前端对库存进行预警的功能。
5.增加了火蝶云收银台前端对线上订单核销后打印小票功能。
6.增加了火蝶云收银台前端通过商户单号反查订单的功能。
7.增加了火蝶云收银台对收银支付进行语音播报的功能。
8.增加了火蝶云收银台对相同称重商品多次购买可以分开列出展示和打印的功能。
9.优化了商品多种优惠同时存在时的小票打印。
`}
						<h3>火蝶云收银台v1.6.3.4.7  2019-06-28</h3>
						{`
1.增加了火蝶云收银台对商品规格和属性的显示，适配了蛋糕店奶茶店等场景的收银。
2.增加了火蝶云收银台小票对不干胶打印机的适配。
3.增加了火蝶云收银台小票对原价总额的显示，使优惠信息更加明显。
4.增加了火蝶云收银台自定义收银默认支付方式的功能，可以自行设定默认的支付方式。
5.增加了火蝶云收银台商品调拨的管理员权限，并优化了权限的两种方式，扫码或密码输入。
6.优化了总价减免里首次输入小数点价格输不进去的问题。
7.优化了首页刷新后扫码能扫出商品，无法自动添加到购物台的问题。
8.优化了改价功能，不允许改价为零。
9.优化了8位数条码的扫码输入。
`}
						<h3>火蝶云收银台v1.6.3.4.6  2019-06-06</h3>
						{`
1.增加了火蝶云收银台断网时登入无法找到交班单问题。
2.增加了火蝶云收银台的盲交功能，收银员只有交班后才能看到当班时的汇总情况。
3.优化了商品改价时的搜索功能。
4.优化了数字键盘第一次输入时自动清空问题。
5.优化了收银端更新包下载时的速度。
6.优化了总价减免后支付时小键盘输入的数字连锁变动问题。
7.优化了首页点击分类后再搜索时的退出问题。
`}
					</p>
				</Modal>
				<div
					style={{
						textAlign: 'center',
						opacity: 0.5,
						marginTop: '30px',
						whiteSpace: "pre-wrap",
					}}
				>火蝶云收银台v1.6.3.6.1                 build版本:3.1.6.1</div>
			</div>
		)
	}
}


export default withRouter(connect(mapStateToProps, { changeSetting })(Setting))
