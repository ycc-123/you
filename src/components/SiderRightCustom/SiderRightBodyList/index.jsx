import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearOrderList, clearMember, setOrderList, replaceOrderList, resetMember } from '@/action'
import { Table, Popover, Select, notification,Modal, Button,Input, message  } from 'antd'
import { getPendingOrder, delPendingOrder,getPendingOrderupdate,printList,feierPrint } from '@/api'
import moment from 'moment'

const { Option } = Select;

const mapStateToProps = (state, ownProps) => ({
  store: state.store,
})

class SiderRightBodyList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      loading: false,
      visible: false,
      // dataList: props.dataList,
      columns: [
        {
          title: '商品',
          // key: 'name',
          width:"25%",
          render: (text, record, index) => (
            <span onClick={() => this.onSelectedRow(record)}>
              {
                this.strConcat(record.list)
              }
            </span>


          ),
        },
        {
          title: '挂单时间',
          width: '30%',
          // key: 'name',
          render: (text, record, index) => (
            <span onClick={() => this.onSelectedRow(record)}>
              {
                this.strtime(record.list)
              }
            </span>

          ),
        },
        {
          title: '合计',
          // key: 'calc',
          width: '25%',
         
          render: (text, record, index) => (
            <span onClick={() => this.onSelectedRow(record)}>
              {
                this.calcCash(record.list)
              }
              元
            </span>
          ),
        },
        {
          title: '备注',
          // key: 'calc',
          width: '25%',
          className:(localStorage.getItem('isRmake') ? localStorage.getItem('isRmake') : '2') == '1' ? 'isRemake' : 'aa',
           
          // showHeader:false,
          render: (text, record, index) => (
            <span onClick={() => this.onSelectedRow(record)}>
              {
                this.strremake(record.list)
              }
              
            </span>
          ),
        },
        {
          title: '操作',
          key: 'action',
          render: (text, recode) => (
            <span>
             
              <a onClick={() => this.showDalog(recode)}>
                <i className="iconfont icon-soushuo" />
              </a>
              <div>
              <a onClick={() => this.onDelete(recode)}>
                <i className="iconfont icon-shanchu" />
              </a>
              </div>
             
            </span>
            
          ),
        },
      ],
      dataItem: [],
      menberList: [],
      members:{
        vip:null
      }
    };
  }

  async componentDidMount() {
    this.componentDid()
  }
  componentDid(){
    // let isRmake = localStorage.getItem('isRmake') ? localStorage.getItem('isRmake') : '2'
    // if(isRmake==1){
    //   this.setState({
    //     isRmake:false
    //   })
    // }else{
    //   this.setState({
    //     isRmake:true
    //   })
    // }
    getPendingOrder().then((response)=>{
      console.log(response.data)
    if (response && response.data && response.data.status == 1) {
      let { data } = response.data
      let dataItem = []
      let menberList = []
      let remake = []
      
      for (const [key, value] of data.entries()) {
        dataItem.unshift({
          id: value.id,
          list: JSON.parse(value.msg)['0'],
        })
        menberList.unshift({
          id: value.id,
          vip: JSON.parse(value.msg)['1'],
        })
        remake.unshift({
          id: value.id,
          remake: JSON.parse(value.msg)['2'],
        })

      }
      console.log(dataItem)
      this.setState({
        dataItem,
        menberList,
        remake
      })
    }
    })
    
  }

  rowClassName = (record, index) => {
    if (this.props.order.dataList[0].length === 0) {
      index++
    }
    return index === this.props.order.orderIndex ? 'row_dismiss' : 'row_show'
  }

  //拼接商品订单字符串
  strConcat(datas) {
    let str = ''
    datas.forEach((item, index) => {
      index === datas.length - 1 ? str += item.name : str += item.name + ','
    })
    return str
  }

  strtime(datas) {
    let str = ''
    datas.forEach((item, index) => {
      str = item.gtime
    })
    return str
  }
  strremake(datas) {
    let str = ''
    datas.forEach((item, index) => {
      str = item.remake
    })
    return str
  }

  //计算订单总价
  calcCash(datas) {
    let sum = 0
    datas.forEach((item, index) => {
      sum += Number(item.subtotal)
    })
    // console
    return sum.toFixed(2)
  }

  onDelete(delIndex) {
    delPendingOrder({ id: delIndex.id })

    let { dataItem } = this.state

    dataItem = dataItem.filter(item => {
      return item.id !== delIndex.id
    })
    this.setState({
      dataItem,
    })
    // this.state.dataList.splice(delIndex,1)
    // this.props.dispatch(clearOrderList(delIndex + (this.props.order.dataList[0].length === 0 ? 1 : 0)))
  }
  showDalog(detail){
    console.log(detail)
    let a = this.state.menberList.find(item => {
      return detail.id === item.id
    })
    let b = this.state.remake.find(item => {
      return detail.id === item.id
    })
    // console.log(a)
    console.log(b)
    this.setState({
      goods_detail:detail,
      visible: true,
      detail_tab:[  
        {
          title:'商品',
          dataIndex:"name"
        },
        {
          title:"原价",
          dataIndex:"posprice"
        },
        {
          title:"售价",
          dataIndex:"modifyprice"
        },
        {
          title:"小计",
          dataIndex:"subtotal"
        }
        
        
      ],
      detail_data:detail.list,
      members : a.vip,
      beizhu:this.calcCash(detail.list),
      remakeVal:detail.list[0].remake=='无' ? '' : detail.list[0].remake
    },()=>{
      let orderlist = this.state.detail_data
      for(let i=0;i<orderlist.length;i++){
        if(!orderlist[i].modifyprice){
          orderlist[i].modifyprice= orderlist[i].posprice
        }
      }
      this.setState({
        detail_data:orderlist
      })
    })
    
  }
  handleOk = () => {
    this.setState({ loading: true });
    let msg ;
    let orderlist = this.state.detail_data
    for(let i=0;i<orderlist.length;i++){
      if(!orderlist[i].modifyprice){
        orderlist[i].modifyprice= orderlist[i].posprice
      }
    }
    console.log(orderlist)
    let member = this.state.members
    let remake = this.state.remakeVal
    console.log(this.state.remakeVal)
    msg = JSON.stringify({
      '0': orderlist,
      '1': member,
      '2': remake,
      '3': this.state.beizhu
    })
    let wifi_print = localStorage.getItem('wifi_print')
    console.log(wifi_print)
    if(wifi_print=='1'){
      feierPrint({
        msg:msg
      }).then((res)=>{
        if(res.data.status == 1){
          message.success = "打印成功"
        }else{
          message.error = "打印失败"
        }
      })
    }
    printList({
      msg:msg
    }).then((res)=>{
      if(res.data.status == 1){
        message.success = "打印成功"
        this.setState({
           loading: false,
          visible: false  
          },()=>{
            // window.history.go(0)
            this.componentDid()
          });
      }else{
        message.error = "打印失败"
      }
    })
   
  };

  handleCancel = () => {
    this.setState({ visible: false },()=>{
      // window.history.go(0)
      this.componentDid()
    });
  };
  setRemake(value){
    // let {order,member} = this.props
    // console.log(order)
    // this.setState({
    //   remakeVal:value
    // })
    console.log(value)
    let msg ;
    let orderlist = this.state.detail_data
    let member = this.state.members
    let remake = value
    for(let i=0;i<orderlist.length;i++){
      orderlist[i].remake = remake
    }
    console.log(member)
    console.log(this.state.detail_data)
    this.setState({
      remakeVal:remake
    })
    msg = JSON.stringify({
      '0': orderlist,
      '1': member,
      '2': remake,
      '3': this.state.beizhu
    })
    getPendingOrderupdate({
      id:this.state.goods_detail.id,
      msg:msg
    }).then((res)=>{
      // console.log(res)
      if(res.data.status == 1){
        message.success('提交成功')
        this.handleCancel()
      }
      console.log(res)
      
    })
  }
  async onSelectedRow(value) {
    console.log(value)
    let date = moment().format('YYYY/MM/DD   HH:mm')
    let { order } = this.props
   
    if (order.dataList[0] && order.dataList[0].length > 0) {
      order.dataList[0] = order.dataList[0].map(item => {
        item.gtime = date
        
        return item
      })
      await this.props.setOrderList(this.props.member.data || null, order.dataList[0])
        .catch(res => {
          notification.error({
            message: '提示',
            description: '接口出错，无法挂单',
          })
        })
      this.props.member.data && this.props.clearMember()
    }

    await delPendingOrder({ id: value.id })
    this.props.replaceOrderList(value.list)
    this.props.resetMember(this.state.menberList.find(item => {
      return value.id === item.id
    }).vip)
    this.props.onClick('currentOrder')
  }
  remakeChange(event){
    console.log(event)
    this.setState({
      remakeVal:event.target.value
    })
  }
  //把挂单改变成订单  传递orderIndex
  render() {
    let { dataItem } = this.state
    const { visible, loading } = this.state;
    const { Search } = Input;
    return (
      <div>
         <Table
        columns={this.state.columns}
        dataSource={dataItem}
      // rowClassName={this.rowClassName}
      />

        <Modal
          visible={visible}
          title="挂单详情"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="620px"
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              返回
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              打印
            </Button>,
          ]}
        >
          
          
          <div>
            {this.state.members?
               <span>会员名称：{this.state.members.name}&nbsp;&nbsp;&nbsp;&nbsp;</span> :''
            }
            {this.state.members?
              <span>会员账号：{this.state.members.member_mobile}&nbsp;&nbsp;&nbsp;&nbsp;</span>:''
            }
            {this.state.detail_data?
               <span>挂单时间：{this.state.detail_data[0].gtime}</span>:''
            }
           
          </div>
          
          <Table columns={this.state.detail_tab} dataSource={this.state.detail_data} size="middle" />
          <span>合计：{this.state.beizhu}元</span>
          
          <Search
          addonBefore="备注"
          placeholder= '请输入备注'
          enterButton="提交"
          size="large"
          onSearch={value => this.setRemake(value).bind(this)}
          value = {this.state.remakeVal}
          onChange = {event => this.remakeChange(event)}
        />

        </Modal>
      </div>
     
      
    )
  }
}

export default connect(mapStateToProps, { clearOrderList, clearMember, setOrderList, replaceOrderList, resetMember })(SiderRightBodyList)
