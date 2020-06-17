/**
 * file 商品报损
 */

import React, { Component, Fragment, createRef } from 'react'
import { connect } from 'react-redux'
import { Modal, notification, Icon, Input } from 'antd'
import { WithModal } from '@/widget'
import { withRouter } from 'react-router-dom'

import { clearPURCHASEList } from '@/action'
import { addPurchase, applyOrder } from '@/api'
import moment from 'moment'

const mapStateToProps = (state, ownProps) => ({
  store: state.store,
  sale: state.sale,
  purchase: state.purchase,
})

class index extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      inputValue: '',
    }

    this.modalRef = createRef()
  }

  onSubmit = () => {
    const { purchase: { list }, store: { data } } = this.props

    const onOk = () => {
      if (!list || list.length === 0) {
        notification.error({
          message: '提交采购单为空',
          description: '请先检查采购商品后重试',
        })
        return
      }
      // let obj = JSON.parse(window.sessionStorage.getItem('buyer_warehouse'))
      // if (!obj.buyer || !obj.supplier) {
      //   notification.error({
      //     message: '供货商为空',
      //     description: '请先选择供货商后重试',
      //   })
      //   return
      // }

      let itemData = list.map(item => {
        return {
          barcode: item.barcode[0].barcode,
          barcodeid: item.barcodeid,
          gnum: item.num,
          goods_categoryid: item.categoryid,
          goods_name: item.name,
          goods_code: '',
          goodsid: item.goodsid,
          price: item.posprice,
          specid1: item.specid1,
          specid2: item.specid2,
          specid3: item.specid3,
          specitemid1: item.specitemid1,
          specitemid2: item.specitemid2,
          specitemid3: item.specitemid3,
          unit: item.unit,
          unitname: item.unit_name,
          goods_style: item.style
        }
      })
      let snum = list.reduce((a, b) => {
        return +a + Number(b.num)
      }, 0)

      applyOrder({
        itemData,
        purchaseData: {
          remark: this.state.inputValue,
          snum,
          arrival: moment().format('YYYY-MM-DD'),
        }
      })
        .then(res => {
          notification.open({
            message: '采购成功',
            description:
              '您可以继续提交采购单或退出本页面',
            icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
          })
          this.props.clearPURCHASEList()
        })
        .then(res => {
          this.setState({
            inputValue: '',
          })
          this.modalRef.current.colse()
        })
    }

    const node = () => (
      <div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          alignItems: "center",
        }}
      >
        备注：<Input
          placeholder="对此订单的备注，可不填写"
          value={this.state.inputValue}
          onChange={(v) => {
            this.setState({
              inputValue: v.target.value,
            })
          }}
        />
      </div>
    )

    this.modalRef.current.show({
      title: '提交采购单',
      onOK: onOk,
      content: node,
    })
  }

  totalPrice = () => this.props.purchase.list
    .reduce((a, b) => {
      return +a + +b.num
    }, 0)
    .toFixed(2)


  render() {
    var rand = Math.floor(Math.random() * 900) + 1;
    return (
      <Fragment>
        <div className="audio-controller" style={{ justifyContent: 'space-between' }}>
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
              onClick={() => this.props.history.push({ pathname: '/app/dashboard/73' + rand })}
            >
              <span style={{ fontSize: 16 }}>退出</span>
            </div>
          </div>
          <div className="right row">
            <div className="section1">
              <span>
                采购总数量
              </span>
              <span
                className="price"
                style={{
                  textAlign: 'center',
                }}
              >{this.totalPrice()}</span>
            </div>
            <div className="section3 row" onClick={this.onSubmit}>
              <div>
                <span className="complete-icon"><i className="iconfont icon-jsq" /></span>
              </div>
              <div className="complete-title">
                <span>生成申请单</span>
                <span className="price" />
              </div>
            </div>
          </div>
        </div>
        <WithModal
          ref={this.modalRef}
          okText='提交'
          cancelText='取消'
        />
      </Fragment>
    )
  }
}

export default withRouter(connect(mapStateToProps, { clearPURCHASEList })(index))