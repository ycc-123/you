import React, { Component, createRef, } from 'react'
import { Popover, Table, Select, } from 'antd'
import { connect } from 'react-redux'
import { Modal, Form, Radio, Input, Button } from 'antd'

import { NumericKeypad } from '@/widget'
import { removeFromOrderList, updateFromOrderList,getStore } from '@/action'
import { getWeight, getWeightLog } from '@/api'
import { withRouter } from "react-router-dom";
import freebie from "@/assets/img/freebie.png";

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const mapStateToProps = (state, ownProps) => ({
	store: state.store,
	setting: state.setting
})

const { Option } = Select

class SiderRightBody extends Component {
	constructor(props) {
		super(props);

		this.state = {
			is_first: false,
			collapsed: false,
			visible: false,
			modifyType: 'num',
			tabSwitch: 'tab-discount_fee',
			selectedItem: {},
			store: this.props.store,
			currentValue: {
				posprice: 0,
				discount: 0,
				subtotal: 0,
				num: 0,
			},
			storeState:null,
			isNum: 1,
			columns: [{
				title: '#',
				key: 'key',
				width: '15%',
				render: (text) => (<span
					style={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					{text.key}
					{
						text.is_freegift == 2 ? <img alt="" src={freebie} /> : null
					}
				</span>)
			}, {
				title: '商品',
				key: 'name',
				render: (text, recode) => {
					return (
						<span>
							<span>{recode.name}</span>
							<br />
							<span>{recode.specname}</span>
						</span>
					)
				}
			}, {
				title: '售价',
				key: 'posprice',
				width: '20%',
				render: (text, recode) => (
					// console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnn',recode)
					<span>
						{
							Number(recode.discount_fee) !== 0 ?
								<span>
									{
										this.state.storeState&&this.state.storeState.show_originprice_secondscreen=="2"?
										<span className="invalid-line">{(+recode.posprice).toFixed(2)}元/{recode.changeunitname}</span>:''
									}
									
									<br />
									{
										recode.modifyprice ? (+recode.modifyprice).toFixed(2) :
											(Number(recode.posprice) - Number(recode.discount_fee)).toFixed(2)
									}元/{recode.changeunitname}
								</span>
								:
								<span>
									{(+recode.posprice).toFixed(2)}元/{recode.changeunitname}
									<br />
									{recode.specialPrice ? <i
										style={{ color: 'red' }}>{Number(recode.specialPrice).toFixed(2)}元/{recode.changeunitname}</i> : null}
								</span>
						}
					</span>
				)
			}, {
				title: '数量',
				key: 'num',
				width: '15%',
				render: (text, recode) => (
					<span>
						{String(recode.num).match(/\d{0,}\.{0,1}\d{0,3}/) ? String(recode.num).match(/\d{0,}\.{0,1}\d{0,3}/)[0] : recode.num}
					</span>
				),
			}, {
				title: '小计',
				key: 'subtotal',
				width: '20%',
				render: (text, recode) => {
					return (
						<span>
							{
								Number(recode.discount_fee) !== 0
									? <span>
										{
											this.state.storeState&&this.state.storeState.show_originprice_secondscreen=="2"?
											<span className="invalid-line">
											{
												recode.modifyprice
													? this.precisionControl(Number(recode.posprice) * recode.num)
													: this.precisionControl(recode.subtotal)
											}
											元</span>:''
										}
										
										<br />
										{/*this.precisionControl(((Number(recode.posprice) - Number(recode.discount_fee)) * recode.num).toFixed(3))*/}
										{this.precisionControl(recode.subtotal)}元
									</span>
									: <span>
										{this.precisionControl(Number(recode.posprice) * recode.num)}元
										<br />
										{
											recode.specialPrice
												? <i
													style={{ color: 'red' }}
												>
													{this.precisionControl((recode.specialPrice * recode.num).toFixed(3))}元
												</i>
												: null
										}
									</span>
							}
						</span>
					)
				}
			}, {
				title: '操作',
				key: 'action',
				render: (text, recode) => (
					<span>
						{
							this.props.setting.remove ? <Popover
								content={this.selectOption(recode)}
								trigger="click"
							>
								<i
									style={{
										color: "rgb(253, 116, 56)"
									}}
									className="iconfont icon-shanchu"
								/>
							</Popover> : <i
									style={{
										color: "rgb(253, 116, 56)"
									}}
									className="iconfont icon-shanchu"
									onClick={() => {
										let r = { ...recode, weight: recode.num }
										let list = {
											goods: [r],
											weight: r.num,
											delete_reason: '误触',
											storeid: this.props.store.data.id
										}
										getWeightLog(list)
										this.props.dispatch(removeFromOrderList(r.barcode, this.props.orderIndex))
									}}
								/>
						}
					</span>
				),
			}]
		};
	}
	//精度控制
	round(num, decimal) {
		if (isNaN(num)) {
			return 0;
		}
		const p1 = Math.pow(10, decimal + 1);
		const p2 = Math.pow(10, decimal);
		return Math.round(num * p1 / 10) / p2;
	}

	toFixed(num, decimal) {
		return this.round(num, decimal).toFixed(decimal);
		// return this.round(num, decimal).toFixed(decimal);
	}
	precisionControl(value) {
		let { data } = this.props.store
		if (data) return data.total_set === 1 ? this.toFixed(value, data.total_accuracy) : value.toString().substring(0, value.toString().indexOf('.') + data.total_accuracy + 1)
		// return value.toFixed(2)
		// console.log(data.total_set === 1 ? value.toFixed(data.total_accuracy) : value.toString().substring(0, value.toString().indexOf('.') + data.total_accuracy + 1))
	}
	componentDidMount(){
		this.props.getStore().then(res=>{
			console.log(res.data)
			this.setState({
				storeState:res.data
			},()=>{
				console.log(this.state.storeState.show_originprice_secondscreen)
			})
		})
	}
	render() {
		//处理小计问题
		this.props.dataList.forEach((item, index) => {
			item['key'] = index + 1;
			//处理会员价和修改价格
			if (item['modifyprice'] || item['modifyprice'] == 0) {
				item['subtotal'] = this.precisionControl(item.modifyprice * item.num)
			} else {
				if (item.specialPrice) {
					item['subtotal'] = this.precisionControl(item.specialPrice * item.num)
				} else {
					item['subtotal'] = this.precisionControl(item.posprice * item.num)
				}
			}
		})
		return (
			<div className="silder-right-body app-sider" style={{ width: '100%' }}>
				<Table
					// `table-back order-table  ${this.props.setting.fontSize === 8 ? 'fs' : '' } ${this.props.setting.fontSize === 14 ? 'fm' : '' } ${this.props.setting.fontSize === 17 ? 'fb' : '' } `
					// `order-table  ${this.props.setting.fontSize === 8 ? 'fs' : '' } ${this.props.setting.fontSize === 14 ? 'fm' : '' } ${this.props.setting.fontSize === 17 ? 'fb' : '' } `
					columns={this.state.columns}
					dataSource={this.props.dataList}
					rowClassName={(recode, idx) => {
						if (recode.is_freegift == 2) {
							return `order-table  ${this.props.setting.fontSize === 8
								? 'fs'
								: ''} ${this.props.setting.fontSize === 14
									? 'fm'
									: ''} ${this.props.setting.fontSize === 17
										? 'fb'
										: ''} `
						}
						if (recode.discount_fee !== 0) {
							return this.precisionControl(recode.subtotal) == 0
								? `table-back order-table  ${this.props.setting.fontSize === 8
									? 'fs'
									: ''} ${this.props.setting.fontSize === 14
										? 'fm'
										: ''} ${this.props.setting.fontSize === 17
											? 'fb'
											: ''} `
								: `order-table  ${this.props.setting.fontSize === 8
									? 'fs'
									: ''} ${this.props.setting.fontSize === 14
										? 'fm'
										: ''} ${this.props.setting.fontSize === 17
											? 'fb'
											: ''} `
						} else {
							return recode.specialPrice ? (this.precisionControl((recode.specialPrice * recode.num).toFixed(3)) == 0 ? `table-back order-table  ${this.props.setting.fontSize === 8 ? 'fs' : ''} ${this.props.setting.fontSize === 14 ? 'fm' : ''} ${this.props.setting.fontSize === 17 ? 'fb' : ''} ` : `order-table  ${this.props.setting.fontSize === 8 ? 'fs' : ''} ${this.props.setting.fontSize === 14 ? 'fm' : ''} ${this.props.setting.fontSize === 17 ? 'fb' : ''} `) : (+recode.posprice * recode.num == 0 ? `table-back order-table  ${this.props.setting.fontSize === 8 ? 'fs' : ''} ${this.props.setting.fontSize === 14 ? 'fm' : ''} ${this.props.setting.fontSize === 17 ? 'fb' : ''} ` : `order-table  ${this.props.setting.fontSize === 8 ? 'fs' : ''} ${this.props.setting.fontSize === 14 ? 'fm' : ''} ${this.props.setting.fontSize === 17 ? 'fb' : ''} `)
						}
					}}
				/>
				{/* <Modal
          wrapClassName="silder-right-modal"
          title={this.state.modifyType === 'num' ? '修改商品数量' : '单品临时减免/折扣'}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={() => this.setState({ visible: false })}
          footer={null}
          width={this.state.modifyType === 'num' ? '500px' : '100%'}
          className="countModal"
        >
          {this.state.modifyType === 'num' ? this.renderModifyNum() : this.renderModifySubtotal()}
        </Modal> */}
			</div>
		)
	}
}

// export default connect(mapStateToProps)(SiderRightBody)
export default withRouter(connect(mapStateToProps, { getStore })(SiderRightBody));
