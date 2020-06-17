/**
 * file 商品调价
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Modal, Input, Spin, notification} from 'antd'
import {bindActionCreators} from 'redux'
import {withRouter} from 'react-router-dom'

import {clearPriceAdjustmentList, getGoods} from '@/action'
import {changePricePerpetual, changePrice,} from '@/api'

const mapStateToProps = (state, ownProps) => ({
  store: state.store,
  sale: state.sale,
  priceadjustment: state.priceadjustment,
  authority: state.authority,
  setting: state.setting,
})

const mapDispatchToProps = dispatch => ({
  clearPriceAdjustmentList: bindActionCreators(clearPriceAdjustmentList, dispatch),
  getGoods: bindActionCreators(getGoods, dispatch),
})

class index extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      member_id: '',
      loading: false,
    };

    this.throttling_onSubmit = false
  }

  /**
   * 点击生成调价单事件
   */

  onSubmit = () => {
    if(this.throttling_onSubmit){
      return
    }

    const {store, sale, priceadjustment, authority,} = this.props

    if (!priceadjustment.list.length) {
      notification.error({
        message: '提交调价单为空',
        description: '请先检查调价商品后重试',
      })
      return
    }

    if(priceadjustment.list.some(item=>item.newposprice == 0)){
      notification.error({
        message: '提示',
        description: '调价单有商品价格为0',
      })
      return
    }

    const obj = {
      storeid: store.data.id,
      salerid: sale.data.id,
      member_id: authority.data ? authority.data.data.member_id : '',
      list: priceadjustment.list,
    }
    this.setState({loading: true})

    this.throttling_onSubmit = true
    changePrice(obj)
      .then(({data}) => {
        if (data.status == 4005) {
          notification.error({
            message: '提示',
            description: '提交调价单失败，请检查是否登录',
          })
          return
        }
        this.props.clearPriceAdjustmentList()
        this.setState({
          loading: false,
          visible: false,
          member_id: '',
        }, () => {
          const {location, history} = this.props
          console.log(location, history)
          const params = location.pathname.split('/')
          const key = params[params.length - 1]
          this.props.getGoods({category: key, store_id: this.props.store.data.id, rows: this.props.setting.rowsnum})
        })
      })
      .then(()=>{
        this.throttling_onSubmit = false
      })
    // this.setState({
    // 	visible: true,
    // 	member_id: '',
    // },() => {
    // 	setTimeout(() => {
    // 		this.authCodeInput.focus()
    // 	},0)
    // })
  }

  render() {
    var rand = Math.floor(Math.random() * 900) + 1;
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
          <div className="section3 row" onClick={this.onSubmit}>
            <div>
              <span className="complete-icon"><i className="iconfont icon-jsq"/></span>
            </div>
            <div className="complete-title">
              <span>生成调价单</span>
              <span className="price"/>
            </div>
          </div>
        </div>
        {/*<Modal*/}
        {/*title="调价单提交"*/}
        {/*visible={this.state.visible}*/}
        {/*width={378}*/}
        {/*footer={null}*/}
        {/*onCancel={() => this.setState({visible: false})}*/}
        {/*>*/}
        {/*<Spin spinning={this.state.loading} tip="提交中。。。">*/}
        {/*<div style={{textAlign: 'center', marginTop: -60}}>*/}
        {/*<Input.Search*/}
        {/*ref={ref => this.authCodeInput = ref}*/}
        {/*value={this.state.member_id}*/}
        {/*onChange={(e) => this.setState({member_id: e.target.value})}*/}
        {/*onSearch={this.onSearch}*/}
        {/*onBlur={() => {this.authCodeInput.focus()}}*/}
        {/*style={{opacity: 0}}*/}
        {/*/>*/}
        {/*<i className="iconfont icon-erweima" style={{fontSize: 200}} />*/}
        {/*<h3>需要管理员权限，请扫描管理员二维码</h3>*/}
        {/*</div>*/}
        {/*</Spin>*/}
        {/*</Modal>*/}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(index))