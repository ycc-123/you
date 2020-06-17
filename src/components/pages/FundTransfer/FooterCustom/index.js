/**
 * file 商品报损
 */

import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Modal, notification, Icon, DatePicker, Table, Input, Button} from 'antd'
import {withRouter} from 'react-router-dom'
import './index.less'
import styles from './index.module.less'

import {clearFundTransferList} from '@/action'
import {warehoseChange, getTBlist, TBdetail, submitTB, printAlloction, timeStamp,} from '@/api'
import moment from 'moment'
import 'moment/locale/zh-cn'
import NumericKeypad, {onVirtualKeyboard} from '@/widget/NumericKeypad'

const confirm = Modal.confirm;
const {RangePicker} = DatePicker
moment.locale('zh-cn')

const mapStateToProps = (state, ownProps) => ({
  store: state.store,
  sale: state.sale,
  fundTransfer: state.fundTransfer,
  authority: state.authority,
})

class index extends Component {

  constructor(props) {
    super(props);

    this.state = {
      Mymodal: null,
      transfer_price: '',
      gnum: '',
      loading: false,
      warehousing_visible: false,
      library_visible: false,
      start: '',
      end: '',
      init_data: [],
      ex_data: [],
      ex_headData: [],
      init_thelidata: [],
      ex_thelidata: [],
    };
  }

  componentDidMount() {
    let start = moment().add(-10, 'days').format('YYYY-MM-DD')

    let end = moment().format('YYYY-MM-DD')

    this.setState({
      start,
      end
    })
  }

  onSubmit = () => {
    const {list} = this.props.fundTransfer
    const onOk = () => {
      if (!list && list.length === 0) {
        notification.error({
          message: '提交调价单为空',
          description: '请先检查调价商品后重试',
        })
        return
      }
      let obj = JSON.parse(window.sessionStorage.getItem('thelibrary_warehouse'))
      if (!obj.warehouse_in || !obj.warehouse_out) {
        notification.error({
          message: '转入仓库为空',
          description: '请先选择转入仓库后重试',
        })
        return
      }
      let itemData = list.map(item => {
        return {
          barcode: item.barcode[0].barcode,
          barcodeid: item.barcodeid,
          goods_name: item.name,
          realnum: item.num,
          goodsid: item.goodsid,
          specid1: item.specid1,
          specid2: item.specid2,
          specid3: item.specid3,
          specitemid1: item.specitemid1,
          specitemid2: item.specitemid2,
          specitemid3: item.specitemid3,
          transfer_price: item.posprice,
          transfer_subtotal: (+item.num * (+item.posprice)).toFixed(2),
        }
      })
      let transfer_totalmoney = itemData.reduce((a,b)=>{
        return a + +b.transfer_subtotal
      },0)
      let transfer_totalnumber = itemData.reduce((a,b)=>{
        return a + +b.realnum
      },0)

      let warehouse_out = obj.warehouse_out
      let warehouse_in = obj.warehouse_in
      warehoseChange({
        itemData,
        warehouse_out,
        warehouse_in,
        transfer_totalmoney,
        transfer_totalnumber
      })
        .then(res => {
          console.log(res)
          notification.open({
            message: '调拨成功',
            description:
              '您可以继续提交调拨单或退出本页面',
            icon: <Icon type="smile" style={{color: '#108ee9'}}/>,
          })
          this.props.clearFundTransferList()
        })
    }
    confirm({
      title: '提交调拨单',
      content: '是否提交调拨',
      onOk() {
        onOk()
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  totalPrice = () => {
    let totalPrice = 0
    this.props.fundTransfer.list.forEach(item => totalPrice += item.num * item.costprice)
    return totalPrice.toFixed(2)
  }
  //入库单弹窗
  warehousing = () => {
    let {start, end} = this.state,
      {store: {data}} = this.props

    let starttime = +(moment(start).valueOf() + '').slice(0, 10),
      endtime = +(moment(end).add(1, 'days').valueOf() + '').slice(0, 10),
      sign = 2,
      uniacid = data.uniacid,
      storeid = data.id

    this.getTBlist({uniacid, storeid, sign, starttime, endtime})
    this.setState({
      warehousing_visible: true
    })
  }
  //出库单弹窗
  thelibrary = () => {
    let {start, end} = this.state,
      {store: {data}} = this.props

    let starttime = +(moment(start).valueOf() + '').slice(0, 10),
      endtime = +(moment(end).add(1, 'days').valueOf() + '').slice(0, 10),
      sign = 1,
      uniacid = data.uniacid,
      storeid = data.id

    this.getTBlist({uniacid, storeid, sign, starttime, endtime, bool: false})

    this.setState({
      library_visible: true
    })
  }
  //入库单关闭事件
  warehousing_handleCancel = () => {
    this.setState({
      warehousing_visible: false
    })
  }
  //出库单关闭事件
  thelibrary_handleCancel = () => {
    let {library_visible} = this.state
    this.setState({
      library_visible: false
    })
  }

  //入库单弹窗
  ware_table = (start, end) => {
    let {init_data} = this.state

    const columns = [
      {title: '单据日期', dataIndex: 'date'},
      {title: '入库单号', dataIndex: 'odd'},
      {title: '转出仓库', dataIndex: 'out'},
      {title: '转入仓库', dataIndex: 'into'},
      {title: '移库总数量', dataIndex: 'sum'},
      {title: '单据状态', dataIndex: 'condition'},
      {
        title: '操作',
        dataIndex: '',
        render: (recode) => <Button
          onClick={() => onsubmitTB(recode.key - 1)}
          disabled={recode.condition === '提交成功' ? true : false}
        >确定</Button>,
      },
    ];

    const ex_columns = [
      {title: '转出仓库', dataIndex: 'outc'},
      {title: '商品条码', dataIndex: 'goods_code'},
      {title: '商品名称', dataIndex: 'goods_name'},
      {
        title: '单价',
        dataIndex: 'transfer_price',
        render: (text, recode) => {
          return (
            <span onClick={() => this.onChangeNum(recode, "transfer_price")}>
						  {recode.transfer_price}
					  </span>
          )
        }
      },
      {
        title: '数量',
        dataIndex: 'gnum',
        render: (text, recode) => {
          return (
            <span onClick={() => this.onChangeNum(recode, "gnum")}>
						  {recode.gnum}
					  </span>
          )
        }
      },
      {
        title: '小计',
        dataIndex: 'transfer_subtotal',
        render: (text, recode) => {
          return (
            <span>
						  {+recode.gnum*(+recode.transfer_price)}
					  </span>
          )
        }
      },
    ]

    let data = init_data.map((item, index) => {
      return {
        key: index + 1,
        date: item.docdate,
        odd: item.docno,
        out: item.outwarehouse,
        into: item.inwarehouse,
        sum: item.gnum,
        condition: item.status,
        agms: {
          parentkey: index
        },
      }
    })

    const expanded = record => {
      const ex_data = this.state.ex_data[record.agms.parentkey]
      return <Table
        columns={ex_columns}
        dataSource={ex_data}
      />
    }

    let warehousing_date = (date, dateString) => {
      let {store: {data}} = this.props

      let starttime = +(moment(dateString[0]).valueOf() + '').slice(0, 10),
        endtime = +(moment(dateString[1]).add(1, 'days').valueOf() + '').slice(0, 10),
        sign = 2,
        uniacid = data.uniacid,
        storeid = data.id

      this.getTBlist({uniacid, storeid, sign, starttime, endtime})
    }

    let onsubmitTB = (index) => {
      let {ex_data, ex_headData, init_data} = this.state,
        {store: {data}} = this.props

      var itemData = ex_data[index],
        headData = ex_headData[index],
        sign = ex_headData[index].sign,
        uniacid = data.uniacid

      submitTB({uniacid, itemData, sign, headData})
        .then(({data}) => {
          if (data === '调拨单更新成功') {
            init_data[index].status = '提交成功'
            init_data[index].gnum = itemData.reduce((a, b) => {
              return +b.gnum + a
            }, 0)
            this.setState({
              init_data
            })
            notification.open({
              message: '提示',
              description:
                '调拨单更新成功',
              onClick: () => {
              },
            });
          }
        })
    }

    return (
      <Fragment>
        时间段：<RangePicker
        onChange={warehousing_date}
        format="YYYY-MM-DD"
        defaultValue={[moment(start, "YYYY-MM-DD"), moment(end, "YYYY-MM-DD")]}
      />
        <Table
          size='middle'
          columns={columns}
          expandedRowRender={expanded}
          dataSource={data}
          pagination={{pageSize: '8'}}
        />
      </Fragment>
    )
  }
  /**
   * 出库单弹窗
   **/
  theli_table = (start, end) => {
    let {init_thelidata, ex_thelidata} = this.state

    const columns = [
      {title: '单据日期', dataIndex: 'date'},
      {title: '出库单号', dataIndex: 'odd'},
      {title: '转出仓库', dataIndex: 'out'},
      {title: '转入仓库', dataIndex: 'into'},
      {title: '移库总数量', dataIndex: 'sum'},
      {title: '单据状态', dataIndex: 'condition'},
      {
        title: '操作',
        dataIndex: '',
        render: recode => <Button
          onClick={() => onsubmitDY(recode.key - 1)}
        >打印</Button>,
      }
    ]

    const onsubmitDY = (index) => {
      ex_thelidata[index].length >= 1 ? timeStamp().then(({data}) => {
        printAlloction({
          "docdate": init_thelidata[index].docdate,		//单据时间
          "docno": init_thelidata[index].docno,		//调拨单号
          "outwarehouse": init_thelidata[index].outwarehouse,				//转出仓库
          "inwarehouse": init_thelidata[index].inwarehouse,			//转入仓库
          "gnum": init_thelidata[index].gnum,					//移库总数量
          transfer_totalnumber: init_thelidata[index].gnum,
          "status": init_thelidata[index].status,				//单据状态
          "printTime": data,		//打印时间戳
          "nick_name": this.props.authority.data.data.nickname, //调拨人
          list: ex_thelidata[index].map(item => {
            return {
              "barcode": item.barcode,
              "barcodeid": item.barcodeid,
              "goods_name": item.unitname,		//商品名goods_name字
              "gnum": item.gnum,			//商品数gnum量
              "goodsid": item.goodsid,
              "specid1": item.specid1,
              "specid2": item.specid2,
              "specid3": item.specid3,
              "specitemid1": item.specitemid1,
              "specitemid2": item.specitemid2,
              "specitemid3": item.specitemid3,
              "transfer_price": item.transfer_price,
              "transfer_subtotal": item.transfer_subtotal,
            }
          }),
          transfer_totalmoney: ex_thelidata[index].reduce((a,b)=>{
            return a + +b.transfer_subtotal
          },0),
        })
      }) : notification.warning({
        message: '提示',
        description: '打印商品为空',
      })
    }

    const data = init_thelidata.map((item, index) => {
      return {
        key: index + 1,
        date: item.docdate,
        odd: item.docno,
        out: item.outwarehouse,
        into: item.inwarehouse,
        sum: item.gnum,
        condition: item.status,
        agms: {
          parentkey: index
        },
      }
    })

    const ex_columns = [
      {title: '转出仓库', dataIndex: 'outc'},
      {title: '商品条码', dataIndex: 'goods_code'},
      {title: '商品名称', dataIndex: 'goods_name'},
      {title: '单价', dataIndex: 'transfer_price'},
      {title: '数量', dataIndex: 'gnum'},
      {title: '小计', dataIndex: 'transfer_subtotal'},
    ]

    let theli_date = (date, dateString) => {
      let {store: {data}} = this.props

      let starttime = +(moment(dateString[0]).valueOf() + '').slice(0, 10),
        endtime = +(moment(dateString[1]).add(1, 'days').valueOf() + '').slice(0, 10),
        sign = 1,
        uniacid = data.uniacid,
        storeid = data.id

      this.getTBlist({uniacid, storeid, sign, starttime, endtime, bool: false})
    }

    const expanded = record => {
      const ex_data = ex_thelidata[record.agms.parentkey]
      return <Table
        columns={ex_columns}
        dataSource={ex_data}
      />
    }

    return (
      <Fragment>
        时间段：<RangePicker
        onChange={theli_date}
        format="YYYY-MM-DD"
        defaultValue={[moment(start, "YYYY-MM-DD"), moment(end, "YYYY-MM-DD")]}
      />
        <Table
          size='middle'
          columns={columns}
          expandedRowRender={expanded}
          dataSource={data}
          pagination={{pageSize: '8'}}
        />
      </Fragment>
    )
  }
  //api 入库单详情
  exdata = ({uniacid, id, key, bool = true}) => {
    TBdetail({uniacid, id})
      .then(({data: {data}}) => {
        let {ex_data, ex_headData, ex_thelidata} = this.state
        if (bool) {
          ex_data[key] = data.itemData.map((item, index) => {
            item.key = index + 1
            item.outc = data.headData.outwarehouseName
            item.parentkey = key
            return item
          })
          data.headData.sign = 0
          ex_headData[key] = data.headData
          this.setState({
            ex_data,
            ex_headData
          })
        } else {
          ex_thelidata[key] = data.itemData.map((item, index) => {
            item.key = index + 1
            item.outc = data.headData.outwarehouseName
            return item
          })
          this.setState({
            ex_thelidata
          })
        }
      })
  }
  //api 入库单列表
  getTBlist = ({uniacid, storeid, sign, starttime, endtime, bool = true}) => {
    getTBlist({uniacid, storeid, sign, starttime, endtime})
      .then(({data}) => {
        bool ? this.setState({
          init_data: data
        }) : this.setState({
          init_thelidata: data
        })
        return data
      })
      .then(res => {
        res.map((item, index) => {
          bool ? this.exdata({
            uniacid: item.uniacid,
            id: item.id,
            key: index,
          }) : this.exdata({
            uniacid: item.uniacid,
            id: item.id,
            key: index,
            bool
          })
          return item
        })
      })
  }
  //数字键盘
  onChangeNum = (value, str) => {

    let onclick = (v) => {
      let a = onVirtualKeyboard(v, this.state[str], () => {
        let {ex_data, ex_headData} = this.state

        ex_data[value.parentkey][value.key - 1][str] = this.state[str]
        ex_headData[value.parentkey].sign = 1

        this.setState({
          ex_data,
          ex_headData
        }, () => {
          this.setState({
            Mymodal: null,
            [str]: ''
          })
        })
      })

      this.setState({
        [str]: a
      })
    }

    const render = () => (
      <Modal
        title="输入数字"
        visible={true}
        maskClosable={false}
        onCancel={this.closechangenum}
        footer={null}
        width={400}
      >
        <Input
          style={{marginBottom: '10px', width: '330px'}}
          value={this.state[str]}
        />
        <NumericKeypad
          onClick={onclick}
        />
      </Modal>
    )

    this.setState({
      Mymodal: render
    })
  }
  //数字键盘的关闭事件
  closechangenum = () => {
    this.setState({
      Mymodal: null
    })
  }

  render() {
    var rand = Math.floor(Math.random() * 900) + 1;
    let {Mymodal} = this.state
    return (
      <div className="audio-controller" style={{justifyContent: 'space-between'}}>
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ccc',
              width: 105,
              height: 100
            }}
            onClick={() => this.props.history.push({pathname: '/app/dashboard/73' + rand})}
          >
            <span style={{fontSize: 16}}>退出</span>
          </div>
        </div>
        <div className="right row">
          {/*<div className="section1">*/}
          {/*<span>*/}
          {/*报损总金额（元）*/}
          {/*</span>*/}
          {/*<span className="price">{this.totalPrice()}</span>*/}
          {/*</div>*/}
          <div
            className={styles.warehousing}
            onClick={this.warehousing}
          >
            调拨入库单
          </div>
          <div
            className={styles.thelibrary}
            onClick={this.thelibrary}
          >
            调拨出库单
          </div>
          <Modal
            destroyOnClose={true}
            width={720}
            bodyStyle={{textAlign: 'center'}}
            title="调拨入库单"
            visible={this.state.warehousing_visible}
            maskClosable={false}
            onCancel={this.warehousing_handleCancel}
            footer={null}
          >
            {this.ware_table(this.state.start, this.state.end)}
          </Modal>
          {/*数字键*/}
          {Mymodal && <Mymodal/>}
          <Modal
            destroyOnClose={true}
            width={800}
            bodyStyle={{textAlign: 'center'}}
            title="调拨出库单"
            visible={this.state.library_visible}
            maskClosable={false}
            onCancel={this.thelibrary_handleCancel}
            footer={null}
          >
            {this.theli_table(this.state.start, this.state.end)}
          </Modal>
          <div className="section3 row" onClick={this.onSubmit}>
            <div>
              <span className="complete-icon"><i className="iconfont icon-jsq"/></span>
            </div>
            <div className="complete-title">
              <span>生成调拨单</span>
              <span className="price"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, {clearFundTransferList})(index))