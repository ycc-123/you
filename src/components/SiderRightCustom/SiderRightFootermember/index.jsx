import React, { Component } from 'react'
import { Row, Col, Icon, Button, Modal, Radio, Input, message, notification, Tag, Form, Spin } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import {SettingOutlined} from '@ant-design/icons'
import NumericKeypad, { onVirtualKeyboard, fat_num } from '@/widget/NumericKeypad'
import { getMember, clearMember, updateMember, resetOrderList, updatamb } from '@/action'
import { getrecharge, addrecharge, checkRecharge, getRole, getmember as updatamember,addmember,scoreGoods,scoreExchange,getstore,removeScore} from '@/api'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Verify from '@/widget/PrivilegeVerifier'
const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const PAYEMNTMETHODS = [
	{ title: '现金', pay_type: 0 },
	{ title: '微信扫码', pay_type: 1 },
	{ title: '支付宝扫码', pay_type: 2 },
	{ title: '银行卡', pay_type: 4 },
	{ title: '个人微信', pay_type: 5 },
	{ title: '个人支付宝', pay_type: 6 }
]

const mapStateToProps = (state, ownProps) => ({
	member: state.member,
	fullsub: state.fullsub,
	sale: state.sale,
	order: state.order,
	setting: state.setting,
})

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
	clearMember,
	getMember,
	updateMember,
	resetOrderList,
	updatamb,
}, dispatch)

class SiderRightFootermember extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			visible: false,
			serialNumber: false, //银行流水号输入框
			pay_type: 0, //支付方式
			memberdata: props.member.data, //会员信息
			RechargeList: [], //充值金额规格
			auth_code: '', //付款码一维码号
			member_amount: '0', //自定义充值面额
			member_selling: '0', //自定义充值金额
			layout: true, //自定义充值金额view与充值选项
			focusInputName: 'member_selling',
			countInter: 59,
			confirmLoading: false,
			showSetting:false,
			shwoVerify:false,
			showExchange:false,
			scoreGoodses:[],
			card_color:'#ccc',
			scoreIpt:''
		}
		this.iterator = {}
		this.sti = null
	}

	componentDidMount() {
		
		
		let temporaryDiscount = this.temporaryDiscount(this.state.memberdata.level)
		temporaryDiscount && this.props.updateMember(temporaryDiscount.value)

		this.sti =  (async () => {
			console.log(123123)
			if(localStorage.getItem('genxinmember') == 'true'){
				const { data } = this.props.member;
				let {data:{msg}} = await updatamember(data.member_mobile)
				if (Object.is(JSON.stringify(msg), JSON.stringify(data))) return false
				this.props.updatamb(msg)
				localStorage.setItem('genxinmember',false)
				// clearInterval(this.sti)
			}
		}, 2000);
		
	}

	componentWillUnmount() {
		clearInterval(this.sti)
	}

	hideModalTitile() {
		this.setState({
			loading: false,
			auth_code: '',
			confirmLoading: false,
		})
	}

	showModal() {
		// 权限
		getRole()
			.then(res => {
				if (res.data.msg != null && res.data.msg.hasOwnProperty("power_recharge")) {
					this.setState({
						visible: true,
						powerRecharge: "inline-block"
					})
				
				} else {
					this.setState({
						visible: true,
						powerRecharge: "none"
					})
				}
			})
			.catch(error => {
				console.log(error)
			})

		getrecharge()
			.then(res => {

				this.setState({
					visible: true,
					RechargeList: res.data.msg ? res.data.msg : [],
				})
			})
			.catch(error => {
				console.log(error)
			})

	}
	showSetting(){
		// localStorage.setItem('settingPsw','1')
		console.log(this.state.memberdata)
		this.setState({
			showSetting:true,

			member_mobile:this.state.memberdata.mobile,
			member_name:this.state.memberdata.name
		})

	}
	shwoVerify(){
		console.log(this.props)
		getstore().then(res=>{
			console.log(res.data.show_modifymemberinfo_permission)
			let isshwoVerify = res.data.show_modifymemberinfo_permission
			if(isshwoVerify=="1"){
				//不开启
				this.showSetting()
			}else{
				this.setState({
					shwoVerify:true
				})
			}
		})
		
	}
	* handleOk() {
		this.setState({
			confirmLoading: true,
		});
		let { pay_type, layout, member_amount, member_selling } = this.state
		let { member } = this.props
		let member_id = member.data.id
		let recharge_id = layout ? this.state.addid : 'user_defined'

		const ordersuccessed = () => {
			this.props.getMember(member.data.mobile)
				.then(res => {
					let temporaryDiscount = this.temporaryDiscount(res.level)
					temporaryDiscount && this.props.updateMember(temporaryDiscount.value)
					this.setState({
						layout: true,
						visible: false,
						loading: false,
						confirmLoading: false,
						memberdata: res,
						auth_code: '',
						member_amount: '0',
						member_selling: '0',
					})
				})
		}

		yield (() => {
			if (!layout && !(Number(member_amount) || Number(member_selling))) {
				/*自定义充值下，没有填写充值金额和充值面额 */
				notification.error({
					message: '检查金额',
					description: '请检查充值面额和付款金额',
				})
				return
			} else {
				//同步代码执行完成 调用
				setTimeout(() => {
					this.iterator.next()
				}, 0)
			}
		})()

		yield (() => {
			var date = new Date();

			let that = this
			if (pay_type === 1 || pay_type === 2) {
				notification.info({
					message: '扫码支付',
					description: '扫描顾客付款码',
				})
				this.textInput.focus()
				this.setState({ loading: true })
				this.setState({
					countInter: 59
				}, () => {
					let count = this.state.countInter

					const timer = setInterval(() => {
						this.setState({
							countInter: (count--),
						}, () => {
							console.log(this.state.countInter)
							if (count === 0) {
								if (this.state.loading) {
									Modal.success({
										title: '等待支付超时/网络阻塞',
										content: '点击【确定】按钮返回支付页面,如提示支付失败请重新发起支付。',
										okText: '确定',
										className: 'paymentModal',
										iconType: 'check-circle',
										onOk() {
											// console.log(this)

											that.hideModalTitile()
										}
									});
								}
								clearInterval(timer);
								this.setState({
									liked: true,
									countInter: 0,
								})
							}
							if (!this.state.loading) {
								console.log(count + 'ting')
								clearInterval(timer);
								this.setState({
									liked: true,
									countInter: 0,
								})
							}
						});
					}, 1000);
				})
			} else {
				//同步代码执行完成 调用
				setTimeout(() => {
					this.iterator.next()
				}, 0)
			}
		})()

		yield addrecharge({
			member_id,
			recharge_id,
			pay_type,
			member_amount,
			member_selling,
			auth_code: this.state.auth_code,
			createid: this.props.sale.data.id,
			soundSwitch: this.props.setting.Voice ? 1 : 0,
			print_number:localStorage.getItem('print_number')?localStorage.getItem('print_number'):1
		})
			.then(res => {
				// message.info(res.data.data)

				// 返回值状态 1002 充值成功 2002错误异常 2003等待支付 2005 订单已关闭
				if (res.data.status === 1002) {
					ordersuccessed()
				}
				if (res.data.status === 2002) {
					// notification.error({
					// 	message: "提示",
					// 	description: res.data.msg
					//   });
					this.setState({
						visible: false,
						loading: false,
						countInter: 59,
						confirmLoading: false,
						layout: true,
						auth_code: '',
					})

				}
				if (res.data.status === 2003) {
					let obj = {
						recordid: res.data.msg,
						num: 1
					}
					//查询订单是否支付成功
					const searchCheckPay = async (obj) => {
						obj.print_number = localStorage.getItem('print_number')?localStorage.getItem('print_number'):1
						let args = await checkRecharge(obj)
						if (args && args['data']) {
							let { data } = args
							if (data.status === 1002 || data.status === 2002) {
								ordersuccessed()
							}
							if (data.status === 2003 || data instanceof Array) {
								setTimeout(() => {
									obj.num += 1
									searchCheckPay(obj)
								}, 3000)
							}
						} else {
							setTimeout(() => {
								obj.num += 1
								searchCheckPay(obj)
							}, 3000)
						}
					}
					searchCheckPay(obj)
				}
			})
			.catch(error => {
				console.log(error)
			})
	}
	
	onClickRadio(e) {
		let serialNumber = e.target.value === '4' ? true : false
		this.setState({
			pay_type: Number(e.target.value),
			serialNumber
		})
	}

	onClickAddRadio(e) {
		var date = new Date();
		this.setState({
			addid: e.target.value
		})
	}

	onClearMember = () => {
		let { dataList, orderIndex } = this.props.order
		dataList = dataList.slice()
		dataList[orderIndex] && dataList[orderIndex].forEach(item => {
			item.specialPrice && (delete item.specialPrice)
		})
		this.props.resetOrderList(dataList[orderIndex], orderIndex)
		this.props.clearMember()
	}

	temporaryDiscount(level) {
		const { fullsub } = this.props
		return (fullsub.data && fullsub.data.data) && fullsub.data.data.find(item => item.level.id === level)
	}

	editPriceInput = value => {
		const { focusInputName } = this.state
		let output = onVirtualKeyboard(value, this.state[focusInputName], () => {
			this.iterator = this.handleOk();
			this.iterator.next();
		})
		this.setState({
			[focusInputName]: output
		})
	}

	editScoreInput(value){
		const { focusInputName,memberdata } = this.state
		console.log(memberdata)
		let output = onVirtualKeyboard(value, this.state[focusInputName],()=>{
			if(value == '确定'){
				// alert("确定")
				console.log(output)
				removeScore({
					member_id:memberdata.id,
					score:this.state[focusInputName]
				}).then((res)=>{
					console.log(res)
					if(res.data.status == '4001'){
						message.success(res.data.data)

						
						this.setState({
							
							showExchange:false
						})

					}else{
						message.info(res.data.data)
					}
				})
			}
		})
		
		this.setState({
			[focusInputName]: output
		})
	}



















	getNowFormatDate() {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = year + seperator1 + month + seperator1 + strDate
		return currentdate;
	}
	editMemberInput(value){
		console.log(value)
		let {focusInputName,memberdata,setpwd,repeat,member_mobile,member_name} = this.state;
		let that = this
		if(value=='确定'){
			// if (setpwd.length < 6) {
			// 	message.info('密码不能少于6位数');
			// 	return false
			// }
			if (setpwd !== repeat) {
				message.info('2次密码输入不同');
				return false
			}
			addmember({ 
				mobile:memberdata.mobile, 
				pwd: setpwd, 
				refund: 1 ,
				edit_mobile:member_mobile,
				edit_name:member_name
			})
				.then(res => {
					console.log(res)
					if(res.data.status==4001){
						message.success(res.data.data)
						this.setState({
							showSetting: false,
							setpwd: '',
							repeat: '',
						},()=>{
							that.props.getMember(member_mobile)
								.then(res => {
									let temporaryDiscount = that.temporaryDiscount(res.level)
									temporaryDiscount && that.props.updateMember(temporaryDiscount.value)
									res.data
									that.setState({
										memberdata: res,
										// auth_code: '',
										member_amount: '0',
										member_selling: '0',
									},()=>{
										// that.setState({

										// })
									})
								})
						})
					}else{
						message.error(res.data.data)
						return false
					}
					
				})
				
				
		}
		console.log(focusInputName)
		let output = this.onVirtualKeyboard(value, this.state[focusInputName], () => {
			
		})
		this.setState({
			[focusInputName]:output
		})
	}
	handleInput = (e, name) => {
		let val = e.target.value

		if (name == 'setpwd' || name == 'repeat') {
			val = val.replace(/\D/g, '').match(/\d{0,6}/)[0]
		}

		this.setState({
			[name]: val
		})
	}
	onVirtualKeyboard(value, str, success) {
		//判断点击的是否是数字键
		if (!isNaN(Number(value))) {
			str = !str ? value : str + value
		} else {
			switch (value) {
				case '.':
					if (str.indexOf('.') === -1) {
						str = !str ? '0.' : str + '.'
					}
					break
				case '清除':
					str = ''
					break
				case '退格':
					str = str.substring(0, str.length - 1)
					break
				case '确定':
					success()
					break
				default:
			}
		}
		return str
	}
	showExchanges(){
		let store_id=this.props.sale.data.store_id
		let uniacid = this.props.sale.data.uniacid
		scoreGoods({
			store_id:store_id,
			uniacid:uniacid
		}).then(res => {
			
			console.log(res.data.replace('"','').replace(/[\\]/g,''))
			let aa = res.data.replace('"','').replace(/[\\]/g,'')
			let bb = aa.slice(0,2)+'"'+aa.slice(2) 
			console.log(JSON.parse(bb))
			let cc = JSON.parse(bb)
			for(let i=0;i<cc.length;i++){
				cc[i].name = unescape(cc[i].name.replace(/u/g,"%u"))
				// cc[i].code = unescape(cc[i].code.replace(/u/g,"%u"))
			}
			// let dd = cc.replace('/[u]/',"\\")
			console.log(cc)
			this.setState({
				scoreGoodses:cc,
				showExchange:true
			})
			// this.setState({
			// 	scoreGoodses:aa.data,
			// 	showExchange:true
			// })
		})
		// .then(res => {
		// 	// console.log(res)
		// })
	}
	showExchangeOk(){
		this.setState({
			showExchange:false
		})
	}
	showExchangeCel(){
		this.setState({
			showExchange:false
		})
	}
	scoreExchanges(item){
		if(item){
			this.setState({
				card_color:'#ccc'
			})
			console.log(this.props)
			if(Number(this.props.member.data.score_balance)<Number(item.need_score_num)){
				message.error('积分不足')
				return false
			}
			if(Number(item.stock)<=0){
				message.error('库存不足')
				return false
			}
			const { confirm } = Modal;
			let store_id = this.props.sale.data.store_id
			let uniacid=this.props.sale.data.uniacid
			// console.log(item)
			let goodsid = item.id
			let userid = this.props.member.data.id
			let use_score = item.need_score_num
			let cashier_id = this.props.sale.data.id
			let that = this
			confirm({
				title: '提示',
				// icon:,
				content: '是否确认兑换',
				onOk() {
					scoreExchange({
						store_id:store_id,
						uniacid:uniacid,
						goodsid:item.id,
						userid:userid,
						use_score:use_score,
						cashier_id:cashier_id,
						gnum:'1'
					}).then(res => {
						if(res.data.status==4001){
							message.success(res.data.data)
							that.showExchanges()
							that.props.getMember(that.props.member.data.mobile)
								.then(res => {
									// res.mobile = 
									let temporaryDiscount = that.temporaryDiscount(res.level)
									temporaryDiscount && that.props.updateMember(temporaryDiscount.value)
									that.setState({
										memberdata: res,
										// auth_code: '',
										member_amount: '0',
										member_selling: '0',
									})
								})
						}else{
							message.error(res.data.data)
						}
						
						
					})
					// console.log('OK');
				},
				onCancel() {
					console.log('Cancel');
				},
			});
			
		}else{
			this.setState({
				card_color:'#FD7438'
			})
		}
		
	}
	render() {
		const { layout } = this.state
		const memberdata = this.props.member.data
		let temporaryDiscount = this.temporaryDiscount(memberdata.level)
		let isMemberMsg = localStorage.getItem('isMemberMsg')?localStorage.getItem('isMemberMsg'):"2"
		// console.log(this.getNowFormatDate())
		// console.log(memberdata.birthday)
		// console.log(this)
		// if (!layout) {
		//   return <div>Loading...</div>;
		// }
		
		return (
			
			<div className={isMemberMsg=="1"?"isMemberMsg":'silder-right-containers'}>
				 
				<Modal
					title="积分兑换"
					visible={this.state.showExchange}
					onOk={this.showExchangeOk.bind(this)}
					onCancel={this.showExchangeCel.bind(this)}
					className="exchange"
					width="1010px"
					footer={null}
					>
					<div className="exchange_list">
						{
							this.state.scoreGoodses.length?this.state.scoreGoodses.map((item,key)=>{
								return (
									<div className="exchange_card" onClick={()=>this.scoreExchanges(item)} key={key}>
										<div className="card_img">
											<img src={item.albumpath} alt=""/>							
										</div>
										<div className="card_msg">
											<div className="card_name">{item.name}</div>
											<div className="card_coin">{item.need_score_num}积分</div>
											
										</div>
										<div className="card_stock">剩余:{Number(item.stock).toFixed(0)<0?0:Number(item.stock).toFixed(0)}</div>
									</div>
									
									)
							}):''
						}

						<div className="exchange_card" onClick={()=>this.scoreExchanges(false)} style={{
							display:'flex',
							justifyContent: 'center',
							borderColor:this.state.card_color
								
						}}>自定义积分</div>

					</div>


					{/* 自定义消费积分 */}
					{
						this.state.card_color == '#FD7438'?
						<div className="Custom_consumption_pointss">
							<div className="Custom_consumption_points_left">
								<Input 
									addonBefore="自定义消费积分"  
									value={this.state.scoreIpt}
									onChange={e => this.setState({ scoreIpt: fat_num(e.target.value) })}
                                    onFocus={() => this.setState({ focusInputName: 'scoreIpt', scoreIpt: '' })}
								/>
							</div>
							<div className="Custom_consumption_points_right">

							<NumericKeypad Num onClick={this.editScoreInput.bind(this)} />
							</div>
							
						</div>
						:''
					}
					</Modal>

































					
					
					
					
					
				
				<Row gutter={8} >
					{/* <Col span={12}>
						会员账号：{memberdata.mobile}
						{
							this.getNowFormatDate() == memberdata.birthday ?
								<Icon type="gift" theme="twoTone" twoToneColor="#FD7438" />
								: ''
						}
					</Col> */}
					<div className="member_row1">
						<div>
							会员账号：{memberdata.mobile}
							{
								this.getNowFormatDate() == memberdata.birthday ?
									<Icon type="gift" theme="twoTone" twoToneColor="#FD7438" />
									: ''
							}
						</div>
						<div>
							会员名称:{memberdata.name}
						</div>
						
					</div>
					
					<div className="member_row2">
						<div className="row2_balance">
							<div>
								余额:{memberdata.member_balance}
							</div>
							<div className="small_btn">
								<Button  type="primary" onClick={this.showModal.bind(this)} size="small">充值</Button>
							</div>
						</div>
						<div className="row2_score">
							<div>
								积分:{memberdata.score_balance}
							</div>
							<div className="small_btn">
								<Button  type="primary" onClick={this.showExchanges.bind(this)} size="small">兑换</Button>
							</div>
						</div>
					</div>
					{
						isMemberMsg=="1"?<div className="member_row1">
						<div>
							消费次数：{memberdata.ordernum}
							
						</div>
						<div>
							平均消费额：{memberdata.avg}
						</div>
						
					</div>:''
					}
					
					<div className='member_row3'>
						<div className="row3_temporaryDiscount">
							权益:
							<span style={{ color: temporaryDiscount ? 'red' : null }}>
								{temporaryDiscount ? temporaryDiscount.value : memberdata.rights}
							</span>
							{temporaryDiscount && <span color="#f50" style={{ paddingHorizontal: 4 }}>促</span>}
						</div>
						<div className="row3_btn">
							<Button onClick={this.shwoVerify.bind(this)}>资料修改
							</Button>
							<Button onClick={this.onClearMember}>退出会员</Button>
						</div>
					
					</div>
					{/* <Col span={6}>
						<span className="member-icons">
							<SettingOutlined />
							<i className="icon iconfont icon-shezhi" onClick={this.showSetting.bind(this)} />
							
						</span>
						<span className="member-icons member-icon-spans" >
							<i className="icon iconfont icon-shezhi" onClick={this.showModal.bind(this)} />
							<i className="icon iconfont icon-chongzhi" onClick={this.showModal.bind(this)} />
							
						</span>
						
					</Col> */}
					{/* <Col span={8} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
						会员名称:{memberdata.name}
					</Col> */}
					{/* <Col span={8}>等级:{memberdata.levelname}</Col> */}

					{/* <Col span={8}>积分:{memberdata.score_balance}</Col> */}
					
					{/* <Col span={12}>消费次数：{memberdata.ordernum}</Col>
					<Col span={12}>平均消费额：{memberdata.avg}</Col> */}
					{/* <Col span={8}>余额:{memberdata.member_balance}</Col> */}
				
					
					{/* <Col span={3}><span className="member-icon"><Icon type="gift" theme="twoTone" twoToneColor="#FD7438" /></span></Col> */}
					{/* <Col span={5}>
						<Button onClick={this.onClearMember}>重新输入</Button>
					</Col>
					<Col span={5}>
						<Button onClick={this.showSetting.bind(this)}>会员设置</Button>
					</Col> */}
				</Row>

				<Modal
					title="会员充值"
					visible={this.state.visible}
					onOk={() => {
						this.iterator = this.handleOk();
						this.iterator.next()
					}}
					onCancel={() => this.setState({
						visible: false,
						loading: false,
						countInter: 59,
						confirmLoading: false,
						layout: true,
						auth_code: '',
					})}
					width={670}
					confirmLoading={this.state.confirmLoading}
				>
					<Spin spinning={this.state.loading} tip={'本次支付有效时间剩余' + this.state.countInter + '秒'}>
						<span>充值方式：</span>
						<div>
							<RadioGroup defaultValue="1" size="large">
								{
									PAYEMNTMETHODS.map((itme, index) => (
										<RadioButton
											key={index}
											value={itme.pay_type}
											onClick={this.onClickRadio.bind(this)}
											style={{ background: '#fff7f0', marginRight: 20, marginTop: 10, borderRadius: 5, width: 130 }}
										>
											{itme.title}
										</RadioButton>
									))
								}
								<Button
									size="large"
									style={{ display: this.state.powerRecharge }}
									onClick={() => this.setState({ layout: !layout })}
								>自定义充值金额</Button>
								<Input.Search
									size="large"
									ref={(input) => {
										this.textInput = input
									}}
									onBlur={() => {
										this.textInput.focus()
									}}
									value={this.state.auth_code}
									onChange={(e) => this.setState({ auth_code: e.target.value })}
									onSearch={() => this.iterator.next()}
									style={{ width: 80, opacity: 0 }}
								/>
							</RadioGroup>
						</div>
						<div style={{ marginTop: 16 }}>
							{
								layout ? (
									<RadioGroup defaultValue="a">
										{
											this.state.RechargeList.map((itme, index) => (
												<RadioButton
													key={index}
													value={itme.id}
													onClick={this.onClickAddRadio.bind(this)}
													style={{ marginBottom: 10, marginRight: 10, borderRadius: 3, width: 300 }}
												>
													面值：{itme.member_amount}元&nbsp;售价：{itme.member_selling}元
												</RadioButton>
											))
										}
									</RadioGroup>
								) : (
										<div className="row" style={{ justifyContent: 'space-between' }}>
											<div>
												<FormItem
													label="付款金额"
													labelCol={{ span: 12 }}
													wrapperCol={{ span: 12 }}
												>
													<Input
														size="large"
														style={{ width: 150 }}
														defaultValue={this.state.member_selling}
														value={this.state.member_selling}
														onChange={e => this.setState({ member_selling: fat_num(e.target.value) })}
														onFocus={() => this.setState({ focusInputName: 'member_selling', member_selling: '' })}
													/>
												</FormItem>
												<FormItem
													label="充值面额"
													labelCol={{ span: 12 }}
													wrapperCol={{ span: 12 }}
												>
													<Input
														size="large"
														style={{ width: 150 }}
														defaultValue={this.state.member_amount}
														value={this.state.member_amount}
														onChange={e => this.setState({ member_amount: fat_num(e.target.value) })}
														onFocus={() => this.setState({ focusInputName: 'member_amount', member_amount: '' })}
													/>
												</FormItem>
											</div>
											<NumericKeypad Num onClick={this.editPriceInput} />
										</div>
									)
							}
						</div>
						<div id="serialNumber" style={this.state.serialNumber ? { display: 'block' } : { display: 'none' }}>
							<Input placeholder="流水凭证号" style={{ width: '95%' }} />
						</div>
					</Spin>
				</Modal>
				<Verify
					visible={this.state.shwoVerify}
					on_click={() => {
						this.setState({
							shwoVerify: false,
						})
					}}
					callback={() => {
						this.setState({
							shwoVerify: false,
						}, () => {
							this.showSetting()
						})
					}}
				/>
				<Modal
					title="修改会员信息"
					visible={this.state.showSetting}
					onOk={() => {
						this.editMemberInput('确定')
					}}
					onCancel={() => this.setState({
						showSetting: false,
						
					})}
					width={670}
					className="settings_pwd"
					confirmLoading={this.state.confirmLoading}
				>
					<div className="formitem">
						<FormItem label="设置密码" className="item index_4">
							<Input
								placeholder="设置密码"
								type='password'
								value={this.state.setpwd}
								onChange={(e) => this.handleInput(e, 'setpwd')}
								onFocus={() => this.setState({ focusInputName: 'setpwd' })}
							/>
						</FormItem>
						<FormItem label="重复密码" className="item index_5">
							<Input
								type='password'
								placeholder="重复密码"
								value={this.state.repeat}
								onChange={(e) => this.handleInput(e, 'repeat')}
								onFocus={() => this.setState({ focusInputName: 'repeat' })}
							/>
						</FormItem>
						<FormItem label="会员信息" className="item index_6">
							<Input
								
								placeholder="会员信息"
								value={this.state.member_name}
								onChange={(e) => this.handleInput(e, 'member_name')}
								onFocus={() => this.setState({ focusInputName: 'member_name' })}
							/>
						</FormItem>
						<FormItem label="手机号" className="item index_6">
							<Input
								
								placeholder="手机号"
								value={this.state.member_mobile}
								onChange={(e) => this.handleInput(e, 'member_mobile')}
								onFocus={() => this.setState({ focusInputName: 'member_mobile' })}
							/>
						</FormItem>
					</div>
					<div className="keywords">
					
						<NumericKeypad Num onClick={this.editMemberInput.bind(this)} />
					</div>
					
					
			
				</Modal>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SiderRightFootermember)
