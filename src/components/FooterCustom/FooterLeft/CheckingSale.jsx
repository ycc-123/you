/**
 * file 到店核销
 */

import React, { Component } from 'react'
import { Form, Input, Table, Button, notification} from 'antd'

import { verification, validateOrder } from '@/api'

const FormItem = Form.Item


class CheckingSale extends Component {
	constructor(props) {
		super(props);

		this.state = {
			mid: '',
			dataList: []
		};
	}

	componentDidMount() {
		console.log('xxxxx')
	 	/* eslint-disable */
        // const input = this.refs.saleurl 
        /* eslint-enable */
        // input.focus();
        this.saleurl&&this.saleurl.focus()
        this.setState({saleUrl: ''})
	}

	async requestSaleOrderInfo() {
		try {
			let response = await verification(this.state.mid)
			if(response.data.status === '4002') return
			this.setState({
				dataList: response.data.msg
			})
			console.log(response)
		} catch(error) {
			console.log(error)
		}
	}

	async requestValidateOrder() {
		try {
			let response = await validateOrder(this.state.mid)
			if(response.data.status === '4001') {
				notification.success({
	                message: response.data.msg,
	                description: '订单核销成功',
	            })
	        	this.onClear()
			}
		} catch(error) {
			console.log(error)
		}
	}

	onClear() {
		this.setState({
    		mid: '',
    		dataList: [],
    	})
	}

	renderOrderInfo(info) {
		console.log(info)
		const columns = [
			{
		        title: '名称',
		        dataIndex: 'gname',
		        key: 'gname',
		    },
		    {
		        title: '单价',
		        dataIndex: 'oprice',
		        key: 'oprice',
		    },
		    {
		        title: '数量',
		        dataIndex: 'num',
		        key: 'num',
		    },
		    {
		    	title: '规格',
		        dataIndex: 'item',
		        key: 'item',
		    }
		]
		return(
			<Table
				rowKey="id"
				size="small"
				columns={columns}
				dataSource={info}
			/>
		)
	}

	render() {
		return (
			<div>
				<FormItem>
					<Input.Search
						// ref="saleurl"
						ref={ref => this.saleurl = ref}
						size="large"
						placeholder="扫取顾客二维码"
						style={{width: '80%'}}
						value={this.state.mid}
						onChange={(e) => this.setState({mid: e.target.value})}
						onSearch={this.requestSaleOrderInfo.bind(this)}
						// onBlur={() => this.refs.saleurl.focus()}
						onBlur={() => this.saleurl.focus()}
					/>
			        <Button onClick={this.onClear.bind(this)} style={{marginLeft: 10}} size="large">清空</Button>
				</FormItem>
				{
					this.state.dataList.length !== 0 ? this.renderOrderInfo(this.state.dataList) : null
				}
				{
					this.state.dataList.length !== 0 ? <div onClick={this.requestValidateOrder.bind(this)} style={{textAlign: 'right'}}><Button size="large">确认核销</Button></div> : null
				}
			</div>
		)
	}
}

export default CheckingSale