import React from 'react'
import { Button, Row, Col, Popover, notification, } from 'antd'
import { disconnect } from '@/api'

const NAVLIST = [
  // {title: '后台', iconName: 'icon-houtai', iconClass: 'backstage'},
  // {title: '交易', iconName: 'icon-shouyin', iconClass: 'refund'},
  // {title: '收银单', iconName: 'icon-202shouyindan', iconClass: 'receipt'},
  // {title: '核销', iconName: 'icon-erweima', iconClass: 'checkingsale'},
  // {title: '商品', iconName: 'icon-shangpin', iconClass: 'goodslist'},
  // {title: '调拨', iconName: 'icon-tiaoboruku', iconClass: 'cannibalizing'},
  // {title: '调价' ,iconName:'icon-tiaojiaguandisconnectli', iconClass: 'priceAdjustment'},
  // {title: '分屏' ,iconName:'icon-computer', iconClass: 'computer'},

  // {title: '更多', iconName: 'icon-Icon_more2', iconClass: 'more'}

];

const SHOPMOREMENU = [
  { title: '商品查询', 'type': 'goodslist' },
  { title: '商品采购', 'type': 'purchase' },
  { title: '商品调价', 'type': 'priceAdjustment' },
  { title: '商品报损', 'type': 'reportDamage' },
  { title: '商品调拨', 'type': 'fundTransfer' },
  { title: '商品上架', 'type': 'putaway' },
  { title: '商品下架', 'type': 'soldout' },
  { title: '商品新增', 'type': 'append' },
  { title: '一键传秤', 'type': 'ftcgoods' },
  { title: `库存打印`, type: `printStock` },
  // {title: '商品调拨' , 'type': 'cannibalizing'},
  // {title: '商品报单' , 'type': 'declaration'},
];

const EARLYWARNING = [
  { title: '温控预警', 'type': 'earlywarning' },
  { title: '库存预警', 'type': 'Inventory' },
];

const CASHIER_ORDER = [
  { title: '收银明细', 'type': 'refund' },
  { title: '储值明细', 'type': 'payback' },
  { title: '交班记录', 'type': 'slip' },
  { title: "单品明细", 'type': "erpStores" }
]


class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopover3: false,
      status: 0,
      MOREMENU: [
        // {title: '设置' , 'type': 'setting'},
        // {title: '盘点' , 'type': 'inventory'},
        // {title: '报损' , 'type': 'damaged'},
        { title: '店铺信息', 'type': 'storeInfo' },
        { title: '促销详情', 'type': 'promotions' },
        { title: '指定导购', 'type': 'ShortcutKey' },
        { title: '打开钱箱', 'type': 'cashbox' },
        { title: '分屏展示', 'type': 'computer' },
        { title: '拖拽排序', type: 'sorting' },
        { title: '收银设置', 'type': 'setting' },
        { title: '同步数据', type: 'synchronize' },
        // {title: '商品', 'type': 'goodslist'},
        // {title: '商品调价' , 'type': 'priceAdjustment'},
        // {title: '商品报损' , 'type': 'reportDamage'},
      ]
    }
  }

  // componentDidMount() {
  //   setTimeout(() => {
  //     let { MOREMENU } = this.state
  //     this.setState({
  //       MOREMENU: this.props.store && this.props.store.data.show_dragsort == 2 ? MOREMENU.filter((item, i) => i == 5 ? false : true) : MOREMENU
  //     })
  //   }, 500);
  // }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props.store) !== JSON.stringify(prevProps.store)) {
      let { MOREMENU } = this.state
      this.setState({
        MOREMENU: this.props.store.data.show_dragsort == 2 ? MOREMENU : MOREMENU.filter((item, i) => i == 5 ? false : true)
      })
    }
  }

  outage = () => {
    this.setState({
      showPopover3: true,
    })
    disconnect()
      .then(({ data }) => {
        if (data.status == 9002) {
          notification.warning({
            message: '提示',
            description: '网络异常或阻塞，此功能暂无法使用',
          })
          this.setState({
            status: 1,
          })
        } else {
          this.setState({
            status: 0,
          })
        }
      })
  }

  onHidePopover3 = () => {
    this.setState({
      showPopover3: false,
    })
  }

  render() {
    let { onClick, visible, handleVisibleChange, guide, colorred, redshow_Inventory } = this.props
    let { MOREMENU } = this.state
    const content = (
      <Row type="flex" justify="center" gutter={16}>
        {
          MOREMENU.map((item, index) => <Col key={index}>
            <Button
              style={{
                width: 80,
                height: 80,
                whiteSpace: 'pre-wrap',
                fontSize: 17,
              }}
              size="large"
              onClick={() => onClick(item.type)}
            >{item.title}</Button>
          </Col>
          )
        }
      </Row>
    )

    const shopcontent = (
      <Row type="flex" justify="center" gutter={16}>
        {
          SHOPMOREMENU.map((item, index) => (
            <Col key={index}>
              <Button
                style={{
                  width: 80,
                  height: 80,
                  whiteSpace: 'pre-wrap',
                  fontSize: 17,
                  color: this.state.status == 1 ? 'rgb(0, 0, 0, 0.25)' : ''
                }}
                size="large"
                onClick={() => {
                  this.setState({
                    showPopover3: false,
                  })
                  onClick(item.type, this.state.status)
                }}
              >{item.title}</Button>
            </Col>
          ))
        }
      </Row>
    )

    const cashier_order = (
      <Row type="flex" justify="center" gutter={16}>
        {
          CASHIER_ORDER.map((item, index) => (
            <Col key={index}>
              <Button
                style={{
                  width: 80,
                  height: 80,
                  whiteSpace: 'pre-wrap',
                  fontSize: 17,
                }}
                size="large"
                onClick={() => onClick(item.type)}
              >{item.title}</Button>
            </Col>
          ))
        }
      </Row>
    )

    const earlywarning = (
      <Row type="flex" justify="center" gutter={16}>
        {
          EARLYWARNING.map((item, index) => (
            <Col key={index}>
              <Button
                style={{
                  width: 80,
                  height: 80,
                  whiteSpace: 'pre-wrap',
                  fontSize: 17,
                  color: (item.type == 'earlywarning' && colorred) || item.type == 'Inventory' && redshow_Inventory ? 'red' : ''
                }}
                size="large"
                onClick={() => onClick(item.type)}
              >{item.title}</Button>
            </Col>
          ))
        }
      </Row>
    )

    return (
      <div className="btn-group row">
        <Popover
          onClick={this.onHidePopover3}
          overlayStyle={{
            zIndex: 11
          }}
          content={cashier_order}
          trigger="click"
        >
          <div className="btn-item">
            <span><i className='iconfont icon-shouyin' /></span>
            <span>交易</span>
          </div>
        </Popover>
        <div className="btn-item" onClick={() => {
          this.onHidePopover3()
          onClick('checkingsale')
        }}>
          <span><i className={`iconfont icon-erweima`} /></span>
          <span>核销</span>
        </div>
        <Popover
          overlayStyle={{
            zIndex: 11
          }}
          // visible={this.state.showPopover3}
          content={shopcontent}
          trigger="click"
          onClick={this.outage}
        >
          <div className="btn-item">
            <span><i className="iconfont icon-shangpin" /></span>
            <span>商品</span>
          </div>
        </Popover>

        <Popover
          onClick={this.onHidePopover3}
          overlayStyle={{
            zIndex: 11
          }}
          content={earlywarning}
          trigger="click"
        >
          <div className="btn-item">
            <span><i className="iconfont icon-houtai"
              style={{ color: colorred || redshow_Inventory ? 'red' : '' }} /></span>
            <span>预警</span>
          </div>
        </Popover>

        <Popover
          onClick={this.onHidePopover3}
          overlayStyle={{
            zIndex: 11
          }}
          content={content}
          trigger="click"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <div className="btn-item">
            <span><i className="iconfont icon-gengduo" /></span>
            <span>更多</span>
          </div>
        </Popover>
        {
          // <Button size="large" onClick={() => onClick('ShortcutKey')}>{(guide.data&&guide.data.nick_name) || '指定导购员'}</Button>
        }
      </div>
    )
  }

}

export default index

// export default ({onClick, visible, handleVisibleChange, guide, colorred}) => {
//   const content = (
//     <Row type="flex" justify="center" gutter={16}>
//       {
//         MOREMENU.map((item, index) => (
//           <Col key={index}>
//             <Button
//               style={{
//                 width: 80,
//                 height: 80,
//                 whiteSpace: 'pre-wrap',
//                 fontSize: 17,
//               }}
//               size="large"
//               onClick={() => onClick(item.type,q)}
//             >{item.title}</Button>
//           </Col>
//         ))
//       }
//     </Row>
//   )
//
//   const shopcontent = (
//     <Row type="flex" justify="center" gutter={16}>
//       {
//         SHOPMOREMENU.map((item, index) => (
//           <Col key={index}>
//             <Button
//               style={{width: 80, height: 80, whiteSpace: 'pre-wrap', fontSize: 17}}
//               size="large"
//               onClick={() => onClick(item.type, q)}
//             >{item.title}</Button>
//           </Col>
//         ))
//       }
//     </Row>
//   )
//
//   const earlywarning = (
//     <Row type="flex" justify="center" gutter={16}>
//       {
//         EARLYWARNING.map((item, index) => (
//           <Col key={index}>
//             <Button
//               style={{width: 80, height: 80, whiteSpace: 'pre-wrap', fontSize: 17}}
//               size="large"
//               onClick={() => onClick(item.type)}
//             >{item.title}</Button>
//           </Col>
//         ))
//       }
//     </Row>
//   )
//
//   return (
//     <div className="btn-group row">
//       {
//         NAVLIST.map((item, index) => (
//           <div className="btn-item" key={index} onClick={() => onClick(item.iconClass)}>
//             <span><i className={`iconfont ${item.iconName}`}/></span>
//             <span>{item.title}</span>
//           </div>
//         ))
//       }
//       <Popover
//         content={shopcontent}
//         trigger="click"
//         onClick={outage}
//       >
//         <div className="btn-item">
//           <span><i className="iconfont icon-shangpin"/></span>
//           <span>商品</span>
//         </div>
//       </Popover>
//
//       <Popover
//         content={earlywarning}
//         trigger="click"
//       >
//         <div className="btn-item">
//           <span><i className="iconfont icon-houtai" style={{color: colorred ? 'red' : ''}}/></span>
//           <span>预警</span>
//         </div>
//       </Popover>
//
//       <Popover
//         content={content}
//         trigger="click"
//         visible={visible}
//         onVisibleChange={handleVisibleChange}
//       >
//         <div className="btn-item">
//           <span><i className="iconfont icon-gengduo"/></span>
//           <span>更多</span>
//         </div>
//       </Popover>
//       {
//         // <Button size="large" onClick={() => onClick('ShortcutKey')}>{(guide.data&&guide.data.nick_name) || '指定导购员'}</Button>
//       }
//     </div>
//   )
// }
