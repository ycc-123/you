/**
 * file 商品上架
 */
import React, { Component } from 'react'
import { Table, Input, Icon, } from 'antd'
import { connect } from 'react-redux'

import { WithModal } from '@/widget'
import NumericKeypad, { onVirtualKeyboard } from '@/widget/NumericKeypad'
import { removeputawayList, updateputawayList } from '@/action'

const mapStateToProps = (state, ownProps) => ({
	putaway: state.putaway,
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
				width: '25%',
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
				width: '15%',
				dataIndex: 'unit_name',
				key: 'unit_name',
			},{
				title: '单价',
				key: 'posprice',
				width: '15%',
				render: (text, recode) => (
                    // onClick={e => {e.stopPropagation();this.onEditCostPirce(recode)}}
					<span>
						{(+recode.posprice).toFixed(2)}
					</span>
				)
			},{
				title: '数量',
				key: 'num',
				width: '20%',
				render: (text, recode) => (
                    // onClick={() => this.onEidtNum(recode)}
					<span>
						{recode.stock}
					</span>
				)
			},{
				title: '操作',
				key: 'action',
				render: (text, recode) => (
					<span>
						<a style={{display: 'block', lineHeight: 2}} onClick={(e) => {e.stopPropagation();this.onDelete(recode)}}>
							<Icon
                                type="minus-circle"
                                style={{
                                    fontSize: '20px',
                                }}
                            />
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
				this.props.updateputawayList(item)
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
		this.props.removeputawayList(item)
	}

	onEidtNum(item) {
		item = {...item}
		const editInput = value => {
			let output = onVirtualKeyboard(value, this.state.num, () => {
	         	item.num = Number(this.state.num)
				this.props.updateputawayList(item)
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
			title: '上架数量',
			content: render,
		}).then(res => {
			// focus()
		})

	}

	render() {
		this.props.putaway.list.forEach((item, index) => { 
    		item['key'] = index + 1;
    	})
		return (
			<div className="silder-right-body app-sider">
            	<Table
            		defaultExpandAllRows
	            	columns={this.state.columns} 
	            	dataSource={this.props.putaway.list}
	            	// expandedRowRender={record => <p style={{ margin: 0 }}>{record.remark}</p>}
	            	rowClassName="order-table"
            	/>
            	<WithModal footer={null} ref={(ref) => this.withmodal = ref} />
            </div>
		);
	}
}

export default connect(mapStateToProps,{ removeputawayList, updateputawayList })(index)