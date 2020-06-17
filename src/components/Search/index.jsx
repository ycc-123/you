import React, { Component } from 'react'
import { Input, Popover, Select, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import NumericKeypad, { onVirtualKeyboard } from '@/widget/NumericKeypad'
import { getsearchGoods, changeSetting, addToOrderList, getoutsearchGoods } from '@/action'

const Option = Select.Option;
const mapStateToProps = (state, ownProps) => ({
  setting: state.setting,
  category: state.category,
  store: state.store,
})

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      visible: false,
      type: 1,
      KeypadType: true
    }
    this.settimer = null
  }

  onChange = e => {
    var re = /^[0-9]+.?[0-9]*$/
    // this.props.changeSetting({search: e.target.value,searchtype:this.state.type})
    this.setState({
      searchValue: e.target.value
    })
    // if (this.settimer) clearTimeout(this.settimer)
    // this.settimer = setTimeout(() => {
    //   if (re.test(this.state.searchValue) && (this.state.searchValue.length == 8 || this.state.searchValue.length == 13)) {
    //     this.props.changeSetting({ search: this.state.searchValue })
    //     this.onSearch(this.state.searchValue)
    //   }
    //   if (!re.test(this.state.searchValue)) {
    //     this.onSearch(this.state.searchValue)
    //   }
    // }, 300)
  }

  //获取当前路由的商品类目
  getlength() {
    let params = window.location.href.split('/')
    for (var i = 0; i < params.length; i++) {
      if (params[i] === 'dashboard' || params[i] === 'priceadjustment') {
        return i + 1
      } else if (params[i] === 'reportdamage') {
        return i
      }
    }
  }

  //所有的搜索不根据商品类目搜索
  onSearch = (value) => {
    let params = window.location.href.split('/')
    // if (params.length - this.getlength() == 1) {
    // window.history.go(-1)
    // } else {
    // window.history.go(-2)
    // }
    var category = 0;
    this.props.changeSetting({ search: value, searchtype: this.state.type })

    if (params.length <= this.getlength()) {
      category = isNaN(Number(params[params.length - 1])) ? '0' : params[params.length - 1]
    } else {
      category = isNaN(Number(params[this.getlength()])) ? '0' : params[this.getlength()]
    }
    // 判断是否有搜索内容，无搜索内容时按商品分类展示
    if (value == '') {
      if (this.isPriceAdjustment() === 'putaway') {
        this.props.getoutsearchGoods({
          uniacid: this.props.store.uniacid,
          search: value,
          rows: this.props.setting.rowsnum,
          category: category
        })
          .then(res => {
            if (this.state.searchValue.length >= 14) {
              this.setState({ searchValue: '' })
            }
          })
        return
      }
      this.props.getsearchGoods({ a: this.props.setting.a, search: value, rows: this.props.setting.rowsnum, category: category })
        .then(({ search }) => {
          if (this.state.searchValue.length >= 14) {
            this.setState({ searchValue: '' })
          }

        })
    } else {
      if (this.isPriceAdjustment() === 'putaway') {
        this.props.getoutsearchGoods({
          uniacid: this.props.store.uniacid,
          search: value,
          rows: this.props.setting.rowsnum,
          type: this.state.type
        })
          .then(res => {
            if (this.state.searchValue.length >= 14) {
              this.setState({ searchValue: '' })
            }
          })
        return
      }
      if (value.length == 8 || value.length == 13) {
        var ev = new Event("keypress", { "bubbles": false, "cancelable": false })
        ev.key = value
        window.dispatchEvent(ev)
      } else {
        this.props.getsearchGoods({ a: this.props.setting.a, search: value, rows: this.props.setting.rowsnum, type: this.state.type })
          .then(({ search }) => {
            if (this.state.searchValue.length >= 14) {
              this.setState({ searchValue: '' })
            }
          })
      }
    }
  }

  /**
   * 用于url地址判断
   * @returns {*}
   */
  isPriceAdjustment = () => {
    const { history } = this.props
    return history.location.pathname.split('/')[1]
    // return history.location.pathname.split('/')[1] === 'priceadjustment'
  }

  editSearchInput(value) {
    let output = onVirtualKeyboard(value, this.state.searchValue, () => {
      this.onSearch(this.state.searchValue)
      this.hide()
    })
    // this.setState({ searchValue: output }, () => {
    //   // this.refs.searchInput.focus()
    //   this.onSearch(this.state.searchValue)
    // })
    this.setState({ searchValue: output })
  }

  hide = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }

  handleChange(value) {
    console.log(value);
    if (value == 1) {
      this.setState({
        KeypadType: true
      })
    } else {
      this.setState({
        KeypadType: false
      })
    }
    this.setState({
      type: value
    })
  }

  render() {
    const content = (
      <div>
        <NumericKeypad
          letter={true}
          onClick={this.editSearchInput.bind(this)}
          layout={this.state.KeypadType}
        />
      </div>
    );
    const selectBefore = (
      <Select
        defaultValue="首字母/国际条码搜索"
        style={{ width: 180 }}
        onChange={this.handleChange.bind(this)}
      >
        <Option value="1">首字母/国际条码搜索</Option>
        <Option value="2">商品名称搜索</Option>
        <Option value="3">商品编码搜索</Option>
      </Select>
    )
    return (
      <div className="search-bar">
        <Popover
          placement="bottom"
          content={content}
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
          onClick={() => {
            // this.searchInput.blur();
            this.setState({ searchValue: '' })
          }}
        >
          <Input.Search
            // ref="searchInput"
            ref={ref => this.searchInput = ref}
            size="large"
            addonBefore={selectBefore}
            value={this.state.searchValue}
            onChange={this.onChange}
            placeholder="搜索商品"
            onSearch={value => this.onSearch(value)}
          // onBlur={() => setTimeout(() => {
          //   this.setState({ searchValue: '' })
          // }, 600)}
          />
        </Popover>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, {
  getsearchGoods,
  changeSetting,
  addToOrderList,
  getoutsearchGoods,
})(Search))