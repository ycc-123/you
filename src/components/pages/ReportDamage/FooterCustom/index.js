/**
 * file 商品报损
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, notification } from 'antd'
import { withRouter } from 'react-router-dom'

import { clearReportDamageList } from '@/action'
import { setDamage } from '@/api'

const confirm = Modal.confirm;

const mapStateToProps = (state, ownProps) => ({
    store: state.store,
    sale: state.sale,
    reportdamage: state.reportdamage,
})

class index extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: false,
		};
	}

	onSubmit = () => {
		const { list } = this.props.reportdamage
		const onOk = () => {
			if(!list&&list.length === 0) {
				notification.error({
	                message: '提交报损单为空',
	                description: '请先检查报损商品后重试',
	            })
				return
			}
			setDamage({itemData: this.props.reportdamage.list})
			.then( ({data}) => {
				this.props.clearReportDamageList()
                return data.status != 4002 ? notification.success({
                    message: '提示',
                    description: '报损单提交成功',
                }) : null
			})
		}
		confirm({
			title: '提交报损单',
			content: '是否提交报损',
			onOk() {
				onOk()
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}

	totalPrice = () => {
		let totalPrice = 0
		this.props.reportdamage.list.forEach(item => totalPrice += item.num * +item.posprice)
		return totalPrice.toFixed(2)
	}
	
	render() {
		var rand = Math.floor(Math.random () * 900) + 1;
		return (
			<div className="audio-controller" style={{justifyContent: 'space-between'}}>
				<div>
	                <div 
		                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ccc',width: 105, height: 100}} 
		                onClick={() => this.props.history.push({pathname:'/app/dashboard/73'+rand})}
	                >
	                    <span style={{fontSize: 16}}>退出</span>
	                </div>
			    </div>
			    <div className="right row">
			    	<div className="section1">
                        <span>
                            报损总金额（元）
                        </span>
                        <span className="price">{this.totalPrice()}</span>
                    </div>
	                <div className="section3 row" onClick={this.onSubmit}>
	                    <div>
	                        <span className="complete-icon"><i className="iconfont icon-jsq" /></span>
	                    </div>
	                    <div className="complete-title">
	                        <span>生成报损单</span>
	                        <span className="price" />
	                    </div>
	                </div>
	            </div>
			</div>
		);
	}
}

export default withRouter(connect(mapStateToProps, { clearReportDamageList })(index))