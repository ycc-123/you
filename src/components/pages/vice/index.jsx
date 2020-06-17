import React, { Component } from 'react'
import { Spin, Layout, Carousel,Modal } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SiderRightFooter from './SiderRightFooter'
import SiderRightFootermember from './SiderRightFootermember'
import SiderRightHeader from './SiderRightHeader'
import SiderRightBody from './SiderRightBody'
import SiderRightBodyList from './SiderRightBodyList'
import './index.less'
import Headc from '../../HeaderCustom'
import { getStoreSwiper } from '../../../api'
import { getStore } from "@/action";
// import { menus } from '../../constants/menus';
import numbered from './Numbered_Mode.png';
import wx_zfs from './wx_zfs.png'
import zfb_zfs from './zfb_zfs.png'
import wx_false from './wx_false.png'
import zfb_false from './zfb_false.png'
const { Footer, Content, Header } = Layout

const mapStateToProps = (state, ownProps) => ({
	order: state.order,
	member: state.member
})

class SiderRightCustom extends Component {
	constructor(props) {
		super(props);

		this.state = {
			collapsed: false,
			member_information: true,
			selectedName: 'currentOrder',
			orderList: null,
			memberList: null,
			imgList: [],
			calcDiscount: '',
			calcPayment: '',
			zongjine: '',
			getStroestate:null,
			visible: false
		};
	}

	onHandleClick(key) {
		console.log(key)
		this.setState({
			selectedName: key
		})
	}
	
	componentDidMount() {
		this.props.getStore().then(res=>{
			console.log(res.data)
			this.setState({
				getStroestate: res.data
			})
		})
		window.addEventListener('storage', this.onStorage.bind(this));
		let order = JSON.parse(localStorage.getItem('__order'));
		let member = JSON.parse(localStorage.getItem('__member'));
		let calcDiscount = localStorage.getItem('calcDiscount');
		let calcPayment = localStorage.getItem('calcPayment');
		let zongjine = localStorage.getItem('zongjine');
		let paytype = localStorage.getItem('paytype');
		console.log(order)
		if (calcPayment < 0) {
			calcPayment = '0.00'
		}
		this.setState({
			orderList: order.dataList[0],
			memberList: member.data,
			calcDiscount: calcDiscount,
			calcPayment: calcPayment,
			zongjine: zongjine,
			paytype:paytype
		})
		getStoreSwiper(member).then((res) => {

			if (res.data.status === 4001) {
				console.log(res.data.data)
				this.setState({
					imgList: res.data.data
				})
			}
		})
	}
	onStorage(e) {
		console.log(e.currentTarget.localStorage)
		let order = JSON.parse(localStorage.getItem('__order'));
		let member = JSON.parse(localStorage.getItem('__member'));
		let calcDiscount = localStorage.getItem('calcDiscount');
		let calcPayment = localStorage.getItem('calcPayment');
		let zongjine = localStorage.getItem('zongjine');
		let paytype = localStorage.getItem('paytype');
		let store = this.state.getStroestate
		
		if (calcPayment < 0) {
			calcPayment = 0.00
		}
		if(paytype!='false'){
			console.log(paytype)
			let cashier_color = ''
			let cashier_text = ''
			let cashier_img = ''
			let casher_back = ''
			let cashier_type= ''
			switch (paytype) {
				case '9':
					cashier_color = '#ff3231'
					cashier_text = '口碑支付'
					cashier_img = store.koubei_qrcode.length
						&& store.koubei_qrcode
						|| numbered
					break
				case '5':
					cashier_color = 'green'
					cashier_text = '微信支付'
					cashier_img = store.wechat_qrcode.length
						&& store.wechat_qrcode
						|| wx_false
					casher_back = wx_zfs
					cashier_type = '微信'
					break
				case '6':
					cashier_color = '#009fff'
					cashier_text = '支付宝支付'
					cashier_img = store.alipay_qrcode.length
						&& store.alipay_qrcode
						|| zfb_false
					casher_back = zfb_zfs
					cashier_type = '支付宝'
					// console.log(cashier_img)
					break
				default:
					break
			}
			console.log(store)
			this.setState({
				visible: true,
				cashier_img:cashier_img,
				cashier_color :cashier_color,
				cashier_text :cashier_text,
				casher_back:casher_back,
				cashier_type:cashier_type
			});
		}else{
			this.setState({
				visible: false,
			});
		}
		if (order) {
			this.setState({
				orderList: order.dataList[0],
				memberList: member.data,
			})
		}
		this.setState({
			paytype:paytype,
			calcDiscount: calcDiscount,
			calcPayment: calcPayment,
			zongjine: zongjine
		},()=>{
			console.log(this.state)
		})



	}
	render() {
		let { order, member } = this.props
		let { imgList,cashier_img,cashier_color,cashier_text,casher_back ,cashier_type} = this.state
		console.log(this.state)
		return (


			<Spin spinning={false} wrapperClassName="app-spin">
				 <Modal
					title="请扫码支付"
					visible={this.state.visible}
					closable={false}
					footer={null}
					>
					<div
						className='content'
					>
						<p className='p'><img  className='imgs' src={casher_back} alt=""/><span style={{
							color: cashier_color,
							padding: '0 3px',
							fontSize: '24px',
						}}>{cashier_text}</span></p>
						
							<img className='img' src={cashier_img} alt="" />
					
					<p style={{
						fontSize: '22px'
					}}>请打开{cashier_type}扫一扫，完成支付操作</p>
						
					</div>
					</Modal>
				{/* <Headc style={{height:'auto'}}></Headc> */}
				<div className='box' style={{ display: 'flex', overflow: 'hidden', height: '100%' }}>

					<div className='carousel' style={{ flex: '8' }}>
						{

							<Carousel autoplay>
								{
									imgList ? imgList.map((item, index) => {
										return (
											<div key={index}><img src={item} alt="" /></div>
										)

									})
										:
										<div><img src='https://res.lexiangpingou.cn/images/53/2018/11/CyYpZQ99qd3csUA62RzAeSJe2SEU5M.png' alt="" /></div>
								}


								{/* <div><img src="http://res.w9.huodiesoft.com/images/53/2018/06/EOUL62l7f67MEMNO7lo2vZ4KBBcb66.jpg" alt=""/></div>
                                <div><img src="http://res.w9.huodiesoft.com/images/53/2018/06/s1WH1uN17T5n9ZNchN9R9ZR95hnH6p.png" alt=""/></div>
                                <div><img src="http://res.w9.huodiesoft.com///////images/53/2018/06/Ev4lzd4mji1W171qZQl4DSQBM0qjil.png" alt=""/></div> */}
							</Carousel>

						}

					</div>
					<Layout className="container" style={{ flex: '2' }}>
						<Header className="header">
							<SiderRightHeader onClick={this.onHandleClick.bind(this)} selectedName={this.state.selectedName} order={this.props.order} member={this.props.member} />
						</Header>
						<Content className="app-content">
							{
								this.state.selectedName === 'currentOrder' ?
									<SiderRightBody
										member={member.data}
										dataList={this.state.orderList || []}
										orderIndex={this.props.order.orderIndex}
									/>
									:
									<SiderRightBodyList order={order} onClick={this.onHandleClick.bind(this)} />
							}
						</Content>
						{/* <div  style={{position:'fixed',bottom:'0px'}}> */}
						{
							this.state.getStroestate&&this.state.getStroestate.show_memberinfo_secondscreen=="2"?
							<Footer className="app-footer">
							{
								this.state.memberList ?
									<SiderRightFootermember memberList={this.state.memberList} />
									:
									<SiderRightFooter />
							}
							</Footer>:''
						}
						
						{/* </div> */}
						<div className="aaaaa row">
							<div className="section1">
								<span>
									总金额（元）
                </span>
								<span className="price">{this.state.zongjine || '0.00'}</span>
							</div>
							<div className="section2">
								<span>减免／折扣</span>
								<span className="price">
									{this.state.calcDiscount || '0.00'}元
                </span>
							</div>
							<div className="section3 row" >
								<div>
									<span className="complete-icon"><i className="iconfont icon-jsq" /></span>
								</div>
								<div className="complete-title">
									<span>应收金额（元）</span>
									<span className="price">{this.state.calcPayment || '0.00'}</span>
								</div>
							</div>
						</div>

					</Layout>

				</div>

			</Spin>


		)
	}
}

export default withRouter(connect(mapStateToProps, { getStore })(SiderRightCustom));