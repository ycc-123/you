/**
 * file 商品报损
 */
import React, { Component } from 'react'
import { Table, Input } from 'antd'
import { connect } from 'react-redux'

import { WithModal } from '@/widget'
import NumericKeypad, { onVirtualKeyboard } from '@/widget/NumericKeypad'
import { removeFromReportDamageList, updateFromReportDamageList } from '@/action'

const mapStateToProps = (state, ownProps) => ({
	reportdamage: state.reportdamage,
})

class index extends Component {
	constructor(props) {
		super(props);

		this.state = {
			visible: false,
			num: 0,
			costprice: 0,
            posprice: 0,
			columns: [{
				title: '#',
				dataIndex: 'key',
				key: 'key',
				width: '10%',
			},{
				title: '商品',
				width: '30%',
				key: 'name',
				render: (text, recode) => (

					<span>
						<span>{recode.name}</span>
						<br />
						<span>{recode.specname}</span>
					</span>

				)
			},{
				title: '单位',
				width: '10%',
				dataIndex: 'unit_name',
				key: 'unit_name',
			},{
				title: '库存金额',
				key: 'posprice',
				width: '15%',
				render: (text, recode) => (
                	<span onClick={e => {e.stopPropagation();this.onEditCostPirce(recode)}}>
						{(+recode.posprice).toFixed(2)}
					</span>
				)
			},{
				title: '数量',
				key: 'num',
				width: '20%',
				render: (text, recode) => (
					<span onClick={() => this.onEidtNum(recode)}>
						{recode.num}
					</span>
				)
			},{
				title: '操作',
				key: 'action',
				render: (text, recode) => (
					<span>
						<a style={{display: 'block', lineHeight: 2}} onClick={(e) => {e.stopPropagation();this.onDelete(recode)}}>
							<i className="iconfont icon-shanchu" />
						</a>
					</span>
				),
			}]
		};
	}

	onEditCostPirce = item => {
		item = {...item}
		const editInput = value => {
			let output = onVirtualKeyboard(value, this.state.posprice, () => {
	         	item.posprice = Number(this.state.posprice)
				this.props.updateFromReportDamageList(item)
				this.withmodal.colse()
	        })

			this.setState({
                posprice: output
			})
		}
		const render = () => (
			<div>
				<Input
					ref={ref => this.newposproiceinput = ref}
					size="large"
					style={{marginBottom: 20}}
					defaultValue={item.posprice}
					onChange={e => this.setState({posprice: e.target.value})}
					value={this.state.posprice}
				/>
				<NumericKeypad onClick={editInput} />
			</div>
		)
		this.withmodal.show({title: '库存成本',content: render})
	}

	onDelete = item => {
		this.props.removeFromReportDamageList(item)
	}

	onEidtNum(item) {
		item = {...item}
		const editInput = value => {
			let output = onVirtualKeyboard(value, this.state.num, () => {
	         	item.num = Number(this.state.num)
				this.props.updateFromReportDamageList(item)
				this.withmodal.colse()
	        })

			this.setState({ 
				num: output 
			})
		}
		const render = () => (
			<div>
				<Input
					ref={ref => this.newposproiceinput = ref}
					size="large"
					style={{marginBottom: 20}}
					defaultValue={item.num}
					onChange={e => this.setState({num: e.target.value})}
					value={this.state.num}
				/>
				<NumericKeypad onClick={editInput} />
			</div>
		)
		// const focus = () => this.newposproiceinput.focus()
		this.withmodal.show({
			title: '报损数量',
			content: render,
		}).then(res => {
			// focus()
		})

	}

	render() {
		this.props.reportdamage.list.forEach((item, index) => { 
    		item['key'] = index + 1;
    	})
		return (
			<div className="silder-right-body app-sider">
            	<Table
            		defaultExpandAllRows
	            	columns={this.state.columns} 
	            	dataSource={this.props.reportdamage.list}
	            	expandedRowRender={record => <p style={{ margin: 0 }}>{record.remark}</p>}
	            	rowClassName="order-table"
            	/>
            	<WithModal footer={null} ref={(ref) => this.withmodal = ref} />
            </div>
		);
	}
}

export default connect(mapStateToProps,{ removeFromReportDamageList, updateFromReportDamageList })(index)