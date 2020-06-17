import React, { Component, Fragment } from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'
import { addGuide, clearGuide } from '@/action'
import { guider_list } from '@/api'
import './index.less'

// const data=[
//     ['查看快捷键：F1','修改数量：F3','商品改价：F6','输入手机号：F8','全屏：F11','删除商品：Dlelet','选中上一行：↑','展开分组：←','新增订单：','取消：Esc'],
//     ['重新取重：F2','减免/折扣：F4','输入商品编码：F7','打印订单：F10','结算：F12','退出全屏：F11/Esc','选中下一行：↓','收起分组：→','删除订单：-','确定：Enter']
// ];

const mapStateToProps = (state, ownProps) => ({
	guide: state.guide,
	store: state.store,
})

// const ShortcutKeyCustom = () => (
//     <div style={{overflow: 'hidden'}}>
//         {
//           data.map((item, index) => (
//              <ul className="app-shortcut" key={index}>
//                 {item.map((item1, index1) => <li className="l-li" key={index1}>{item1}</li>)}
//             </ul> 
//           ))
//         }
//     </div>
// )

class ShortcutKeyCustom extends Component {
	constructor(props) {
		super(props)
		this.state = {
			def_arr: [],
		}
	}

	async componentDidMount() {
		let val = await guider_list()
			.catch(err => { console.log(err) })
		if (val && val.data["status"]) {
			let { data: { data } } = val
			this.setState({
				def_arr: data,
			})
		}
	}
	onResetClick = () => {
		this.props.clearGuide()
		this.props.onClose()
	}
	onhandleClick = item => {
		this.props.addGuide(item)
		this.props.onClose()
	}
	/**
	 * [设置导购员]
	 * @param info 导购员信息
	 */
	set_guide = (info) => {
		localStorage.setItem("_guider", JSON.stringify({
			guiderId: info.id,
			guiderName: info.name,
		}))
		this.props.onClose()
	}
	render() {
		const { store, guide } = this.props
		return (
			<Fragment>
				{
					this.props.store.data && this.props.store.data.isdg == 0 ? <div

					>
						{
							this.state.def_arr.map((item) => <Button
								style={{
									fontSize: '16px',
									width: '80px',
									height: '80px',
									padding: '0px',
									margin: '10px',
								}}
								onClick={() => this.set_guide(item)}
							>
								{item.name}
							</Button>)
						}
					</div> : <div>
							{
								store.data.guide.map(item => <Button
									style={{
										fontSize: '16px',
										width: '80px',
										height: '80px',
										padding: '0px',
										margin: '10px',
									}}
									size="large"
									icon={guide.data && item.id === guide.data.id ? 'check' : null}
									key={`guide${item.id}`}
									onClick={() => this.onhandleClick(item)}
								>
									{item.nick_name}
								</Button>)
							}
							<Button
								style={{
									fontSize: '16px',
									width: '80px',
									height: '80px',
									padding: '0px',
									margin: '10px',
								}}
								size="large" type="dashed" onClick={this.onResetClick}>置空</Button>
						</div>
				}
			</Fragment>
		)
	}
}
export default connect(mapStateToProps, { addGuide, clearGuide })(ShortcutKeyCustom)




