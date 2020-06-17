import { clearMember, clearOrderList, setOrderList } from '@/action';
import { getWeightLog } from '@/api';
import { Menu, Popconfirm, notification,Modal,Button,Form, Input, Radio ,AutoComplete } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.less';

const mapStateToProps = (state, ownProps) => ({
  store: state.store,
  setting: state.setting
})

class SiderRightHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      visible: false,
      shwoOnSetOrder:false
      // data:[],
      // current: props.selectedName,
    };
  }

  // componentDidMount() {
  //     this.gettemp()
  // }

  // 获取温度预警
  // gettemp(){
  // 	let that=this;
  //     if(this.props.setting.istemp){
  //         setInterval(function () {
  //             getTempShow({store_id:that.props.store.data.id})
  //                 .then(res => {
  // 					console.log('oooooooooooooooo',that.state.data,res)
  // 					if(res.data.status == 9002){

  // 					}else{
  // 						if(res.status == 200 && res.data != "" && res.data.data != ""){
  // 							that.setState({
  // 								data:res.data.data,
  // 								visible: true,
  // 							})
  // 						}
  // 					}
  //                 })
  //         },180000)
  //     }
  // }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleClick = (e) => {
    if (e.key === 'currentOrder' || e.key === 'pendingOrder') {
      this.props.onClick(e.key)
    }
  }

  // onDelete() {
  // 	this.props.dispatch(clearOrderList())
  // }
 

  onSetOrderList() {
    //获取挂单时间
    var today = new Date();
    var hour = "00" + today.getHours();
    hour = hour.substr(hour.length - 2);
    var minute = "00" + today.getMinutes();
    minute = minute.substr(minute.length - 2);
    let date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '   ' + hour + ':' + minute;
    let { order } = this.props
    let oldgtime = order.dataList[0][0].gtime
    let oldremake = order.dataList[0][0].remake
    // if(oldremake){
    for (var i = 0; i < order.dataList[order.orderIndex].length; i++) {
      order.dataList[order.orderIndex][i].remake = this.state.oldremake
    }
    // }else{
      // for (var i = 0; i < order.dataList[order.orderIndex].length; i++) {
      //   order.dataList[order.orderIndex][i].remake = '无'
      // }
    // }
    if (order.orderIndex === -1 || order.dataList[order.orderIndex].length === 0) return
    if(oldgtime){
      for (var i = 0; i < order.dataList[order.orderIndex].length; i++) {
        order.dataList[order.orderIndex][i].gtime = oldgtime
      }
    }else{
      for (var i = 0; i < order.dataList[order.orderIndex].length; i++) {
        order.dataList[order.orderIndex][i].gtime = date
        
      }
    }
   
    

    this.props.dispatch(setOrderList(this.props.member.data || null, order.dataList[0]))
      .catch(res => {
        notification.error({
          message: '提示',
          description: '接口出错，无法挂单',
        })
      })
    this.props.member.data && this.props.dispatch(clearMember())
    
  }

  onConfirm() {
    let { order } = this.props
    if (order.orderIndex === -1 || order.dataList[order.orderIndex].length === 0) return
    this.props.dispatch(clearOrderList(order.orderIndex))
    // this.props.dispatch(setOrderList())

    let q = order.dataList[0].map(item => {
      item.weight = item.num
      return item
    })

    getWeightLog({
      goods: q,
      delete_reason: "批量删除",
      storeid: this.props.store.data.id,
    })
  }
  onSetOrder(){
    let { order } = this.props
    let isRmake = localStorage.getItem('isRmake')?localStorage.getItem('isRmake'):"1"
    if(isRmake=="2"){
      this.setState({
        oldremake:'无'
      })
      this.onSetOrderList()
    }else{
      this.setState({
        shwoOnSetOrder:true,
        oldremake:order.dataList[order.orderIndex][0].remake ? order.dataList[order.orderIndex][0].remake : ''
      })
    }
    
  }
  handleOkSetOrder(){
      this.onSetOrderList()
      this.setState({
        shwoOnSetOrder:false
      })

    

    
  }
  handleCancelSetOrder(){
    this.setState({
      shwoOnSetOrder:false
    })
  }
  remakeChange(event){
    this.setState({
      oldremake:event.target.value
    })
  }
  render() {
    // const [form] = Form.useForm();
    return (

      <div className="silder-right-header">
        {/* {
					this.props.setting.istemp&&this.state.visible?
						<div style={{height:'140px'}}>
							<Drawer
								title="温度报警"
								placement="right"
								closable={true}
								onClose={this.onClose}
								visible={this.state.visible}
								mask={false}
								width={'360px'}
							>
								{
									this.state.data.map((item, index) => (
										<p key={index}>
											{index+1}、{item.devname} 里面温度 {item.alert_type == 1 ?'偏高':'偏低'} 温度为 {item.temperature} 摄氏度。
										</p>
									))
								}
							</Drawer>
						</div>
					:
					null
				} */}
        
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
              style={{ color: "#333" }}
              onClick={this.onSetOrder.bind(this)}
            >
              挂单
						</span>
          </Menu.Item>

          <Menu.Item key="delete" disabled>
            <Popconfirm title="确定删除该订单?" onConfirm={this.onConfirm.bind(this)} okText="确定" cancelText="取消">
              <span style={{ color: "#333" }}>删除</span>
            </Popconfirm>
          </Menu.Item>

          <Menu.Item key="pendingOrder">
            <span className="menu_child">
              取单
						</span>
          </Menu.Item>
        </Menu>
        <Modal
          title="挂单备注"
          visible={this.state.shwoOnSetOrder}
          onOk={this.handleOkSetOrder.bind(this)}
          onCancel={this.handleCancelSetOrder.bind(this)}
        >
        <Form.Item label="挂单备注">
           <Input
           placeholder="请输入备注"
           value={this.state.oldremake}
           onChange={event=>this.remakeChange(event)}
         /> 
         {/* <AutoComplete
            placeholder="请输入备注"
            options={[{ value: 'text 1' }, { value: 'text 2' }]}
            onChange={event=>this.remakeChange(event)}
            value={this.state.oldremake}
          /> */}
        </Form.Item>
        </Modal>
      </div>
      
    )
  }
}

export default connect(mapStateToProps)(SiderRightHeader)
