import React, { Component } from 'react'
import { Row, Col, Button, Modal, Radio, Input, message, notification, Tag, Form, Spin } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import NumericKeypad, { onVirtualKeyboard } from '@/widget/NumericKeypad'
import { getMember, clearMember, updateMember, resetOrderList} from '@/action'
import { getrecharge, addrecharge, checkRecharge} from '@/api'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const PAYEMNTMETHODS = [
    {title: '现金', pay_type: 0}, 
    {title: '微信刷卡', pay_type: 1}, 
    {title: '支付宝当面付', pay_type: 2}, 
    {title: '银行卡', pay_type: 4}, 
    {title: '个人微信', pay_type: 5}, 
    {title: '个人支付宝', pay_type: 6}
]

const mapStateToProps = (state, ownProps) => ({
	member: state.member,
	fullsub: state.fullsub,
	sale: state.sale,
	order: state.order,
})

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({clearMember, getMember, updateMember, resetOrderList}, dispatch)

class SiderRightFootermember extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading 		: false,
			visible 		: false,					
			serialNumber 	: false, //银行流水号输入框
			pay_type 		: 0, //支付方式
			memberdata 		: props.member.data, //会员信息
			RechargeList 	: [], //充值金额规格
			auth_code 		: '', //付款码一维码号
			member_amount 	: '0', //自定义充值面额
			member_selling 	: '0', //自定义充值金额
			layout 			: true, //自定义充值金额view与充值选项
			focusInputName 	: 'member_selling',
			memberList: null
		}
		this.iterator = {}
	}

	componentDidMount() {
		// let temporaryDiscount = this.temporaryDiscount(this.state.memberdata.level)
		// temporaryDiscount&&this.props.updateMember(temporaryDiscount.value)
		window.addEventListener('storage',this.onStorage.bind(this));
		
        let member =  JSON.parse(localStorage.getItem('__member'));

        this.setState({
            memberList:member.data
        })
	}

	showModal() {
		getrecharge()
			.then(res => {

				this.setState({
					visible: true,
					RechargeList: res.data.msg
				})	
			})
			.catch(error => {
				console.log(error)
			})
	}

	*handleOk() {
		let { pay_type, layout, member_amount, member_selling } = this.state
		let { member } = this.props
		let member_id = member.data.id
		let recharge_id = layout ? this.state.addid : 'user_defined'
		const ordersuccessed = () => {
			this.props.getMember(member.data.mobile)
				.then(res => {
					let temporaryDiscount = this.temporaryDiscount(res.level)
					temporaryDiscount&&this.props.updateMember(temporaryDiscount.value)
					this.setState({
						layout: true,
						visible: false,
						loading: false,
						memberdata: res,
						auth_code: '',
						member_amount: '0', 
						member_selling: '0', 
					})
				})
		}

		yield (() => {
			if(!layout&&!(Number(member_amount) || Number(member_selling))) {
	           /*自定义充值下，没有填写充值金额和充值面额 */
	           	notification.error({
	                message: '检查金额',
	                description: '请检查充值面额和付款金额',
	            })
	           	return
	        }else {
	        	//同步代码执行完成 调用
	        	setTimeout(() => {
	        		this.iterator.next()
	        	},0)
	        }
		})()

		yield (() => {
			if(pay_type === 1 || pay_type === 2) {
	            notification.info({
	                message: '扫码支付',
	                description: '扫描顾客付款码',
	            })
	            this.textInput.focus()
	            this.setState({loading: true}) 
	        }else {
	        	//同步代码执行完成 调用
	        	setTimeout(() => {
	        		this.iterator.next()
	        	},0)
	        }
		})()
		console.log(this.state.auth_code)
		let print_nimber = localStorage.getItem('print_number')?localStorage.getItem('print_number'):1
		yield addrecharge({member_id, recharge_id, pay_type, member_amount, member_selling, auth_code: this.state.auth_code, createid: this.props.sale.data.id,print_number:print_nimber})		
			.then(res => {
				console.log(res)
				// message.info(res.data.data)

				// 返回值状态 1002 充值成功 2002错误异常 2003等待支付 2005 订单已关闭
                if (res.data.status === 1002) {
                    ordersuccessed()
                }
                if (res.data.status === 2002) {

                }
                if (res.data.status === 2003){
                    let obj = {
                        recordid: res.data.msg,
                        num: 1
                    }
                    //查询订单是否支付成功
                    const searchCheckPay = async (obj) => {
						obj.print_number = localStorage.getItem('print_number')?localStorage.getItem('print_number'):1
                        let { data } = await checkRecharge(obj)
                        console.log(data)
                        if (data.status === 1002 || data.status === 2002){
                            ordersuccessed()
                        }
                        if (data.status === 2003){
                        	obj.num = data.msg.num
                            searchCheckPay(obj)
                        }
                    } 
                    searchCheckPay(obj)
                }
			})
			.catch(error => {
				console.log(error)
			})

	}
	
	onClickRadio(e){
		let serialNumber = e.target.value==='4' ? true : false
		this.setState({
			pay_type: Number(e.target.value),
			serialNumber
		})
	}

	onClickAddRadio(e){
		this.setState({
			addid:e.target.value
		})
	}

	onClearMember = () => {
		let {dataList, orderIndex} = this.props.order
		dataList = dataList.slice()
		dataList[orderIndex]&&dataList[orderIndex].forEach(item => {
			item.specialPrice&&(delete item.specialPrice)
		})
		this.props.resetOrderList(dataList[orderIndex], orderIndex)
		this.props.clearMember()
	}

	temporaryDiscount(level) {
		const { fullsub } = this.props
		return (fullsub.data&&fullsub.data.data)&&fullsub.data.data.find(item => item.level.id === level)
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

    onStorage(e){
		console.log(e) 
		let history = this.props
		let member =  JSON.parse(localStorage.getItem('__member'));
		if(member){
			this.setState({
				memberList : member.data
			},()=>{
				console.log(this.state.memberList)
				console.log('111')
				// window.location.reload()
			})
		}
		
		
	}
	formatName(name) {
		let newStr;
		if (name.length === 2) {
		newStr = name.substr(0, 1) + '*';
		} else if (name.length > 2) {
		  let char = '';
		  for (let i = 0, len = name.length - 2; i < len; i++) {
			char += '*';
		  }
		  newStr = name.substr(0, 1) + char + name.substr(-1, 1);
		} else {
		  newStr = name;
		}
	
		return newStr;
	 }
    render() {
		const { layout } = this.state
		console.log(this.state.memberList)
		let memberdata = this.props.memberList
    	let temporaryDiscount = this.temporaryDiscount(memberdata.level)
        return (
            <div className="silder-right-container">
            	<Row gutter={7} styl={{fontSize: 10}}>
		            <Col span={20}>
		            	会员账号：{memberdata.mobile.substr(0,3)+"****"+memberdata.mobile.substr(7)}
		            </Col>
		            {/* <Col span={2}>
		            	<span className="member-icon" >
		            		<i className="icon iconfont icon-chongzhi" onClick={this.showModal.bind(this)} />
		            	</span>
		            </Col> */}
		            <Col span={8} style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
		            	会员名称:{this.formatName(memberdata.name)}
		            </Col>
					<Col span={8}>等级:{memberdata.levelname}</Col>
					<Col span={8}>权益:
						<span style={{color: temporaryDiscount ? 'red' : null}}>
							{temporaryDiscount ? temporaryDiscount.value : memberdata.rights}
						</span>
						{ temporaryDiscount&&<Tag color="#f50" style={{paddingHorizontal: 4}}>促</Tag> }
					</Col>
					<Col span={8}>余额:{memberdata.member_balance}</Col>
					<Col span={8}>积分:{memberdata.score_balance}</Col>
					{/* <Col span={8}>
		           		<Button onClick={this.onClearMember}>重新输入</Button>
		            </Col> */}
		        </Row>

     			
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SiderRightFootermember)