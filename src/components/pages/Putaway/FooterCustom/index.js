/**
 * file 商品上架
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, notification } from 'antd'
import { withRouter } from 'react-router-dom'

import { clearputawayList, getCategory, getoutGoods, } from '@/action'
import { goodsUp } from '@/api'

const confirm = Modal.confirm;

const mapStateToProps = (state, ownProps) => ({
    store: state.store,
    sale: state.sale,
    putaway: state.putaway,
    setting: state.setting,
})

class index extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: false,
		};
	}

	onSubmit = () => {
		let { list } = this.props.putaway

        let q = list.filter( item=>{
            return item.maplist.length === 1
        } )
            .map( item=>{
                return {
                    barcode_id: item.barcode_id,
                    goodsid: item.goodsid,
                    nowprice: item.nowprice,
                    supprices: item.supprices,
                    gprice: item.gprice,
                    oprice: item.oprice,
                    mprice: item.mprice,
                    store_id: item.store_id,
                    barcode: item.barcode,
                    is_memberprice: item.is_memberprice,
                    is_membership: item.is_membership,
                    memberprice: item.memberprice,
                    posprice: item.posprice,
                    uniacid: item.uniacid,
                }
            } )
        let w = list.filter( item=>{
            return item.maplist.length !== 1
        } )
            .map( item=>{
                return item.maplist.map( i=>{
                    return {
                        barcode_id: i.id,
                        goodsid: item.goodsid,
                        barcode: i.barcode,
                        nowprice: item.nowprice,
                        "supprices":item.supprices,
                        "gprice":item.gprice,
                        "oprice":item.oprice,
                        "mprice":item.mprice,
                        store_id: item.store_id,
                        "is_memberprice":item.is_memberprice,
                        "is_membership":item.is_membership,
                        "memberprice":item.memberprice,
                        "uniacid":item.uniacid,
                        posprice: item.posprice,
                    }
                } )
            } )
        list = q.concat(...w)

		const onOk = () => {
			if(!list&&list.length === 0) {
				notification.error({
	                message: '提交上架单为空',
	                description: '请先检查上架商品后重试',
	            })
				return
			}
			goodsUp({ list })
			.then( ({data}) => {
				this.props.clearputawayList()
                if(data.status == 1){
                    notification.success({
                        message: '提示',
                        description: '上架单提交成功',
                    })
                    this.props.getCategory()
						.then( data=>{
                            if(data.length !== 0) {
                                this.props.getoutGoods({
                                    uniacid: this.props.store.uniacid,
                                    category: `${data[0].id}`,
                                    store_id: this.props.store.data&&this.props.store.data.id,
                                    rows:this.props.setting.rowsnum
                                })
                            }
						} )
				}
			})
		}

		confirm({
			title: '提交上架单',
			content: '是否提交上架',
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
		this.props.putaway.list.forEach(item => totalPrice += item.num * +item.posprice)
		return totalPrice.toFixed(2)
	}
	
	render() {
		var rand = Math.floor(Math.random () * 900) + 1;
		return (
			<div className="audio-controller" style={{justifyContent: 'space-between'}}>
				<div>
	                <div 
		                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ccc',width: 105, height: 100}} 
		                onClick={() => this.props.history.push({pathname:'/app/dashboard/73'+rand})}
	                >
	                    <span style={{fontSize: 16}}>退出</span>
	                </div>
			    </div>
			    <div className="right row">
			    	{/*<div className="section1">*/}
                        {/*<span>*/}
                            {/*上架总金额（元）*/}
                        {/*</span>*/}
                        {/*<span className="price">{this.totalPrice()}</span>*/}
                    {/*</div>*/}
	                <div className="section3 row" onClick={this.onSubmit}>
	                    <div>
	                        <span className="complete-icon"><i className="iconfont icon-jsq" /></span>
	                    </div>
	                    <div className="complete-title">
	                        <span>生成上架单</span>
	                        <span className="price" />
	                    </div>
	                </div>
	            </div>
			</div>
		);
	}
}

export default withRouter(connect(mapStateToProps, { clearputawayList, getCategory, getoutGoods, })(index))