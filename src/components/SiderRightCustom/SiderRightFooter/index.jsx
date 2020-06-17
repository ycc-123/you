import React, { Component, Fragment } from 'react'
import { Input, Row, Col, Button, Modal, Tabs, Form, DatePicker, message, Popover, notification,Table } from 'antd'
import { connect } from 'react-redux'
import { NumericKeypad } from '@/widget'
import { getMember, addMember, resetOrderList, updatePosMember } from '@/action'
import { disconnect, juhecurl,findMember } from '@/api'
import MD5 from '@/widget/MD5'

const pattern = /^0{0,1}(1[0-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
const FormItem = Form.Item
const Search = Input.Search
const TabPane = Tabs.TabPane
const mapStateToProps = (state, ownProps) => ({
	member: state.member,
	order: state.order,
	store: state.store,
})

const info = () => {
	message.info('输入错误请重试');
}

class SiderRightFooter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			memberIdCar: '',// 会员卡号/手机号
			mobile: '',// 注册会员手机号
			birthday: '',// 注册会员出生日期
			focusInputName: 'memberIdCar',//当前选中的input框
			updateMobile: '',
			updateCard_code: '',
			netStatusGetMember: 1,
			num: 0,
			setpwd: '',
			repeat: '',
			r_setpwd: '',
			r_repeat: '',
			sms: '',
			text_sms: '发送验证码',
			r_mobile: '',
			r_sms: '',
			r_text_sms: '发送验证码',
			r_MD5: '',
			MD5: '',
			showsettings:false,
			memberLists:[]
		};
		this.pass = true
		this.Interval = null
		this.r_pass = true
		this.r_Interval = null
	}
	findMember(value){
		findMember({
			search:value
		}).then((res)=>{
			// console.log(res)
			message.info(res.data.data)
			this.setState({
				memberLists:res.data.msg
			})
		})
	}
	SearchVal(value) {
		let { dataList, orderIndex } = this.props.order
		// 校验是否断网
		disconnect()
			.then(res => {
				// let a = isnotconnet()
				// console.log('断开模式',res)
				// if(res == null)alert('服务停止')

				if (res.data.status == 1 && this.state.netStatusGetMember == 0) {
					this.setState({
						netStatusGetMember: 1
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
					// console.log('断开 ' + isnet)
					if (isnet == 'true') {
						// console.log('断开 ' + 123)
						openNotification()
						localStorage.setItem('isconnect', '')
					}
				}

				if (res.data.status == 9002) {
					// if(res.data == ""){
					this.setState({
						netStatusGetMember: 0
					})

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

					openNotification()

					let isnet = localStorage.getItem('isconnect');
					if (isnet == null || isnet == '') {
						localStorage.setItem('isconnect', 'true')
					}

					return
				}

				this.props.getMember(value)
					.then(res => {
						console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhh', res, dataList)
						dataList[orderIndex] && dataList[orderIndex].forEach(item => {
							//`is_membership` tinyint(3) NOT NULL DEFAULT '1' COMMENT '是否开启会员权益1否，2是', 	2  1  2
							//`is_memberprice` tinyint(3) NOT NULL DEFAULT '1' COMMENT '会员价 1不启用 2启用',     1  2  1
							// console.log('hhhhhhhhhhhhhhhhhhhhh ', item)  
							const memeberPriceFunc = obj => {
								return obj.is_memberprice === 2 ?
									(obj.specialPrice === null || isNaN(obj.specialPrice) ? obj.memberprice : (obj.specialPrice > obj.memberprice ? obj.memberprice : obj.specialPrice)) :
									(obj.is_membership === 2 ? obj.posprice * res.rights / 10 : null)
							}
							console.log('nishuosha ' + item.is_memberprice, item.memberprice)

							item['specialPrice'] = res.is_promotion !== 1 && item.promotion_member === 2 ?
								item.promotion * item.posprice / 10 : memeberPriceFunc(item)

							item['specialPrice'] = item['specialPrice'] === null ? null : Number(item['specialPrice']).toFixed(2)
						})
						console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhh ', dataList[orderIndex], orderIndex)
						this.props.resetOrderList(dataList[orderIndex], orderIndex)
					})
			})
	}
	// componentDidMount(){
	// 	window.addEventListener('storage',this.onStorage.bind(this));
	// }
	// onStorage(e){
	// 	alert(e)
	// 	localStorage.setItem('2')
	// }
	
	

	showModal = async () => {
		let { data: { status } } = await disconnect().catch()
		if (status == 1) {
			this.setState({
				visible: true
			});
		} else {
			message.warning("断网模式不支持")
		}
	}

	/**
	 * [处理input输入键盘值]
	 * @param e dom对象
	 * @param name 对应state
	 */
	handleInput = (e, name) => {
		let val = e.target.value

		if (name == 'setpwd' || name == 'repeat' || name == 'r_setpwd' || name == 'r_repeat') {
			val = val.replace(/\D/g, '').match(/\d{0,6}/)[0]
		}

		this.setState({
			[name]: val
		})
	}

	uodateMobile(e) {
		this.setState({
			member_mobile: e.target.value
		}, () => {
			console.log(this.state.member_mobile)
		})
	}
	updateCard_code(e) {
		this.setState({
			updateCard_code: e.target.value
		}, () => {
			console.log(this.state.updateCard_code)
		})
	}

	/**
    * @param {按钮值} value
    * @param {输入框值} str
    * @param {点击确认后执行} success
    */
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

	editMemberInput(value) {
		let { focusInputName } = this.state

		const requestRegMember = () => {
			let { MD5: val_md5, sms, mobile, birthday, username, setpwd, repeat } = this.state
			let { member_smscode, membersaddpasswords } = this.props.store.data
			if (!pattern.test(mobile)) {
				message.info('手机号输入有误');
				return false;
			}
			if (member_smscode == 1 && MD5(sms) !== val_md5) {
				message.info('验证码输入有误');
				return false;
			}
			if (membersaddpasswords == 1) {
				if (setpwd.length < 6) {
					message.info('密码不能少于6位数');
					return false
				}
				if (setpwd !== repeat) {
					message.info('2次密码输入不同');
					return false
				}
			}

			this.props.addMember({ name: username, mobile, birthday, pwd: setpwd, refund: 0 })
				.then(res => {
					message.success(res.data)
				})
				.then(() => {
					this.props.getMember(mobile)
				})
				.then(() => {
					this.setState({
						visible: false,
						MD5: '',
						sms: '',
						mobile: '',
						username: '',
						setpwd: '',
						repeat: '',
					})
				})
		}

		const requestreset = () => {
			let { r_MD5: val_md5, r_sms: sms, r_mobile: mobile, r_setpwd: setpwd, r_repeat: repeat } = this.state
			let { member_smscode } = this.props.store.data
			if (!pattern.test(mobile)) {
				message.info('手机号输入有误');
				return false;
			}
			if (member_smscode == 1 && MD5(sms) !== val_md5) {
				message.info('验证码输入有误');
				return false;
			}
			if (setpwd.length < 6) {
				message.info('密码不能少于6位数');
				return false
			}
			if (setpwd !== repeat) {
				message.info('2次密码输入不同');
				return false
			}

			this.props.addMember({ mobile, birthday: '', pwd: setpwd, refund: 1 })
				.then(res => {
					message.success(res.data)
				})
				.then(() => {
					this.props.getMember(mobile)
				})
				.then(() => {
					this.setState({
						visible: false,
						r_MD5: '',
						r_sms: '',
						r_mobile: '',
						r_setpwd: '',
						r_repeat: '',
					})
				})
		}

		let output = this.onVirtualKeyboard(value, this.state[focusInputName], () => {
			if (focusInputName === 'memberIdCar') {
				this.SearchVal(this.state.memberIdCar)
			} else if (focusInputName === 'mobile' || focusInputName === 'setpwd' || focusInputName === 'repeat' || focusInputName === 'sms' || focusInputName === "username") {
				requestRegMember()
			} else if (focusInputName === 'r_mobile' || focusInputName === 'r_setpwd' || focusInputName === 'r_repeat' || focusInputName === 'r_sms') {
				requestreset()
			} else if (focusInputName === 'updateMobile') {
				let {
					updateMobile,
					updateCard_code,
				} = this.state
				if (!updateMobile) {
					message.info('请输入手机号');
					return false;
				}
				if (!pattern.test(updateMobile)) {
					message.info('手机号输入有误');
					return false;
				}
				if (!updateCard_code) {
					message.info('请输入会员卡号');
					return false;
				}
				if (updateMobile && updateCard_code) {
					console.log(updateMobile)
					this.props.updatePosMember({ member_mobile: updateMobile, card_code: updateCard_code })
						.then(res => {

							if (res.status === 4001) {
								message.success('绑定成功');
								this.SearchVal(updateMobile)
							} else {
								return false;
							}
						})
				}
			} else if (focusInputName === 'updateCard_code') {
				if (this.state.updateMobile && this.state.updateCard_code) {
					console.log(this.state.updateMobile)
					this.props.updatePosMember({ member_mobile: this.state.updateMobile, card_code: this.state.updateCard_code })
						.then(res => {

							if (res.status === 4001) {
								message.success('绑定成功');
								this.SearchVal(this.state.updateMobile)
							} else {
								return false;
							}
						})


				}

			}
		})

		this.setState({
			[focusInputName]: output
		})


	}

	memberIdCarFocus() {
		this.setState({ focusInputName: 'memberIdCar' })
	}

	/**
	 * [1发送短信验证码]
	 */
	sendJuhecurl = async () => {
		if (!this.pass) return false
		let { mobile } = this.state
		if (!pattern.test(mobile)) {
			message.info('手机号输入有误');
			return false;
		}
		let val = await juhecurl({ phone: mobile })
			.catch((err) => { console.log(err) })

		if (isNaN(+val.data.msg)) {
			message.info(val.data.msg)
		}

		if (val && val.data['data']) {
			let { data: { data } } = val
			this.setState({
				text_sms: "60s",
				MD5: data
			})
			this.pass = false
			this.Interval = setInterval(() => {
				this.setState((state, props) => ({
					text_sms: (+state.text_sms.replace(/\D/, '') - 1) + "s"
				}))
			}, 1000)
			setTimeout(() => {
				this.pass = true
				clearInterval(this.Interval)
				this.setState({
					text_sms: "发送验证码",
				})
			}, 60000)
		}
	}
	/**
		* [4发送短信验证码]
		*/
	r_sendJuhecurl = async () => {
		if (!this.r_pass) return false
		let { r_mobile } = this.state
		if (!pattern.test(r_mobile)) {
			message.info('手机号输入有误');
			return false;
		}
		let val = await juhecurl({ phone: r_mobile })
			.catch((err) => { console.log(err) })

		if (isNaN(+val.data.msg)) {
			message.info(val.data.msg)
		}

		if (val && val.data['data']) {
			let { data: { data } } = val

			this.setState({
				r_text_sms: "60s",
				r_MD5: data
			})
			this.r_pass = false
			this.r_Interval = setInterval(() => {
				this.setState((state, props) => ({
					r_text_sms: (+state.r_text_sms.replace(/\D/, '') - 1) + "s"
				}))
			}, 1000)
			setTimeout(() => {
				this.r_pass = true
				clearInterval(this.r_Interval)
				this.setState({
					r_text_sms: "发送验证码",
				})
			}, 60000)
		}
	}

	render() {
		let [TabPane_1_style, TabPane_4_style] = [null, null]
		const { Search } = Input;
		const ele = (text, record) => <span>{text}</span>;
		const columns = [
		  {
			title: "手机号",
			dataIndex: "member_mobile",
			key: "member_mobile",
			render: ele
		  },
		  {
			title: "姓名",
			dataIndex: "name",
			key: "name",
			render: ele
		  },
		  {
			title: "生日",
			dataIndex: "birthday",
			key: "birthday",
			render: ele
		  },
		  {
			title: "余额",
			dataIndex: "member_balance",
			key: "member_balance",
			render: ele
		  },
		  {
			title: "积分",
			dataIndex: "score_balance",
			key: "score_balance",
			render: ele
		  },
		  {
			title: "权益",
			dataIndex: "rights",
			key: "rights",
			render: ele
		  }
		];
		if (this.props.store.data) {
			switch (+this.props.store.data.membersaddpasswords) {
				case 1:
					TabPane_1_style = this.props.store.data.member_smscode == 1 ? null : {
						gridTemplateAreas: `"a b" "c d" "g h" "j k"`,
						gridTemplateRows: `80px 80px 80px auto`,
					}
					TabPane_4_style = this.props.store.data.member_smscode == 1 ? null : {
						gridTemplateRows: `repeat(2, 80px) auto`,
						gridTemplateAreas: `"z x"
							"e r"
							"t y"`,
					}
					break
				default:
					TabPane_1_style = this.props.store.data.member_smscode == 1 ? {
						gridTemplateAreas: `"a b" "c d" "e f" "j k"`,
						gridTemplateRows: `80px 80px 80px auto`,
					} : {
							gridTemplateAreas: `"a b" "c d" "j k"`,
							gridTemplateRows: `80px 80px auto`,
						}
					break
			}
		}
		return (
			
			<div className="silder-right-container">
				<Row gutter={8}>
					<Col span={3}>
						<span className="member-icon">
							<i className="icon iconfont icon-chongzhi" />
						</span>
					</Col>
					<Col span={14}>
						<Popover
							placement="leftBottom"
							trigger="click"
							content={<NumericKeypad Num onClick={this.editMemberInput.bind(this)} />}
						>
							<Search
								style={{ width: 210 }}
								value={this.state.memberIdCar}
								placeholder="输入会员卡号/手机号"
								enterButton="确定"
								onChange={(e) => this.setState({ memberIdCar: e.target.value })}
								onSearch={this.SearchVal.bind(this)}
								onFocus={() => this.memberIdCarFocus()}
							/>
						</Popover>
					</Col>
					<Col span={6}>
						<Button onClick={this.showModal}>会员管理</Button>
					</Col>
				</Row>
				<Modal
					title="会员管理"
					width={700}
					maskClosable={false}
					visible={this.state.visible}
					onCancel={() => this.setState({ visible: false })}
					footer={null}
				>
					<Tabs type="card"
						
					>
						<TabPane tab="会员查询" key="0">
							<Search
								placeholder="会员手机号/会员姓名"
								enterButton="搜索"
								size="large"
								onSearch={(value)=>{this.findMember(value)}}
							/>
							 <Table
								rowKey="id"
								size="small"
								columns={columns}
								pagination={{ pageSize: 10 }}
								dataSource={this.state.memberLists}
							/>
						</TabPane>
						
						<TabPane tab="会员添加" key="1">
							<div
								className="TabPane_1"
								style={TabPane_1_style}
							>
								<FormItem label="手机号" className="item index">
									<Input
										placeholder="手机号"
										value={this.state.mobile}
										onChange={(e) => this.handleInput(e, 'mobile')}
										onFocus={() => this.setState({ focusInputName: 'mobile' })}
									/>
								</FormItem>
								<FormItem label="姓　名" className="item index_1">
									<Input
										placeholder="姓名"
										value={this.state.username}
										onChange={e => this.setState({ username: e.target.value })}
										onFocus={() => this.setState({ focusInputName: 'username' })}
									/>
								</FormItem>
								<FormItem label="生　日" className="item index_2">
									<DatePicker style={{ width: "100%" }} onChange={(data, dateString) => { this.setState({ birthday: dateString }) }} />
								</FormItem>
								{
									this.props.store.data && this.props.store.data.member_smscode == 1 ? <FormItem label="短信验证码" className="item index_3">
										<div
											style={{
												display: 'grid',
												gridTemplateColumns: '220px 110px',
												placeItems: 'center',
											}}
										>
											<Input
												placeholder="短信验证码"
												value={this.state.sms}
												onChange={(e) => this.handleInput(e, 'sms')}
												onFocus={() => this.setState({ focusInputName: 'sms' })}
											/>
											<span
												style={{
													cursor: "default",
													color: "#fff",
													background: "#FD7438",
													borderRadius: "4px",
													padding: "0 10px",
												}}
												onClick={this.sendJuhecurl}
											>{this.state.text_sms}</span>
										</div>
									</FormItem> : null
								}
								{
									this.props.store.data && this.props.store.data.membersaddpasswords == 1 ? <Fragment>
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
									</Fragment> : null
								}
								<NumericKeypad className="index_6" Num={true} onClick={this.editMemberInput.bind(this)} />
							</div>
						</TabPane>
						<TabPane tab="微信扫码添加" key="2">
							<Row gutter={16} type="flex" justify="center">
								<Col>
									<img src={this.props.store.data && this.props.store.data.followed_image} alt="" />
								</Col>
							</Row>
						</TabPane>
						<TabPane tab="绑定实体会员卡" key="3">
							<Row gutter={16} type="flex" justify="space-between" style={{ alignItems: 'center' }}>
								<Col span={8}>
									<FormItem label="手机号">
										<Input
											placeholder="手机号"
											value={this.state.updateMobile}
											onChange={(e) => this.handleInput(e, 'updateMobile')}
											onFocus={() => this.setState({ focusInputName: 'updateMobile' })}
										/>
									</FormItem>
									<FormItem label="会员卡号">
										<Input
											placeholder="会员卡号"
											value={this.state.updateCard_code}
											onChange={this.updateCard_code.bind(this)}
											onFocus={() => this.setState({ focusInputName: 'updateCard_code' })}
										/>
									</FormItem>

								</Col>
								<Col span={15}>
									<NumericKeypad onClick={this.editMemberInput.bind(this)} />
								</Col>
							</Row>
						</TabPane>
						{
							this.props.store.data && this.props.store.data.membersaddpasswords == 1 ? <TabPane
								tab="重置密码"
								key="4"
							>
								<div className="TabPane_4" style={TabPane_4_style}>
									<FormItem label="手机号" className="item index">
										<Input
											placeholder="手机号"
											value={this.state.r_mobile}
											onChange={(e) => this.handleInput(e, 'r_mobile')}
											onFocus={() => this.setState({ focusInputName: 'r_mobile' })}
										/>
									</FormItem>
									{
										this.props.store.data && this.props.store.data.member_smscode == 1 ? <FormItem label="短信验证码" className="item index1">
											<div
												style={{
													display: 'grid',
													gridTemplateColumns: '220px 110px',
													placeItems: 'center',
												}}
											>
												<Input
													placeholder="短信验证码"
													value={this.state.r_sms}
													onChange={(e) => this.handleInput(e, 'r_sms')}
													onFocus={() => this.setState({ focusInputName: 'r_sms' })}
												/>
												<span
													style={{
														cursor: "default",
														color: "#fff",
														background: "#FD7438",
														borderRadius: "4px",
														padding: "0 10px",
													}}
													onClick={this.r_sendJuhecurl}
												>{this.state.r_text_sms}</span>
											</div>
										</FormItem> : null
									}
									<FormItem label="设置密码" className="item index2">
										<Input
											placeholder="设置密码"
											type='password'
											value={this.state.r_setpwd}
											onChange={(e) => this.handleInput(e, 'r_setpwd')}
											onFocus={() => this.setState({ focusInputName: 'r_setpwd' })}
										/>
									</FormItem>
									<FormItem label="重复密码" className="item index3">
										<Input
											type='password'
											placeholder="重复密码"
											value={this.state.r_repeat}
											onChange={(e) => this.handleInput(e, 'r_repeat')}
											onFocus={() => this.setState({ focusInputName: 'r_repeat' })}
										/>
									</FormItem>
									<NumericKeypad className="index4" Num={true} onClick={this.editMemberInput.bind(this)} />
								</div>
							</TabPane> : null
						}
					</Tabs>
				</Modal>
			</div>
		)
	}
}

export default connect(mapStateToProps, { getMember, addMember, resetOrderList, updatePosMember })(SiderRightFooter)