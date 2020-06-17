import React, { Component, createRef } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, Button, Input, DatePicker, Row, Col, Table, InputNumber, Switch, Form, notification, message } from 'antd'
import { connect } from 'react-redux'
import screenfull from 'screenfull'
import moment from 'moment'
import 'moment/locale/zh-cn'
import {
  getCashierRecord,
  updateCashierRecord,
  IsUpdate,
  getCashierRecords,
  printCashierRecord,
  getWeight,
  getWeightShow,
  getPendingOrder,
  getstore
} from '@/api'
import { changeSetting } from '@/action'
import { NumericKeypad, WithModal } from '@/widget'
import { clearAllCookie } from '@/utils'
import logo from '../../style/imgs/header_logo.png'
import './index.less'

moment.locale('zh-cn')

const { RangePicker } = DatePicker
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const COLUMNS = [
  {
    title: '',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '笔数',
    dataIndex: 'num',
    key: 'num',
  },
  {
    title: '现金',
    dataIndex: 'cash',
    key: 'cash',
  },
  {
    title: '微信扫码',
    dataIndex: 'wechat',
    key: 'wechat',
  },
  {
    title: '支付宝扫码',
    dataIndex: 'alipay',
    key: 'alipay',
  },
  {
    title: '个人微信',
    dataIndex: 'personWechat',
    key: 'personWechat',
  },
  {
    title: '个人支付宝',
    dataIndex: 'personAlipay',
    key: 'personAlipay',
  },
  {
    title: '银行卡',
    dataIndex: 'bank',
    key: 'bank',
  },
  {
    title: '会员余额',
    dataIndex: 'member',
    key: 'member',
  },
  {
    title: '购物卡',
    dataIndex: 'shopCard',
    key: 'shopCard',
  },
  // {
  //   title: '口碑支付',
  //   dataIndex: 'koubei',
  //   key: 'koubei',
  // },
]

const mapStateToProps = (state, ownProps) => ({
  sale: state.sale,
  store: state.store,
  guide: state.guide,
  setting: state.setting,
})

class HeaderCustom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      print: true,
      focusInputName: 'receipts',
      receipts: '0.00',// 实收金额
      advance: '0.00',// 备用金
      dataList: [],
      historyCashierRecordList: [],// 历史交班单
      loginTime: {},
      isUpdate: false,
      goodweight: this.props.setting.goodweight,
      isshow: false,//跟新modal
      detailed: false,
    }

    this.refIcon = createRef()
  }

  componentDidMount() {

    this.isUpdate()
    this.getgoodsweight()

    // 设置收营员缓存
    if (localStorage.getItem('CashierTime')) {

    } else {
      // 时间戳
      let zz = /\d{10}/
      let substr = zz.exec(Date.parse(new Date()))

      localStorage.setItem('CashierTime', substr[0])
      localStorage.setItem('isupdate', false)
    }
  }

  getgoodsweight() {
    let { store, guide } = this.props
    let that = this;
    if (this.props.setting.isweight) {
      setInterval(function () {
        getWeightShow()
          .then(res => {
            that.setState({
              goodweighta: res.data
            })
          })
      }, 300)
    } else {
      getWeight()
        .then(res => {
          if (res.data) {
            typeof (res.data) === "number" ? this.props.changeSetting({ goodweight: res.data }) : null
          }
        })
    }
  }

  async isUpdate() {
    try {
      let { data } = await IsUpdate()
      if (data === 'update') {
        this.setState({
          isUpdate: true
        })
      }
    } catch (e) {

    }
  }

  //点击推出打开交班单Modal
  async openRecords() {
    let { sale, store } = this.props
    let ctime = JSON.parse(localStorage.getItem('CashierTime'));
    let response = await getCashierRecord({ store_id: store.data.id, cashier_id: sale.data.id, createtime: ctime })
    let { msg, status } = response.data
    if (status === 4002) return
    let data = this.addPropsToRecord(msg.data)

    this.setState({
      visible: true,
      receipts: '0.00',
      dataList: data,
      loginTime: msg.other
    })
  }

  openDbodan() {
    // this.props.history.push('/cannibalizing')
    window.open('/huodieposV3/sys/sysuser/home/#/cannibalizing')
  }

  addPropsToRecord = data => {
    const ARR = ['订单收款', '会员充值', '订单退款', '小计']

    const obj = (item) => {
      let keys = Object.keys(item)
      let obj = {};
      keys.forEach(item => {
        // obj[item] = data.slice(0, 2).reduce((prev, cur) => {
        //   return Number(cur[item]) + Number(prev)
        // }, 0) - data.slice(2).map(cur => Number(cur[item]))
        obj[item] = +(data.slice(0, 2).reduce((prev, cur) => {
					return Number(cur[item]) + Number(prev)
				}, 0) - data.slice(2).map(cur => Number(cur[item]))).toFixed(2)
      })
      return obj
    }
    data.push(obj(data[0]))
     
    data.forEach((item, index) => {
      item['key'] = index
      item['title'] = ARR[index]
      // console.log(item)
      // item.cash.toFixed(2)
    })
    // for(let i=0;i<data.length;i++){
    //   data[i].cash.toFixed(2)
    // }
    // console.log('dddd')
    // console.log(data)
    return data
  }

  screenFull() {
    if (screenfull.enabled) {
      screenfull.toggle()
    }
  }

  onVirtualKeyboard(value, str, success) {
    if (!isNaN(Number(value))) {
      if (Number(value) > 9 && Number(str) % 10 === 0) {
        str = Number(str) + Number(value)
      } else {
        str = !Number(str) ? value : str + value
      }
    } else {
      switch (value) {
        case '.':
          if (str.indexOf('.') === -1) {
            str = !!!str ? '0.' : str + '.'
          }
          break
        case '清除':
          str = ''
          break
        case '退格':
          str = str.substring(0, str.length - 1)
          break
        case '确定':
          this.setState({ detailed: true, visible: false })
          success()
          break
        default:
      }
    }
    return str
  }

  //     getWeight()
  // .then(res => {})
  //键盘操作
  async inputReceipts(value) {
    // let ctime = JSON.parse(localStorage.getItem('CashierTime'));
    // for (var i = 1; i < order.dataList.length > 0; i++) {
    //   if (order.dataList[i].length > 0) {
    //     notification.open({
    //       message: <span>您还有挂单未处理，请处理</span>,
    //       duration: 5,
    //     });
    //     return
    //   }
    // }
    let response = await getPendingOrder()
    let as = await getstore()
   
    if(as.data.show_clearpendingorderdaily == '2' && response.data.data.length > 0 && response.data){
        message.info('您还有挂单未处理，请处理')
        return false
    }
    let { focusInputName, receipts, advance, print } = this.state
    let success = () => {
      updateCashierRecord({
        store_id: this.props.store.data.id,
        cashier_id: this.props.sale.data.id,
        cash: receipts,
        print: Number(print),
        advance,
      }).then(res => {
        localStorage.setItem('CashierTime', '')
      })
      // .then(res => {
      //     console.log(res)
      //     let data = res.data
      //     clearAllCookie()
      //     // if(data.status === 4001) window.location.href='http://192.168.1.119:8089/huodieposV3/login.jsp'
      //     if(data.status === 4001) window.location.href='http://127.0.0.1:8089/huodieposV3/login.jsp'
      // })
    }
    let output = this.onVirtualKeyboard(value, this.state[focusInputName], success).toString()
    this.setState({
      [focusInputName]: output.indexOf('.') === -1 ? output : output.substring(0, output.indexOf('.') + 3)
    })
  }

  //跳回登陆页
  backIndex() {
    clearAllCookie()
    window.location.href = 'http://127.0.0.1:8089/huodieposV3/login.jsp'
  }

  upData() {
    this.setState({
      isshow: true
    })
  }

  handleOk() {
    this.props.history.push({
      pathname: '/update'
    })
  }

  handleCancel() {
    this.setState({
      isshow: false
    });
  }

  onHistoryCashierRecord = () => {
    const columns = [
      {
        title: '开始时间',
        key: 'createtime',
        render: (text, record) => (
          <span>{record.other.createtime}</span>
        )
      },
      {
        title: '结束时间',
        key: 'end_at',
        render: (text, record) => (
          <span>{record.other.end_at}</span>
        )
      },
      {
        title: '收银员',
        key: 'cashier',
        render: (text, record) => (
          <span>{record.other.cashier}</span>
        )
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Button onClick={() => printCashierRecord(record)}>打印</Button>
        )
      },
    ]
    const expandedRowRender = (record, index) => {
      const data = this.addPropsToRecord(record.data.slice())

      return (
        <Table
          size="small"
          columns={COLUMNS}
          dataSource={data}
          pagination={false}
        />
      )
    }
    const onChange = (date, dateString) => {
      if (dateString[0] === '' || dateString[1] === '') return
      getCashierRecords({ starttime: dateString[0], endtime: dateString[1] })
        .then(res => {
          console.log(res)
          this.withmodal.show({
            title: '历史交班单',
            width: 767,
            content: () => render({ list: res.data.msg, start: dateString[0], end: dateString[1] }),
          })
        })
    }
    const render = ({ list, start, end }) => (
      <div>
        <Row gutter={16}>
          <Col span={24}>
            <FormItem
              labelCol={{ span: 4 }}
              label="时间段"
            >
              <RangePicker size="large" onChange={onChange} defaultValue={[moment(start), moment(end)]} />
            </FormItem>
          </Col>
        </Row>

        <Table
          size="middle"
          columns={columns}
          dataSource={list}
          expandedRowRender={expandedRowRender}
          rowKey={(item, index) => `history${index}`}
        />
      </div>
    )
    console.log(moment(moment().subtract(10, 'days').calendar(), 'YYYY-MM-DD'))
    onChange('', [moment(moment().subtract(10, 'days').calendar(), 'YYYY-MM-DD'), moment().format('YYYY-MM-DD')])
  }

  renderTable() {
    return (
      <Table
        pagination={false}
        size="middle"
        columns={COLUMNS}
        dataSource={this.state.dataList}
      />
    )
  }

  renderisUpdate() {
    return (
      <div className="section2">
        <div className="content row">
          <div className="right">
            <Button icon="sync" size="large"
              onClick={this.upData.bind(this)}
            // onClick={() => {
            //
            // this.props.history.push('/update')}
            >立即更新</Button>
            <Modal
              title="温馨提示"
              visible={this.state.isshow}
              onOk={this.handleOk.bind(this)}
              onCancel={this.handleCancel.bind(this)}
              style={{ 'top': '23%' }}
              okType="default"
              className='newModal'
              cancelType="primary"
            >
              <p>更新需要较长时间，请勿在收银高峰期更新，确定要更新吗？</p>
            </Modal>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { guide, sale } = this.props
    return (
      <div className="title-bar">
        <div className="common row">
          <div className="section1" ref={this.refIcon} onClick={this.screenFull}>
            <img src={logo} alt="logo" />
          </div>
          {this.state.isUpdate ? this.renderisUpdate() : null}
          {/*{this.renderisUpdate()}this.state.isUpdate ? */}
          {/*<div className="main" onClick={this.getgoodsweight.bind(this)}>*/}
          {/*<span >称重(kg)：</span>*/}
          {/*<span className="output" >{this.props.setting.goodweight}</span>*/}
          {/*/!*{this.props.setting.goodweight}*!/*/}
          {/*</div>*/}
          <div className="section2">
            <div className="content row">
              <div className="left">
                {
                  this.props.setting.isweight ? <div className="main" onClick={this.getgoodsweight.bind(this)}>
                    <span>称重(kg):</span>
                    <span className="output">{this.state.goodweighta}</span>
                    {/*{this.props.setting.goodweight}*/}
                  </div> :
                    ''

                }

              </div>
              {/*<div className="right">*/}
              {/*<Button icon="sync" size="large" onClick={() => console.log('重新取重')}>重新取重</Button>*/}
              {/*</div>*/}
            </div>
          </div>
          <div className="section3">
            <div className="row">
              <div className="row cashier">
                <i className="cashier-icon iconfont icon-shouyinyuan" />
                <div className="cashier-name">
                  <span>收银员</span>
                  <span>{(sale.data && sale.data.nick_name) || (guide.data && guide.data.nick_name)}</span>
                </div>
              </div>
              <Button className="quit" size="large" onClick={() => {
                this.openRecords()
              }}>退出</Button>
            </div>
          </div>
        </div>
        <Modal
          className="handover"
          title="交班单"
          width="inital"
          style={{ top: 20 }}
          maskClosable={false}
          visible={this.state.visible}
          onCancel={() => this.setState({ visible: false })}
          footer={null}
        >
          {/* <Row gutter={16}>
                        <Col span={9}>
                            <FormItem 
                                labelCol={{span: 6}}
                                label="日期"
                            >
                                <DatePicker
                                    defaultValue={moment(new Date(), 'YYYY-MM-DD')}
                                    style={{width: 150}}
                                    disabled
                                />
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem 
                                labelCol={{span: 6}}
                                label="收银员: "
                            >
                                <Input style={{width: 150}} value={this.props.sale.data&&this.props.sale.data.nick_name} disabled />
                            </FormItem>
                        </Col>

                        <Col span={6}>
                            <Button onClick={this.onHistoryCashierRecord}>历史交班单</Button>
                        </Col>
                    </Row>
                    {
                        this.renderTable()
                    } */}
          <Row type="flex" justify="space-between" style={{ paddingTop: 20 }}>
            <Col style={{ flex: 1 }}>
              <FormItem
                {...formItemLayout}
                label="备 用 金 ："
              >
                <InputNumber
                  style={{ width: 250 }}
                  precision={2}
                  value={this.state.advance}
                  onFocus={() => this.setState({ focusInputName: 'advance' })}
                />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="实收现金："
              >
                <InputNumber
                  style={{ width: 250 }}
                  precision={2}
                  value={this.state.receipts}
                  onFocus={() => this.setState({ focusInputName: 'receipts' })}
                />
              </FormItem>
              
              <FormItem
                labelCol={{ span: 10 }}
                label="提交后打印交班单"
              >
                <Switch defaultChecked onChange={(value) => this.setState({ print: value })}
                  style={{ marginLeft: '140px' }} />
              </FormItem>
              <div style={{ color: '#262626', marginLeft: '9px' }}>
                登陆时间:&nbsp;{this.state.loginTime.time}
              </div>
              <br />
              <div style={{ color: '#262626', marginLeft: '9px' }}>
                收银时长:&nbsp;{this.state.loginTime.long}h
              </div>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" style={{ paddingTop: 20 }}>
            <NumericKeypad style={{ flex: 1 }} onClick={(value) => this.inputReceipts(value)} />
          </Row>
        </Modal>
        <Modal
          className="handover"
          title="调拨单"
          width="inital"
          style={{ top: 20 }}
          maskClosable={false}
          visible={this.state.visibles}
          onCancel={() => this.setState({ visible: false })}
          footer={null}
        >
          <Row gutter={16}>
            <Col span={9}>
              <FormItem
                labelCol={{ span: 6 }}
                label="日期"
              >
                <DatePicker
                  defaultValue={moment(new Date(), 'YYYY-MM-DD')}
                  disabled
                />
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem
                labelCol={{ span: 4 }}
                label="收银员: "
              >
                <Input
                  style={{ width: 200 }}
                  value={this.props.sale.data && this.props.sale.data.nick_name}
                  disabled
                />
              </FormItem>
            </Col>

            <Col span={6}>
              <Button onClick={this.onHistoryCashierRecord}>历史交班单</Button>
            </Col>
          </Row>
          {
            this.renderTable()
          }
          <Row type="flex" justify="space-between" style={{ paddingTop: 20 }}>
            <Col style={{ flex: 1 }}>
              <FormItem
                {...formItemLayout}
                label="实收现金："
              >
                <InputNumber
                  style={{ width: 150 }}
                  precision={2}
                  value={this.state.receipts}
                  onFocus={() => this.setState({ focusInputName: 'receipts' })}
                />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="备用金："
              >
                <InputNumber
                  style={{ width: 150 }}
                  precision={2}
                  value={this.state.advance}
                  onFocus={() => this.setState({ focusInputName: 'advance' })}
                />
              </FormItem>
              <FormItem
                labelCol={{ span: 12 }}
                label="提交后打印交班单"
              >
                <Switch defaultChecked onChange={(value) => this.setState({ print: value })} />
              </FormItem>
              <div>
                登陆时间:&nbsp;{this.state.loginTime.time}
              </div>
              <br />
              <div>
                收银时长:&nbsp;{this.state.loginTime.long}h
              </div>
            </Col>
            <NumericKeypad style={{ flex: 1 }} onClick={(value) => this.inputReceipts(value)} />
          </Row>
        </Modal>
        <Modal
          className="handover"
          title="交班单"
          width="inital"
          style={{ top: 20 }}
          maskClosable={false}
          visible={this.state.detailed}
          onCancel={() => this.backIndex()}
          footer={null}
        >
          <Row gutter={16}>
            <Col span={9}>
              <FormItem
                labelCol={{ span: 6 }}
                label="日期"
              >
                <DatePicker
                  defaultValue={moment(new Date(), 'YYYY-MM-DD')}
                  style={{ width: 150 }}
                  disabled
                />
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem
                labelCol={{ span: 6 }}
                label="收银员: "
              >
                <Input style={{ width: 150 }} value={this.props.sale.data && this.props.sale.data.nick_name} disabled />
              </FormItem>
            </Col>

            <Col span={6}>
              {/* <Button onClick={this.onHistoryCashierRecord}>历史交班单</Button> */}
            </Col>
          </Row>
          {
            this.renderTable()
          }
          <Row type="flex" justify="center">
            <Button
              size="large"
              style={{ paddingRight: '40px', paddingLeft: '40px', marginTop: '20px' }}
              onClick={() => this.backIndex()}
            > 退 出 </Button>
          </Row>
        </Modal>
        <WithModal footer={null} ref={(ref) => this.withmodal = ref} style={{ top: 20 }} />
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, { changeSetting })(HeaderCustom));



