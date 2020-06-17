/**
 * file 商品调价
 */
import React, { Component } from 'react'
import { Table, Input } from 'antd'
import { connect } from 'react-redux'

import { WithModal } from '@/widget'
import NumericKeypad, { onVirtualKeyboard } from '@/widget/NumericKeypad'
import { removeFromPriceAdjustmentList, updateFromPriceAdjustmentList } from '@/action'

const mapStateToProps = (state, ownProps) => ({
	priceadjustment: state.priceadjustment,
})

class index extends Component {
	constructor(props) {
		super(props);

		this.state = {
			visible: false,
			newposprice: 0,
			newmemberprice: 0,
			middlewareInput: '',
			columns: [{
				title: '#',
				dataIndex: 'key',
				key: 'key',
				width: '10%',
			}, {
				title: '商品',
				key: 'name',
				render: (text, recode) => (

					<span>
						<span>{recode.name}</span>
						<br />
						<span>{recode.specname}</span>
					</span>

				)
			}, {
				title: '单位',
				width: '20%',
				dataIndex: 'changeunitname',
				key: 'changeunitname',
			}, {
				title: '零售价',
				key: 'newposprice',
				width: '20%',
				render: (text, recode) => (
					<span>
						{recode.newposprice}
					</span>
				)
			}, {
				title: '会员价',
				key: 'newmemberprice',
				width: '20%',
				render: (text, recode) => (
					<span>
						{recode.newmemberprice}
					</span>
				)
			}, {
				title: '操作',
				key: 'action',
				render: (text, recode) => (
					<span>
						<a style={{ display: 'block', lineHeight: 2 }} onClick={(e) => { e.stopPropagation(); this.onDelete(recode) }}>
							<i className="iconfont icon-shanchu" />
						</a>
					</span>
				),
			}]
		};
	}

	onDelete = item => {
		this.props.removeFromPriceAdjustmentList(item)
	}

	onSelectedRow(item) {
		item = { ...item }

		const editInput = value => {
			const { middlewareInput } = this.state;
			let output = onVirtualKeyboard(value, this.state[middlewareInput], () => {
				item.newposprice = this.state.newposprice
				item.newmemberprice = this.state.newmemberprice
				this.props.updateFromPriceAdjustmentList(item)
				this.withmodal.colse()
			})

			this.setState({
				[middlewareInput]: output
			})
		}
		this.setState({
			newposprice: item.newposprice,
			newmemberprice: item.newmemberprice,
			middlewareInput: 'newposprice',
		})
		const render = () => (
			<div>
				<Input
					addonBefore="零售价"
					size="large"
					onFocus={() => {
						this.setState({
							middlewareInput: 'newposprice',
							newposprice: '',
						})
					}}
					style={{ marginBottom: 20 }}
					onChange={e => this.setState({ newposprice: e.target.value })}
					value={this.state.newposprice}
				/>
				{
					item.is_memberprice == 2
						? <Input
							addonBefore="会员价"
							size="large"
							onFocus={() => {
								this.setState({
									middlewareInput: 'newmemberprice',
									newmemberprice: '',
								})
							}}
							style={{ marginBottom: 20 }}
							onChange={e => this.setState({ newmemberprice: e.target.value })}
							value={this.state.newmemberprice}
						/>
						: null
				}
				<NumericKeypad onClick={editInput} />
			</div>
		)
		// const focus = () => this.newposproiceinput.focus()
		this.withmodal.show({
			title: '修改售价',
			content: render,
			width: 378,
		}).then(res => {
			// focus()
		})

	}

	render() {
		this.props.priceadjustment.list.forEach((item, index) => {
			item['key'] = index + 1;
		})
		return (
			<div className="silder-right-body app-sider">
				<Table
					columns={this.state.columns}
					dataSource={this.props.priceadjustment.list}
					rowClassName="order-table"
					onRow={(record) => ({
						onClick: () => this.onSelectedRow(record),// 点击行
					})}
				/>
				<WithModal footer={null} ref={(ref) => this.withmodal = ref} />
			</div>
		);
	}
}

export default connect(mapStateToProps, { removeFromPriceAdjustmentList, updateFromPriceAdjustmentList })(index)
