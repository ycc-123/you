import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearOrderList, replaceOrderList, resetMember } from '@/action'
import { Table } from 'antd'

class SiderRightBodyList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            index:0,
            // dataList: props.dataList,
            columns:[
                {
                    title: '商品',
                    // key: 'name',
                    render: (text, record, index) => (
                        <span onClick={() => this.onSelectedRow(index)}>
                            {
                                this.strConcat(record)
                            }
                        </span>
                    ),
                },
                {
                    title: '合计',
                    // key: 'calc',
                    width: '25%',
                    render: (text, record) => (
                        <span>
                            {
                                this.calcCash(record)
                            }
                            元
                        </span>
                    ),
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record, index)=> (
                        <a style={{display: 'block', lineHeight: 2}} onClick={(e) => {e.stopPropagation();this.onDelete(index)}}>
                            <i className="iconfont icon-shanchu" />
                        </a>
                    ),
                },
            ]

        };
    }

    rowClassName = (record, index) => {
        if(this.props.order.dataList[0].length === 0) {
           index++
        }
        return index === this.props.order.orderIndex ? 'row_dismiss' : 'row_show'
    }

    //拼接商品订单字符串
    strConcat(datas){
        let str = ''
        datas.forEach((item, index) => {
            index === datas.length - 1 ? str += item.name : str += item.name + ','
        })
        return str
    }

    //计算订单总价
    calcCash(datas){
        let sum = 0
        datas.forEach((item, index) => {
            sum += (item.posprice - item.discount_fee) * item.num
        })
        return sum.toFixed(2)
    }

    onDelete(delIndex) {
        console.log('删除', delIndex)
        // this.state.dataList.splice(delIndex,1)
        this.props.dispatch(clearOrderList(delIndex + (this.props.order.dataList[0].length === 0 ? 1 : 0)))
    }

    onSelectedRow(index) {
        console.log('选中')
        index = index + (this.props.order.dataList[0].length === 0 ? 1 : 0)
        this.props.dispatch(replaceOrderList(index))
        console.log(resetMember(this.props.order.members[index - 1]))
        this.props.dispatch(resetMember(this.props.order.members[index - 1]))
        this.props.onClick('currentOrder')
    }

    //把挂单改变成订单  传递orderIndex
    render() {
        let { dataList } = this.props.order
        dataList = dataList.slice()
        const i = dataList.findIndex(item => item.length === 0)
        i !== -1&&dataList.splice(i, 1)
        dataList.forEach((item, index) => {
            item['key'] = index
        })
        return (
            <Table 
                columns={this.state.columns} 
                dataSource={dataList}
                rowClassName={this.rowClassName}
            />
        )
    }
}

export default connect()(SiderRightBodyList)
