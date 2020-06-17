/**
 * file 商品报损
 */
import React, {Component} from 'react'
import {Table, Input} from 'antd'
import {connect} from 'react-redux'

import {WithModal} from '@/widget'
import NumericKeypad, {onVirtualKeyboard} from '@/widget/NumericKeypad'
import {removeFromFundTransferList, updateFromFundTransferList} from '@/action'

const mapStateToProps = (state, ownProps) => ({
  fundTransfer: state.fundTransfer,
})

class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      num: 0,
      costprice: 0,
      columns: [{
        title: '#',
        dataIndex: 'key',
        key: 'key',
        width: '10%',
      }, {
        title: '商品',
        width: '20%',
        key: 'name',
        render: (text, recode) => (

          <span>
						<span>{recode.name}</span>
						<br/>
						<span>{recode.specname}</span>
					</span>

        )
      }, {
        title: '单位',
        width: '20%',
        dataIndex: 'unit_name',
        key: 'unit_name',
      }, {
        title: '单价',
        key: 'posprice',
        width: '15%',
        render: (text, recode) => (
          <span>
						{recode.posprice}
					</span>
        )
      }, {
        title: '数量',
        key: 'num',
        width: '20%',
        render: (text, recode) => {
          return (
            <span onClick={() => this.onEidtNum(recode)}>
						{recode.num}
					</span>
          )
        }
      }, {
        title: '小计',
        key: 'total',
        width: '20%',
        render: (text, recode) => {
          return (
            <span>
						  {(+recode.num*(+recode.posprice)).toFixed(2)}
					  </span>
          )
        }
      }, {
        title: '操作',
        key: 'action',
        render: (text, recode) => (
          <span>
						<a style={{display: 'block', lineHeight: 2}} onClick={(e) => {
              e.stopPropagation();
              this.onDelete(recode)
            }}>
							<i className="iconfont icon-shanchu"/>
						</a>
					</span>
        ),
      }]
    };
  }

  onEditCostPirce = item => {
    item = {...item}
    const editInput = value => {
      let output = onVirtualKeyboard(value, this.state.costprice, () => {
        item.costprice = Number(this.state.costprice)
        this.props.updateFromFundTransferList(item)
        this.withmodal.colse()
      })

      this.setState({
        costprice: output
      })
    }
    const render = () => (
      <div>
        <Input
          ref={ref => this.newposproiceinput = ref}
          size="large"
          style={{marginBottom: 20}}
          defaultValue={item.costprice}
          onChange={e => this.setState({costprice: e.target.value})}
          value={this.state.costprice}
        />
        <NumericKeypad onClick={editInput}/>
      </div>
    )
    this.withmodal.show({title: '库存成本', content: render})
  }

  onDelete = item => {
    this.props.removeFromFundTransferList(item)
  }

  onEidtNum(item) {
    item = {...item}
    const editInput = value => {
      let output = onVirtualKeyboard(value, this.state.num, () => {
        item.num = Number(this.state.num)
        this.props.updateFromFundTransferList(item)
        this.withmodal.colse()
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
          defaultValue={item.num}
          onChange={e => this.setState({num: e.target.value})}
          value={this.state.num}
        />
        <NumericKeypad onClick={editInput}/>
      </div>
    )
    // const focus = () => this.newposproiceinput.focus()
    this.withmodal.show({
      title: '调拨数量',
      content: render,
    }).then(res => {
      // focus()
    })

  }

  render() {
    this.props.fundTransfer.list.forEach((item, index) => {
      item['key'] = index + 1;
    })
    return (
      <div className="silder-right-body app-sider">
        <Table
          defaultExpandAllRows
          columns={this.state.columns}
          dataSource={this.props.fundTransfer.list}
          rowClassName="order-table"
          style={{marginBottom: '40px'}}
        />
        <WithModal footer={null} ref={(ref) => this.withmodal = ref}/>
      </div>
    );
  }
}

export default connect(mapStateToProps, {removeFromFundTransferList, updateFromFundTransferList})(index)