import React, { Component, createRef, Fragment } from 'react'
import { Popover, Table, Select, } from 'antd'
import { connect } from 'react-redux'
import { Modal, Form, Radio, Input, Button } from 'antd'
import Qx1127 from '@/widget/PrivilegeVerifier'

import { NumericKeypad } from '@/widget'
import { removeFromOrderList, updateFromOrderList, addToOrderList, } from '@/action'
import { getWeight, getWeightLog } from '@/api'
import { withRouter } from "react-router-dom"
import freebie from "@/assets/img/freebie.png"
import promotions from "@/assets/img/promotions.png"

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const mapStateToProps = (state, ownProps) => ({
  store: state.store,
  setting: state.setting,
  order: state.order,
  leaflet: state.leaflet,
})

const { Option } = Select

class SiderRightBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swqx1127: false,
      promotionInfo: undefined,
      showPromotion: false,
      itemIndex: 0,
      is_first: false,
      collapsed: false,
      visible: false,
      modifyType: 'num',
      tabSwitch: 'tab-discount_fee',
      selectedItem: {},
      store: this.props.store,
      currentValue: {
        posprice: 0,
        discount: 0,
        subtotal: 0,
        num: 0,
      },
      isNum: 1,
      columns: [{
        title: '#',
        key: 'key',
        width: '15%',
        render: (text) => (<span
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {text.key}
          {
            text.is_freegift == 2 ? <img alt="" src={freebie} /> : null
          }
          {
            text.showPromotionImg ? <img alt="" src={promotions} /> : null
          }
        </span>)
      }, {
        title: '商品',
        key: 'name',
        render: (text, recode) => {
          return (
            <span>
              <span>{recode.name}</span>
              <br />
              <span>{recode.specname}</span>
            </span>
          )
        }
      }, {
        title: '售价',
        key: 'posprice',
        width: '20%',
        render: (text, recode) => (
          // console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnn',recode)
          <span>
            {
              Number(recode.discount_fee) !== 0
                ? <span>
                  <span className="invalid-line">{(+recode.posprice).toFixed(2)}元/{recode.changeunitname}</span>
                  <br />
                  {
                    recode.modifyprice
                      ? (+recode.modifyprice).toFixed(2)
                      : (Number(recode.posprice) - Number(recode.discount_fee)).toFixed(2)
                  }元/{recode.changeunitname}
                </span>
                : <span>
                  {(+recode.posprice).toFixed(2)}元/{recode.changeunitname}
                  <br />
                  {
                    recode.specialPrice
                      ? <i style={{ color: 'red' }}>{Number(recode.specialPrice).toFixed(2)}元/{recode.changeunitname}</i>
                      : null
                  }
                </span>
            }
          </span>
        )
      }, {
        title: '数量',
        key: 'num',
        width: '15%',
        render: (text, recode) => (
          <span
            onClick={() => {
              if (recode.isPromotion && !recode.isRestriction) return false
              this.setState({
                itemIndex: recode.key - 1,
              })
              this.onModifyFunc(recode, 'num')
            }}
          >
            {String(recode.num).match(/\d{0,}\.{0,1}\d{0,3}/) ? String(recode.num).match(/\d{0,}\.{0,1}\d{0,3}/)[0] : recode.num}
          </span>
        ),
      }, {
        title: '小计',
        key: 'subtotal',
        width: '20%',
        render: (text, recode) => (
          <span
            onClick={() => {
              if (recode.showPromotionImg) return false
              this.setState({
                itemIndex: recode.key - 1,
              })
              this.onModifyFunc(recode, 'subtotal')
            }}
          >
            {
              Number(recode.discount_fee) !== 0
                ? <span>
                  <span className="invalid-line">
                    {
                      recode.modifyprice
                        ? this.precisionControl(Number(recode.posprice) * recode.num)
                        : this.precisionControl(recode.subtotal)
                    }元</span>
                  <br />
                  {/*this.precisionControl(((Number(recode.posprice) - Number(recode.discount_fee)) * recode.num).toFixed(3))*/}
                  {this.precisionControl(recode.subtotal)}元
								</span>
                : <span>
                  {this.precisionControl(Number(recode.posprice) * recode.num)}元
									<br />
                  {
                    recode.specialPrice
                      ? <i style={{ color: 'red' }}>{this.precisionControl((recode.specialPrice * recode.num).toFixed(3))}元</i>
                      : null
                  }
                </span>
            }
          </span>
        )
      }, {
        title: '操作',
        key: 'action',
        render: (text, recode) => (
          <span>
            {
              this.props.setting.remove
                ? <Popover
                  content={this.selectOption(recode)}
                  trigger="click"
                >
                  <i
                    style={{
                      color: "rgb(253, 116, 56)"
                    }}
                    className="iconfont icon-shanchu"
                  />
                </Popover>
                : <i
                  style={{
                    color: "rgb(253, 116, 56)"
                  }}
                  className="iconfont icon-shanchu"
                  onClick={() => {
                    let r = { ...recode, weight: recode.num }
                    let list = {
                      goods: [r],
                      weight: r.num,
                      delete_reason: '误触',
                      storeid: this.props.store.data.id
                    }
                    getWeightLog(list)
                    this.props.dispatch(removeFromOrderList(r.barcode, this.props.orderIndex, recode.key - 1))
                  }}
                />
            }
          </span>
        ),
      }]
    };

    this.input_price = createRef()
    this.input_num = createRef()
  }

  /**
   * 选择器函数组件
   * */
  selectOption = (r) => {
    let map_data = ["误触", "顾客不想要"]
    const onClick = (v) => {
      r = { ...r, weight: r.num }
      let list = {
        goods: [r],
        weight: r.num,
        delete_reason: v,
        storeid: this.props.store.data.id
      }
      getWeightLog(list)
      this.props.dispatch(removeFromOrderList(r.barcode, this.props.orderIndex, r.key - 1))
    }

    return (
      <div
        style={{
          width: '120px',
          cursor: "default",
          fontSize: "12px",
        }}
      >
        <p
          style={{
            width: '100%',
            textAlign: 'center',
            borderBottom: "1px solid rgb(200,200,200)",
          }}
        >删除原因</p>
        {
          map_data.map((item, i) => (
            <div
              key={i}
              onClick={() => onClick(item)}
              style={{
                marginBottom: "10px",
              }}
            >{item}</div>
          ))
        }
      </div>
    )
  }

  //精度控制
  round(num, decimal) {
    if (isNaN(num)) {
      return 0;
    }
    const p1 = Math.pow(10, decimal + 1);
    const p2 = Math.pow(10, decimal);
    return Math.round(num * p1 / 10) / p2;
  }

  toFixed(num, decimal) {
    return this.round(num, decimal).toFixed(decimal);
    // return this.round(num, decimal).toFixed(decimal);
  }

  precisionControl(value) {
    let { data } = this.props.store
    if (data) return data.total_set === 1 ? this.toFixed(value, data.total_accuracy) : value.toString().substring(0, value.toString().indexOf('.') + data.total_accuracy + 1)
    // return value.toFixed(2)
    // console.log(data.total_set === 1 ? value.toFixed(data.total_accuracy) : value.toString().substring(0, value.toString().indexOf('.') + data.total_accuracy + 1))
  }

  //删除 （弃用）
  // onDelete(recode) {
  //   // if(recode.isweight==1){//判断是否是称重商品
  //   let list = {
  //     goods: [recode],
  //     weight: recode.num,
  //     storeid: this.props.store.data.id
  //   }
  //   getWeightLog(list)//商品删除时做记录
  //   // }
  //   this.props.dispatch(removeFromOrderList(recode.barcode, this.props.orderIndex))
  // }

  //重新取重
  onResetWeight() {
    let { selectedItem } = this.state
    getWeight().then(res => {
      selectedItem.num = selectedItem.changeunitname == "斤" ? res.data * 2 : res.data
      // selectedItem.isweight = '1'//判断是否是称重商品
      this.setState({
        selectedItem,
      }, () => {
        this.props.dispatch(updateFromOrderList(this.state.selectedItem, this.props.orderIndex, this.state.itemIndex))
      })
    })
  }

  //临时修改
  onModifyFunc = (item, attribute) => {
    let obj = {
      "num": "show_subquantity_modify_permission",
      "subtotal": "show_subprice_modify_permission",
    }
    let bool = this.props.store.data[obj[attribute]] == 2 ? true : false
    this.setState({
      modifyType: attribute,
      selectedItem: Object.assign({}, item),
      currentValue: {
        posprice: item.posprice - item.discount_fee,
        discount: item.discount_num,
        subtotal: item.subtotal ? item.subtotal : item.posprice * item.num - item.discount_fee,
        num: item.num,
      },
      visible: true,
      is_first: true,
      swqx1127: bool,
    })
    // setTimeout(() => {
    //   attribute == 'num' ? (this.input_num.current ? this.input_num.current.focus() : null) : (this.input_price.current ? this.input_price.current.focus() : null)
    // }, 0)
  }

  onChangeInputValue(value, key) {
    let { selectedItem } = this.state
    selectedItem[key] = value
    this.setState({
      selectedItem: selectedItem
    })
  }

  /**
	 * [计算添加商品后是否符合促销规则]
	 * @param item Obj 商品详细信息
	 */
  onMeetPromotional = (item) => {
    let { leaflet, order: { dataList: [list] } } = this.props
    // 过滤出契合商品的促销规则
    leaflet = leaflet.length === 0
      ? leaflet
      : leaflet.filter(i => {
        return i.promotion_goodsid == item.goodsid
      })

    if (
      leaflet.length === 0
      || ("gkg斤克千克吨公斤".includes(item.changeunitname)
        && JSON.parse(window.localStorage.getItem('__setting')).is_tabulate)
    ) return item

    let itemList = list.filter(i => item.goodsid == i.goodsid)
    let replaceItem = {}
    for (const key of Object.keys(item)) {
      if (
        key == "showPromotionImg"
        || key == "isRestriction"
        || key == "isPromotion"
      ) continue
      replaceItem[key] = ''
    }

    for (const [key, value] of leaflet.entries()) {
      let {
        promotionsales_type,
        promotion_num,
        additional_price,
        once_or_each,
        additional_num,
      } = value

      if (
        promotionsales_type == 11
        && promotion_num <= item.num
      ) {
        if (
          itemList.some(i => i.isPromotion)
          && once_or_each == 1
        ) break
        if (
          itemList.find(i => i.isPromotion)
          && itemList.find(i => i.isPromotion).num == Math.floor(item.num / additional_num) * additional_num
          && once_or_each == 2
        ) break

        this.setState({
          showPromotion: true,
          promotionInfo: { ...value, num: item.num, replaceItem },
        })
        break
      } else if (
        promotionsales_type == 12
        && item.isRestriction
        && !item.isPromotion
      ) {
        item = {
          ...replaceItem,
          isRestriction: true,
          barcode: item.barcode,
          goodsid: item.goodsid,
          name: item.name,
          changeunitname: item.changeunitname,
          num: item.num >= promotion_num ? promotion_num : item.num,
          posprice: additional_price,
          subtotal: (item.num >= promotion_num ? promotion_num : item.num) * additional_price,
          discount_fee: 0,
          showPromotionImg: 1,
        }
        break
      }
    }
    return item
  }

  /**
	 * [添加促销商品]
	 */
  onAddPromotion = () => {
    let {
      additional_gname,
      additional_unitname,
      additional_num,
      additional_price,
      additional_barcode,
      promotion_goodsid,
      once_or_each,
      num,
      replaceItem,
      promotion_num,
    } = this.state.promotionInfo
    let { dataList: [list] } = this.props.order
    let item = {
      ...replaceItem,
      barcode: additional_barcode,
      goodsid: promotion_goodsid,
      name: additional_gname,
      changeunitname: additional_unitname,
      num: once_or_each == 1 ? +additional_num : Math.floor(num / promotion_num) * additional_num,
      posprice: (additional_price / additional_num).toFixed(2),
      subtotal: once_or_each == 1 ? +additional_price : Math.floor(num / promotion_num) * additional_price,
      discount_fee: 0,
      isPromotion: 1,
      showPromotionImg: 1,
    }

    if (list.some(i => i.goodsid == promotion_goodsid && i.isPromotion)) {
      this.props.dispatch(updateFromOrderList(item, 0))
    } else {
      this.props.dispatch(addToOrderList(item, 0))
    }
    this.setState({
      showPromotion: false,
    })
  }

  onEditInput(value, key) {

    let { selectedItem, currentValue } = this.state
    let output = this.onVirtualKeyboard(value, this.state.currentValue[key], () => {
      selectedItem.num = Number(selectedItem.num)
      selectedItem = this.onMeetPromotional(selectedItem)
      this.props.dispatch(updateFromOrderList(selectedItem, this.props.orderIndex, this.state.itemIndex))
      this.setState({
        visible: false,
      })
    })

    currentValue[key] = output
    let __member = JSON.parse(localStorage.getItem('__member')).data
    let is_memberprice = selectedItem.is_memberprice
    if (key === 'posprice') {
      selectedItem.discount_num = (Number(output)) / selectedItem.posprice * 100
      selectedItem.discount_fee = selectedItem.posprice - Number(output)
      selectedItem.modifyprice = (selectedItem.posprice - (selectedItem.posprice - Number(output))).toFixed(2)
      // selectedItem.subtotal=2
    } else if (key === 'discount') {
      //折扣比
      console.log(selectedItem)
      selectedItem.discount_num = Number(output)
      selectedItem.discount_fee = (100 - Number(output)) / 100 * selectedItem.posprice
      // selectedItem.modifyprice = (selectedItem.posprice - ((100 - Number(output)) / 100 * selectedItem.posprice)).toFixed(2)
      if(__member && is_memberprice=='2'){
        // console.log('__member')
        selectedItem.modifyprice = (selectedItem.memberprice - ((100 - Number(output)) / 100 * selectedItem.memberprice)).toFixed(2)
      }else{
        selectedItem.modifyprice = (selectedItem.posprice - ((100 - Number(output)) / 100 * selectedItem.posprice)).toFixed(2)
      }
      // selectedItem.subtotal=3
    } else if (key === 'subtotal') {
      selectedItem.discount_num = output / selectedItem.num / selectedItem.posprice * 100
      selectedItem.discount_fee = (Number(selectedItem.posprice) - (Number(output) / selectedItem.num))
      selectedItem.modifyprice = (Number(output)) / selectedItem.num
      // selectedItem.subtotal=4
    } else if (key === 'num') {
      selectedItem.num = Number(output)
      // selectedItem.subtotal=5
    }

    this.setState({
      selectedItem,
      currentValue,
    })
  }

  onVirtualKeyboard(value, str, success) {
    str = str.toString()
    if (!isNaN(Number(value))) {
      if (this.state.is_first) {
        str = ''
        this.setState({ is_first: false })
      }

      if (Number(value) > 9 && Number(str) % 10 === 0) {
        str = Number(str) + Number(value)
      } else {
        str = !str ? value : str + value
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
          success()
          break
        default:
      }
    }
    return str
  }

  //修改商品重量/数量
  renderModifyNum() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', flexFlow: 'column', paddingBottom: '20px' }}>
        <div>
          {/* <FormItem
            label="商品名称"
            labelCol={{span: 12}}
            wrapperCol={{span: 12}}
          >
            <span>{this.state.selectedItem.name || ''}</span>
          </FormItem>
          <FormItem
            label="商品数量"
            labelCol={{span: 12}}
            wrapperCol={{span: 12}}
          >
            <Input
              size="large"
              ref={this.input_num}
              style={{width: 100}}
              defaultValue={this.state.selectedItem.num || 1}
              value={this.state.selectedItem.num}
              onChange={(value) => this.onChangeInputValue(value, 'num')}
            />
          </FormItem> */}
          <Input
            addonBefore="商品名称:"
            defaultValue={this.state.selectedItem.name || ''}
            disabled={true}
            style={{
              display: 'block',
              width: '330px',
              margin: '20px auto',
            }}
          />
          <Input
            addonBefore="商品数量:"
            size="large"
            ref={this.input_num}
            onFocus={() => this.setState((state, props) => ({
              selectedItem: { ...state.selectedItem, num: ' ' },
            }))}
            style={{
              display: 'block',
              width: '330px',
              margin: '20px auto',
            }}
            defaultValue={this.state.selectedItem.num || 1}
            value={this.state.selectedItem.num}
            onChange={(event) => {
              let val = event.target.value
              this.setState((state, props) => ({
                selectedItem: { ...state.selectedItem, num: this.fat_num(val) }
              }))
            }}
          />
          {
            'gkg斤克千克吨'.indexOf(this.state.selectedItem.changeunitname) === -1 ?
              null
              :
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Button
                  style={{ width: '100%' }}
                  size="large"
                  onClick={this.onResetWeight.bind(this)}
                >重新称重</Button>
              </div>
          }
        </div>
        <NumericKeypad onClick={(value) => this.onEditInput(value, 'num')} />
      </div>
    )
  }

  //修改商品
  renderModifySubtotal() {
    let { selectedItem, tabSwitch } = this.state
    const tabName = tabSwitch === 'tab-discount_fee' ? 'posprice' : (tabSwitch === 'tab-discount_num' ? 'discount' : 'subtotal')
    return (
      <div className="modal-inner">
        <div className="modal-inner-left">
          <div className="header-message">
            <span>数/重量：<span style={{ flex: '1' }}>{(+selectedItem.num).toFixed(2)}{selectedItem.changeunitname}</span></span>
            <span>原价：<span style={{ flex: 1 }}>{(+selectedItem.posprice).toFixed(2)}元/{selectedItem.changeunitname}</span></span>
            <span>优惠价：<span
              style={{ flex: 1 }}>{selectedItem.modifyprice ? (+selectedItem.modifyprice).toFixed(2) : ((Number(selectedItem.posprice) - Number(selectedItem.discount_fee)).toFixed(2))}元/{selectedItem.changeunitname}</span></span>
            <span>小计：<span
              style={{ flex: 1 }}>{selectedItem.modifyprice ? (Number(selectedItem.modifyprice) * selectedItem.num).toFixed(2) : ((Number(selectedItem.posprice) - Number(selectedItem.discount_fee)) * selectedItem.num).toFixed(2)}元</span></span>
            <span>优惠小计：<span
              style={{ flex: 1 }}>{selectedItem.modifyprice ? ((Number(selectedItem.posprice) - Number(selectedItem.modifyprice)) * selectedItem.num).toFixed(2) : (selectedItem.discount_fee * selectedItem.num).toFixed(2)}元</span></span>
            <span>单品优惠金额：<span
              style={{ flex: 1 }}>{selectedItem.modifyprice ? (Number(selectedItem.posprice) - Number(selectedItem.modifyprice)).toFixed(2) : (+selectedItem.discount_fee).toFixed(2)}元</span></span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <RadioGroup onChange={(item) => this.setState({ tabSwitch: item.target.value })}
              defaultValue="tab-discount_fee" size="large">
              <RadioButton value="tab-discount_fee" style={{ width: 200 }}>临时调价</RadioButton>
              <RadioButton value="tab-discount_num" style={{ width: 200 }}>单品打折</RadioButton>
              <RadioButton value="tab-subtotal" style={{ width: 200 }}>小计减免</RadioButton>
            </RadioGroup>
          </div>
          <div>
            {
              tabSwitch === 'tab-discount_fee' ?
                <FormItem label="修改售价">
                  <Input
                    addonAfter="元"
                    type="text"
                    value={this.precisionControl(this.state.currentValue.posprice)}
                    onChange={(e) => {
                      let val = this.fat_num(e.target.value)
                      if (val != this.state.currentValue.posprice) {
                        if (!this.state.currentValue.posprice) {
                          this.onEditInput(val, tabName)
                        }
                        if (this.state.currentValue.posprice.length < val.length) {
                          this.onEditInput(val.slice(-1), tabName)
                        } else if (this.state.currentValue.posprice.length > val.length) {
                          this.onEditInput("退格", tabName)
                        }
                      }
                    }}
                    onFocus={() => this.onEditInput('清除', tabName)}
                    size="large"
                    ref={this.input_price}
                  />
                </FormItem>
                : (
                  tabSwitch === 'tab-discount_num'
                    ? <FormItem label="折扣比：">
                      <Input
                        addonAfter="%"
                        type="text"
                        value={this.precisionControl(this.state.currentValue.discount)}
                        size="large"
                        onChange={(e) => {
                          let val = this.fat_num(e.target.value)
                          // console.log(tabName)
                          if (val != this.state.currentValue.discount) {
                            if (!this.state.currentValue.discount) {
                              this.onEditInput(val, tabName)
                            }
                            if (this.state.currentValue.discount.length < val.length) {
                              this.onEditInput(val.slice(-1), tabName)
                            } else if (this.state.currentValue.discount.length > val.length) {
                              this.onEditInput("退格", tabName)
                            }
                          }
                        }}
                        onFocus={() => this.onEditInput('清除', tabName)}
                      />
                    </FormItem>
                    : <FormItem label="修改小计：">
                      <Input
                        addonAfter="元"
                        type="text"
                        value={this.precisionControl(this.state.currentValue.subtotal)}
                        size="large"
                        onChange={(e) => {
                          let val = this.fat_num(e.target.value)
                          if (val != this.state.currentValue.subtotal) {
                            if (!this.state.currentValue.subtotal) {
                              this.onEditInput(val, tabName)
                            }
                            if (this.state.currentValue.subtotal.length < val.length) {
                              this.onEditInput(val.slice(-1), tabName)
                            } else if (this.state.currentValue.subtotal.length > val.length) {
                              this.onEditInput("退格", tabName)
                            }
                          }
                        }}
                        onFocus={() => this.onEditInput('清除', tabName)}
                      />
                    </FormItem>
                )
            }
          </div>
        </div>
        <NumericKeypad onClick={(value) => this.onEditInput(value, tabName)} />
      </div>
    )
  }

  /**
	 * [格式化输入金额]
	 */
  fat_num = (val) => {
    val = val.replace(/[^0-9.]/g, '')
    if (val.split(/\./g).length > 2) {
      val = val.split(/\./g)
      val = `${val[0]}.${val.splice(1).join('')}`
    }
    return val
  }

  render() {
    //处理小计问题
    this.props.dataList.forEach((item, index) => {
      item['key'] = index + 1;
      //处理会员价和修改价格
      if (item['modifyprice'] || item['modifyprice'] == 0) {
        item['subtotal'] = this.precisionControl(item.modifyprice * item.num)
      } else {
        if (item.specialPrice) {
          item['subtotal'] = this.precisionControl(item.specialPrice * item.num)
        } else {
          item['subtotal'] = this.precisionControl(item.posprice * item.num)
        }
      }
    })
    return (
      <Fragment>
        <div className="silder-right-body app-sider" style={{ width: '100%' }}>
          <Table
            // `table-back order-table  ${this.props.setting.fontSize === 8 ? 'fs' : '' } ${this.props.setting.fontSize === 14 ? 'fm' : '' } ${this.props.setting.fontSize === 17 ? 'fb' : '' } `
            // `order-table  ${this.props.setting.fontSize === 8 ? 'fs' : '' } ${this.props.setting.fontSize === 14 ? 'fm' : '' } ${this.props.setting.fontSize === 17 ? 'fb' : '' } `
            columns={this.state.columns}
            dataSource={this.props.dataList}
            rowClassName={(recode, idx) => {
              if (recode.is_freegift == 2) {
                return `order-table  ${this.props.setting.fontSize === 8
                  ? 'fs'
                  : ''} ${this.props.setting.fontSize === 14
                    ? 'fm'
                    : ''} ${this.props.setting.fontSize === 17
                      ? 'fb'
                      : ''} `
              }
              if (recode.discount_fee !== 0) {
                return this.precisionControl(recode.subtotal) == 0
                  ? `table-back order-table  ${this.props.setting.fontSize === 8
                    ? 'fs'
                    : ''} ${this.props.setting.fontSize === 14
                      ? 'fm'
                      : ''} ${this.props.setting.fontSize === 17
                        ? 'fb'
                        : ''} `
                  : `order-table  ${this.props.setting.fontSize === 8
                    ? 'fs'
                    : ''} ${this.props.setting.fontSize === 14
                      ? 'fm'
                      : ''} ${this.props.setting.fontSize === 17
                        ? 'fb'
                        : ''} `
              } else {
                return recode.specialPrice ? (this.precisionControl((recode.specialPrice * recode.num).toFixed(3)) == 0 ? `table-back order-table  ${this.props.setting.fontSize === 8 ? 'fs' : ''} ${this.props.setting.fontSize === 14 ? 'fm' : ''} ${this.props.setting.fontSize === 17 ? 'fb' : ''} ` : `order-table  ${this.props.setting.fontSize === 8 ? 'fs' : ''} ${this.props.setting.fontSize === 14 ? 'fm' : ''} ${this.props.setting.fontSize === 17 ? 'fb' : ''} `) : (+recode.posprice * recode.num == 0 ? `table-back order-table  ${this.props.setting.fontSize === 8 ? 'fs' : ''} ${this.props.setting.fontSize === 14 ? 'fm' : ''} ${this.props.setting.fontSize === 17 ? 'fb' : ''} ` : `order-table  ${this.props.setting.fontSize === 8 ? 'fs' : ''} ${this.props.setting.fontSize === 14 ? 'fm' : ''} ${this.props.setting.fontSize === 17 ? 'fb' : ''} `)
              }
            }}
          />
          <Modal
            wrapClassName="silder-right-modal"
            title={this.state.modifyType === 'num' ? '修改商品数量' : '单品临时减免/折扣'}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={() => this.setState({ visible: false })}
            footer={null}
            width={this.state.modifyType === 'num' ? '500px' : '100%'}
            className="countModal"
          >
            {this.state.modifyType === 'num' ? this.renderModifyNum() : this.renderModifySubtotal()}
          </Modal>
          {/* 促销规则弹窗 */}
          {
            this.state.promotionInfo
              ? <Modal
                visible={this.state.showPromotion}
                title="促销"
                cancelText="忽略"
                okText="添加"
                onOk={this.onAddPromotion}
                onCancel={() => this.setState({ showPromotion: false })}
              >
                <p>
                  {`${this.state.promotionInfo.promotionsales_name},购买${this.state.promotionInfo.promotion_gname}达到${+this.state.promotionInfo.promotion_num}${this.state.promotionInfo.promotion_unitname},增加${this.state.promotionInfo.additional_price}元便赠送${+this.state.promotionInfo.additional_num + this.state.promotionInfo.additional_unitname + this.state.promotionInfo.additional_gname}`}
                </p>
              </Modal>
              : null
          }

        </div>
        <Qx1127
          on_click={() => {
            this.setState({
              swqx1127: false,
              visible: false,
            })
          }}
          callback={() => {
            this.setState({
              swqx1127: false,
            })
          }}
          visible={this.state.swqx1127}
        />
      </Fragment>
    )
  }
}

export default withRouter(connect(mapStateToProps)(SiderRightBody));
