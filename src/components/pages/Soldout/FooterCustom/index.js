/**
 * file 商品报损
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, notification } from 'antd'
import { withRouter } from 'react-router-dom'

import { clearsoldoutList, getCategory, getGoods, } from '@/action'
import { goodsDown } from '@/api'

const confirm = Modal.confirm;

const mapStateToProps = (state, ownProps) => ({
	store: state.store,
	sale: state.sale,
	soldout: state.soldout,
	setting: state.setting,
})

class index extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: false,
		};
	}

	onSubmit = () => {
		let { list } = this.props.soldout

		let q = list.filter(item => {
			return item.maplist.length === 1
		})
			.map(item => {
				return {
					barcode_id: item.barcode_id,
					goodsid: item.goodsid,
					nowprice: item.nowprice,
					supprices: item.supprices,
					gprice: item.gprice,
					oprice: item.oprice,
					mprice: item.mprice,
					store_id: item.store_id,
					barcode: item.barcode,
					is_memberprice: item.is_memberprice,
					is_membership: item.is_membership,
					memberprice: item.memberprice,
					posprice: item.posprice,
					uniacid: item.uniacid,
				}
			})
		let w = list.filter(item => {
			return item.maplist.length !== 1
		})
			.map(item => {
				return item.maplist.map(i => {
					return {
						barcode_id: i.id,
						goodsid: item.goodsid,
						barcode: i.barcode,
						nowprice: item.nowprice,
						"supprices": item.supprices,
						"gprice": item.gprice,
						"oprice": item.oprice,
						"mprice": item.mprice,
						store_id: item.store_id,
						"is_memberprice": item.is_memberprice,
						"is_membership": item.is_membership,
						"memberprice": item.memberprice,
						"uniacid": item.uniacid,
						posprice: item.posprice,
					}
				})
			})
		list = q.concat(...w)


		const onOk = () => {
			if (!list && list.length === 0) {
				notification.error({
					message: '提示',
					description: '提交下架单为空',
				})
				return
			}
			goodsDown({ list })
				.then(({ data }) => {
					this.props.clearsoldoutList()
					if (data.status != 2) {
						notification.success({
							message: '提示',
							description: '下架单提交成功',
						})
						this.props.getCategory()
							.then(data => {
								if (data.length !== 0) {
									this.props.getGoods({
										category: `${data[0].id}`,
										store_id: this.props.store.data && this.props.store.data.id,
										rows: this.props.setting.rowsnum
									})
								}
							})
					}
				})
		}
		confirm({
			title: '提示',
			content: '是否提交下架单',
			onOk() {
				onOk()
			},
			onCancel() {
				console.log('Cancel');
			},
		})
	}

	totalPrice = () => {
		let totalPrice = 0
		this.props.soldout.list.forEach(item => totalPrice += item.num * +item.posprice)
		return totalPrice.toFixed(2)
	}

	render() {
		var rand = Math.floor(Math.random() * 900) + 1;
		return (
			<div className="audio-controller" style={{ justifyContent: 'space-between' }}>
				<div>
					<div
						style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ccc', width: 105, height: 100 }}
						onClick={() => this.props.history.push({ pathname: '/app/dashboard/73' + rand })}
					>
						<span style={{ fontSize: 16 }}>退出</span>
					</div>
				</div>
				<div className="right row">
					{/*<div className="section1">*/}
					{/*<span>*/}
					{/*报损总金额（元）*/}
					{/*</span>*/}
					{/*<span className="price">{this.totalPrice()}</span>*/}
					{/*</div>*/}
					<div className="section3 row" onClick={this.onSubmit}>
						<div>
							<span className="complete-icon"><i className="iconfont icon-jsq" /></span>
						</div>
						<div className="complete-title">
							<span>提交下架单</span>
							<span className="price" />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(connect(mapStateToProps, { clearsoldoutList, getCategory, getGoods, })(index))