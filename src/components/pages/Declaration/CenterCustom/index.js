/**
 * file 报损单内容
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Pagination, Input, Select } from 'antd'

import GoodsCell from './GoodsCell'
import NumericKeypad, { onVirtualKeyboard } from '@/widget/NumericKeypad'

import { getStockGoods, addToReportDamageList, changePageStockGoods } from '@/action'
import { WithModal } from '@/widget'

const Option = Select.Option


const mapStateToProps = (state, ownProps) => ({
    stockgoods: state.stockgoods,
    setting: state.setting,
    fullsub: state.fullsub,
})

class index extends Component {

	constructor(props) {
		super(props);

		this.state = {
			selectOne   : -1,
            goodsList   : [],
            visible     : false,
            selectItem  : {},
            page        : 1,
            num 		: 0,
            remark      : '',
		};
	}

	componentWillReceiveProps(nextProps) {
        /**
         * [重置选中动画]
         * 时长控制抖动幅度
         */
        setTimeout(() => {
            this.setState({selectOne: -1})
        },0)
    }

    shouldComponentUpdate(nextProps) {
        const is_search = (data) => {
            if(data.search&&(data.search !== nextProps.stockgoods.data.search)) {
                this.addAutomatically(nextProps.stockgoods.data)
                return false
            }else{
                //重置分页当前页
                if(this.props.location.pathname !== nextProps.location.pathname&&this.state.page !== 1) {
                    this.setState({
                        page: 1
                    })
                }
                return true
            }
        } 
        if(this.props.stockgoods.data) {
            return is_search(this.props.stockgoods.data)
        } else {
            if(nextProps.stockgoods.data&&nextProps.stockgoods.data.search !== '') {
                this.addAutomatically(nextProps.stockgoods.data)
            }
            return true
        }
    }

    /**
     * [addAutomatically 自动添加到订单]
     * 查询商品 若是 单商品 且 单规格 自动添加到订单
     * @param {[type]} obj [后台返回值 包括商品数组msg 与 搜索条件 search]
     */
    addAutomatically(obj) {
        if(obj.data.length === 1&&obj.data[0].barcode.length === 1) {
            this.onSelected(obj.data[0], 0)
        }
    }

	/**
     * [curPageGoods 节选出当前页码下的商品]
     */
    curPageGoods() {
        const { data } = this.props.stockgoods
        let start = (data.page - 1) * data.rows
        let end = (data.page * data.rows)
        return data.data.slice(start, end)
    }

    onSelected(item: Object, index: Number) {
        this.setState({
            selectItem: item,
            selectOne: index,
        }, () => {
          this.onSelectedFormat(item)
        })
    }

    onSelectedFormat(item: Object, index:Number) {
        let { selectItem } = this.state
        let specname = []
        const ARR = [1, 2, 3]
        ARR.forEach(num => {
            if(!(!item['specitemname'+num] && typeof item['specitemname'+num] === 'object')&&item['specitemname'+num] !== '') {
                specname.push(item['specitemname'+num])
            }
        })

        this.iterator = this.addToReportDamageList({item, selectItem, specname})
        this.iterator.next()
    }

    *addToReportDamageList({item, selectItem, specname}) {
        let obj = {
            name            : selectItem.name,// `name`
            costprice       : item.costprice,// `posprice` varchar(100) NOT NULL COMMENT '库存成本',
            goodsid         : selectItem.id,
            barcodeid       : item.barcodeid,
            barcode         : item.barcode,// `barcode` varchar(50) NOT NULL COMMENT '商品条码',
            unit_name       : selectItem.unit_name,// `changeunitname` '售出单位'
        }
        this.setState({ num: 0, remark: '' })
        yield(() => {
            const next = () => {
                this.iterator.next()
            }
            const editInput = value => {
                let output = onVirtualKeyboard(value, this.state.num, () => {
                    next()
                })

                this.setState({ 
                    num: output 
                })
            }
            const render = () => (
                <div>
                    <Input
                        ref={ref => this.newposproiceinput = ref}
                        size="large"
                        style={{marginBottom: 20}}
                        onChange={e => this.setState({num: e.target.value})}
                        value={this.state.num}
                    />
                    {
                        this.props.fullsub.data.damage_remark ? (
                            <Select defaultValue="报损备注" size="large" onChange={value => this.setState({remark: value})} style={{width: '100%', marginBottom: 20}}>
                                {
                                    this.props.fullsub.data.damage_remark.map((item, index) => <Option value={item.remark} key={`remark${index}`}>{item.remark}</Option>)
                                }
                            </Select>
                        ) : <div style={{display: 'inline-block', width: '100%', height: 38, borderWidth: 1, borderStyle: 'dashed', borderRadius: 6, borderColor: '#ccc'}}>
                            <h5 style={{height: 38, lineHeight: '38px', textAlign: 'center'}}>暂无备注选项</h5>
                        </div>
                    }
                    <NumericKeypad onClick={editInput} />
                </div>
            )
            this.withmodal.show({
                title: '报损数量',
                content: render,
            }).then(res => {
                // focus()
            })
        })()

        obj['num'] = this.state.num
        obj['remark'] = this.state.remark
        this.props.addToReportDamageList(obj)
        this.withmodal.colse()
    }

    onPageChange(page, pageSize) {
        /**
         * [if 当前页码*每页数量 大于 现有的商品条数 且 现有的商品条数小于 总共的商品条数 ]
         * [true 请求接口]
         * [false 改变页码，拿本地数据]
         */
        const { data } = this.props.stockgoods

        if(page * pageSize > data.data.length&& data.data.length < data.total) {
            this.props.getStockGoods({page})
        } else {
            this.props.changePageStockGoods(page)
        }
        this.setState({
            page
        })
    }

	render() {
		return (
			<div className="center-custom-container" style={{flexWrap: 'wrap', paddingRight: 5}}>
                {
                    this.props.stockgoods.data&&this.curPageGoods().map((item, index) => (
                        <GoodsCell
                            key={ index }
                            index = { index }
                            selectOne={ this.state.selectOne }
                            item={ item }
                            onSelected={ this.onSelected.bind(this) }
                            setting={this.props.setting}
                        />
                    ))
                }
                {
                    this.props.stockgoods.data&&this.props.stockgoods.data.data.length === 0 ? <h1 className="tips">此分类暂无商品</h1> : null
                }
                <Pagination
                    simple  
                    className="pagination" 
                    size="large" 
                    defaultCurrent={1}
                    current={this.state.page}
                    pageSize={this.props.stockgoods.data&&this.props.stockgoods.data.rows} 
                    total={this.props.stockgoods.data&&this.props.stockgoods.data.total}
                    onChange={this.onPageChange.bind(this)} 
                />
                <WithModal footer={null} ref={(ref) => this.withmodal = ref} />
            </div>
		);
	}
}

export default connect(mapStateToProps, { addToReportDamageList, getStockGoods, changePageStockGoods })(index)