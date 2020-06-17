/**
 * file 商品报损
 */
import React, { Component } from 'react'
import { Table, Input } from 'antd'
import { connect } from 'react-redux'

import { WithModal } from '@/widget'
import NumericKeypad from '@/widget/NumericKeypad'
import { removeFromPURCHASEList, updateFromPURCHASEList } from '@/action'

const mapStateToProps = (state, ownProps) => ({
  purchase: state.purchase,
})

class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_first: false,
      visible: false,
      num: 0,
      posprice: 0,
      columns: [{
        title: '#',
        dataIndex: 'key',
        key: 'key',
        width: '10%',
      }, {
        title: '商品',
        width: '25%',
        key: 'name',
        render: (text, recode) => (

          <span>
            <span>{recode.name}</span>
            <br />
            <span>{recode.specname}</span>
          </span>

        )
      }, {
        title: '单位',
        width: '20%',
        dataIndex: 'unit_name',
        key: 'unit_name',
      },
      // {
      //   title: '进货价',
      //   key: 'posprice',
      //   width: '20%',
      //   render: (text, recode) => (
      //     <span onClick={e => {
      //       e.stopPropagation();
      //       this.setState({
      //         is_first: true,
      //       })
      //       this.onEditCostPirce(recode)
      //     }}>
      // 			{(+recode.posprice).toFixed(2)}
      // 		</span>
      //   )
      // },
      {
        title: '数量',
        key: 'num',
        width: '20%',
        render: (text, recode) => (
          <span onClick={() => {
            this.setState({
              is_first: true,
            })
            this.onEidtNum(recode)
          }}>
            {recode.num}
          </span>
        )
      }, {
        title: '操作',
        key: 'action',
        render: (text, recode) => (
          <span>
            <a style={{ display: 'block', lineHeight: 2 }} onClick={(e) => {
              e.stopPropagation();
              this.onDelete(recode)
            }}>
              <i className="iconfont icon-shanchu" />
            </a>
          </span>
        ),
      }]
    };
  }

  onVirtualKeyboard = (value, str, success) => {
    //判断点击的是否是数字键
    if (!isNaN(Number(value))) {
      if (this.state.is_first) {
        str = ''
        this.setState({
          is_first: false
        })
      }

      str = !str ? value : str + value
    } else {
      switch (value) {
        case '.':
          if (str.indexOf('.') === -1) {
            str = !str ? '0.' : str + '.'
          }
          break
        case '清除':
          str = ''
          break
        case '退格':
          str = str.substring(0, str.length - 1)
          break
        case '←':
          str = str.substring(0, str.length - 1)
          break
        case '确定':
          success()
          break
        default:
          str = str + value
      }
    }
    return str
  }

  onEditCostPirce = item => {
    item = { ...item }
    const editInput = value => {
      let output = this.onVirtualKeyboard(value, this.state.posprice, () => {
        item.posprice = Number(this.state.posprice)
        this.props.updateFromPURCHASEList(item)
        this.withmodal.colse()
      })

      this.setState({
        posprice: output
      })
    }
    const render = () => (
      <div>
        <Input
          ref={ref => this.newposproiceinput = ref}
          size="large"
          style={{ marginBottom: 20 }}
          defaultValue={item.posprice}
          onChange={e => this.setState({ posprice: e.target.value })}
          value={this.state.posprice}
        />
        <NumericKeypad onClick={editInput} />
      </div>
    )
    this.withmodal.show({ title: '更改进货价', content: render })
  }

  onDelete = item => {
    this.props.removeFromPURCHASEList(item)
  }

  onEidtNum = (item) => {
    item = { ...item }
    const editInput = value => {
      let output = this.onVirtualKeyboard(value, this.state.num, () => {
        item.num = Number(this.state.num)
        this.props.updateFromPURCHASEList(item)
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
          style={{ marginBottom: 20 }}
          defaultValue={item.num}
          onChange={e => this.setState({ num: e.target.value })}
          value={this.state.num}
        />
        <NumericKeypad onClick={editInput} />
      </div>
    )
    // const focus = () => this.newposproiceinput.focus()
    this.withmodal.show({
      title: '采购数量',
      content: render,
    }).then(res => {
      // focus()
    })

  }

  render() {
    this.props.purchase.list.forEach((item, index) => {
      item['key'] = index + 1;
    })
    return (
      <div className="silder-right-body app-sider">
        <Table
          defaultExpandAllRows
          columns={this.state.columns}
          dataSource={this.props.purchase.list}
          expandedRowRender={record => <p style={{ margin: 0 }}>{record.remark}</p>}
          rowClassName="order-table"
          style={{ marginBottom: '40px' }}
        />
        <WithModal footer={null} ref={(ref) => this.withmodal = ref} />
      </div>
    );
  }
}

export default connect(mapStateToProps, { removeFromPURCHASEList, updateFromPURCHASEList })(index)