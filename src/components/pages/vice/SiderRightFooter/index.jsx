import React, { Component } from 'react'
import { Input, Row, Col, Button, Modal, Tabs, Form, DatePicker, message, Popover} from 'antd'
import { connect } from 'react-redux'
import { NumericKeypad } from '@/widget'
import { getMember, addMember, resetOrderList, updatePosMember } from '@/action'

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
			visible 		: false, 
			memberIdCar 	: '',// 会员卡号/手机号
			mobile 			: '',// 注册会员手机号
			birthday 		: '',// 注册会员出生日期
			focusInputName 	: 'memberIdCar',//当前选中的input框
			updateMobile   : '',
			updateCard_code : ''

		};
	}

	SearchVal(value){
		let {dataList, orderIndex} = this.props.order
		if(pattern.test(value)){
			this.props.getMember(value)
			.then(res => {
				console.log(res)
				dataList[orderIndex]&&dataList[orderIndex].forEach(item => {
					//`is_membership` tinyint(3) NOT NULL DEFAULT '1' COMMENT '是否开启会员权益1否，2是',
					//`is_memberprice` tinyint(3) NOT NULL DEFAULT '1' COMMENT '会员价 1不启用 2启用',
					
					const memeberPriceFunc = obj => {
						return obj.is_memberprice === 2 ? obj.memberprice : 
							(obj.is_membership === 2 ? obj.posprice * res.rights / 10 : null)
					}
					// const memeberPriceFunc = obj => {
					// 	return obj.is_memberprice === 2 ? 
					// 		(obj.specialPrice === null || isNaN(obj.specialPrice) ? obj.memberprice : (obj.specialPrice > obj.memberprice ? obj.memberprice : obj.specialPrice ) ) : 
					// 		(obj.is_membership === 2 ? obj.posprice * res.rights / 10 : null)
					// }
					console.log(item.is_memberprice, item.memberprice)
					
					item['specialPrice'] = res.is_promotion !== 1 && item.promotion_member === 2 ?
                   		item.promotion * item.posprice / 10 : memeberPriceFunc(item)

					item['specialPrice'] = item['specialPrice'] === null ? null : Number(item['specialPrice']).toFixed(2)
				})
				this.props.resetOrderList(dataList[orderIndex], orderIndex)
			})
		}else{
			info()
		}
		
	}
	
	showModal = () => {
		this.setState({
			visible: true
		});
	}

	phoneverifier(e){
		let mobile=e.target.value;
		this.setState({
			mobile
		})
	}
	uodateMobile(e){
		this.setState({
			member_mobile:e.target.value
		},()=>{
			console.log(this.state.member_mobile)
		})
	}
	updateCard_code(e){
		this.setState({
			updateCard_code:e.target.value
		},()=>{
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
			let { mobile, birthday, username } = this.state
			if(!pattern.test(this.state.mobile)){
				
				message.info('手机号输入有误');
				return false;
			}

			this.props.addMember({name: username, mobile, birthday})
				.then(res => {
					this.setState({
						visible: false,
						mobile:'',
						username:''
					});
					message.success(res.data)
				})
				.then(() => {
					this.props.getMember(mobile)
				})
		}
		
		let output = this.onVirtualKeyboard(value, this.state[focusInputName], () => {
            if(focusInputName === 'memberIdCar') {
            	this.SearchVal(this.state.memberIdCar)
            } else if(focusInputName === 'mobile'){
            	requestRegMember()
            }else if(focusInputName === 'updateMobile'){
				if(!pattern.test(this.state.updateMobile)){
					message.info('手机号输入有误');
				}
				if(this.state.updateMobile && this.state.updateCard_code){
					console.log(this.state.updateMobile)
					this.props.updatePosMember({member_mobile: this.state.updateMobile, card_code:this.state.updateCard_code})
						.then(res => {
							
							if(res.status === 4001){
								message.success('绑定成功');
								this.SearchVal(this.state.updateMobile)
							}else{
								return false;
							}
						})
					
				
				}
			}else if(focusInputName === 'updateCard_code'){
				if(this.state.updateMobile && this.state.updateCard_code){
					console.log(this.state.updateMobile)
					this.props.updatePosMember({member_mobile: this.state.updateMobile, card_code:this.state.updateCard_code})
						.then(res => {
							
							if(res.status === 4001){
								message.success('绑定成功');
								this.SearchVal(this.state.updateMobile)
							}else{
								return false;
							}
						})
						
				
				}
				console.log(22)
				
			}
        })
		
		this.setState({ 
			[focusInputName]: output 
		})
		
		
	}

	
    render() {
        return (
            <div className="silder-right-container">
            	{/* <Row gutter={8}>
		            <Col span={3}>
		            	<span className="member-icon">
		            		<i className="icon iconfont icon-chongzhi" />
		            	</span>
		            </Col>
		            <Col span={14}>
		            	<Popover placement="leftBottom" content={<NumericKeypad Num onClick={this.editMemberInput.bind(this)} />}>
		            		<Search
		            			style={{width: 210}}
			            		value={this.state.memberIdCar} 
			            		placeholder="输入会员卡号/手机号" 
			            		enterButton="确定" 
			            		onChange={(e) => this.setState({memberIdCar: e.target.value})}
			            		onSearch={this.SearchVal.bind(this)} 
			            		onFocus={() => this.setState({focusInputName: 'memberIdCar'})}
		            		/>
		            	</Popover>
		            </Col>
		            <Col span={6}>
		           		<Button onClick={this.showModal}>会员管理</Button> 
		            </Col>
		        </Row> */}
				<Modal
					title="添加会员"
					width={ 600 }
					visible={this.state.visible}
					onCancel={() => this.setState({visible: false})}
					footer={null}
				>
					<Tabs type="card">
						<TabPane tab="按手机号添加" key="1">
							<Row gutter={16} type="flex" justify="space-between" style={{alignItems: 'flex-end'}}>
								<Col span={8}>
									<FormItem label="手机号">
										<Input 
											placeholder="手机号" 
											value={this.state.mobile} 
											onChange={this.phoneverifier.bind(this)}
											onFocus={() => this.setState({focusInputName: 'mobile'})} 
										/>
									</FormItem>
									<FormItem label="姓　名">
										<Input placeholder="姓名" value={this.state.username} onChange={e=>this.setState({username: e.target.value})} />
									</FormItem>
									<FormItem label="生　日">
										<DatePicker style={{width:"100%"}} onChange={(data,dateString) => {this.setState({birthday: dateString})}} />
									</FormItem>
								</Col>
								<Col span={15}>
									<NumericKeypad onClick={this.editMemberInput.bind(this)} />
								</Col>
							</Row>
						</TabPane>
						<TabPane tab="微信扫码添加" key="2">
							<Row gutter={16} type="flex" justify="center">
								<Col>
									<img src={this.props.store.data&&this.props.store.data.followed_image} alt="" />
								</Col>
							</Row>
						</TabPane>
						<TabPane tab="修改资料" key="3">
							<Row gutter={16} type="flex" justify="space-between" style={{alignItems: 'center'}}>
								<Col span={8}>
									<FormItem label="手机号">
										<Input 
											placeholder="手机号" 
											value={this.state.updateMobile} 
											onChange={this.uodateMobile.bind(this)}
											onFocus={() => this.setState({focusInputName: 'updateMobile'})} 
										/>
									</FormItem>
									<FormItem label="会员卡号">
										<Input 
											placeholder="会员卡号" 
											value={this.state.updateCard_code} 
											onChange={this.updateCard_code.bind(this)}
											onFocus={() => this.setState({focusInputName: 'updateCard_code'})} 
										/>
									</FormItem>
								
								</Col>
								<Col span={15}>
									<NumericKeypad onClick={this.editMemberInput.bind(this)} />
								</Col>
							</Row>
						</TabPane>
					</Tabs>
				</Modal> 
            </div>
        )
    }
}

export default connect(mapStateToProps,{ getMember, addMember, resetOrderList,updatePosMember })(SiderRightFooter)