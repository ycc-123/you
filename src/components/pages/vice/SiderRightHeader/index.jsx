import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearOrderList, setOrderList, clearMember } from '@/action'
import { Menu, Popconfirm} from 'antd'


class SiderRightHeader extends Component {
	constructor(props) {
		super(props);

		this.state = {
			collapsed: false,
			// current: props.selectedName,
		};
	}

	handleClick = (e) => {
		if(e.key === 'currentOrder' || e.key === 'pendingOrder') {
			this.props.onClick(e.key)
		}
	}

	// onDelete() {
	// 	this.props.dispatch(clearOrderList())
	// }

	onSetOrderList() {
		let { order } = this.props
		if(order.orderIndex === -1 || order.dataList[order.orderIndex].length === 0) return
		this.props.dispatch(setOrderList(this.props.member.data || null))
		this.props.member.data&&this.props.dispatch(clearMember())
	}

	onConfirm() {
		let { order } = this.props
		if(order.orderIndex === -1 || order.dataList[order.orderIndex].length === 0) return 
		this.props.dispatch(clearOrderList(order.orderIndex))
		this.props.dispatch(setOrderList())
	}

    render() {
        return (
            <div className="silder-right-header">
				<Menu
					onClick={this.handleClick}
					selectedKeys={[this.props.selectedName]}
					mode="horizontal"
					
				>
					<Menu.Item key="currentOrder">
						<span className="menu_child" key="new">
							新订单
						</span>
					</Menu.Item>

					<Menu.Item key="gua" disabled>
						<span 
							// className="menu_child"
							style={{color: "#333"}} 
							onClick={this.onSetOrderList.bind(this)}
						>
							挂单
						</span>
					</Menu.Item>

					<Menu.Item key="delete" disabled>
						<Popconfirm title="确定删除该订单?" onConfirm={this.onConfirm.bind(this)} okText="确定" cancelText="取消">
							<span style={{color: "#333"}}>删除</span>
						</Popconfirm>
					</Menu.Item>

					<Menu.Item key="pendingOrder">
						<span className="menu_child">
							取单
						</span>
					</Menu.Item>
				</Menu>
            </div>
        )
    }
}

export default connect()(SiderRightHeader)
