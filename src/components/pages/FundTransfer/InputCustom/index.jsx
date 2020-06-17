import React, {Component, createRef} from 'react';
import {Input, Modal, Table} from 'antd';
import PropTypes from 'prop-types';
import {getWarehouse} from '@/api'
import connect from "react-redux/es/connect/connect";
import styles from './index.module.less'

const mapStateToProps = (state, ownProps) => ({
  store: state.store
})

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      iptValue: '',
      visible: false,
      getWarehouse: ''
    }

    this.inputRef = createRef()
  }

  componentDidMount() {
    // let {hasvalue,store:{data:{id}}} = this.props
    let {store: {data: {id}}} = this.props
    // if(hasvalue){
    //     getWarehouse().then(({data:{data}})=>{
    //         data = data.filter(item=>{
    //             return +item.store_id === +id
    //         })
    //         this.setState({
    //             iptValue: data[0].name
    //         })
    //     })
    // }
    getWarehouse().then(({data: {data}}) => {
      data = data.filter(item => {
        return +item.store_id === +id
      })
      let obj = window.sessionStorage.getItem('thelibrary_warehouse')
      if (obj) {
        obj = JSON.parse(obj)
        obj.warehouse_out = data[0].id
      } else {
        obj = {warehouse_out: data[0].id}
      }
      window.sessionStorage.setItem('thelibrary_warehouse', JSON.stringify(obj))
    })

    let initOoObj = window.sessionStorage.getItem('thelibrary_warehouse')
    initOoObj ? initOoObj = JSON.parse(initOoObj) : initOoObj = false
    if (initOoObj && initOoObj.warehouse_in && initOoObj.name) {
      this.setState({
        iptValue: initOoObj.name
      })
    }
  }

  acquireName = () => {
    this.setState({
      visible: true
    })
    this.getWarehouse()
  }

  handleOk = () => {
    this.setState({
      visible: false,
    });
    setTimeout(() => {
      this.inputRef.current.blur()
    }, 0)
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
    setTimeout(() => {
      this.inputRef.current.blur()
    }, 0)
  }

  showTable = () => {
    let {getWarehouse} = this.state

    const columns = [

      {title: 'id', dataIndex: 'id', key: 'id'},
      {title: 'name', dataIndex: 'name', key: 'name'},

      {
        title: '选择',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: () => <a href="javascript:;" onSelect={(changeableRowKeys) => {
        }}>选择</a>,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={getWarehouse}
        onRow={(record, index) => {
          return {
            onClick: () => {
              this.setState({
                visible: false,
                iptValue: record.name
              })

              let obj = window.sessionStorage.getItem('thelibrary_warehouse')
              if (obj) {
                obj = JSON.parse(obj)
                obj.warehouse_in = record.id
                obj.name = record.name
              } else {
                obj = {warehouse_in: record.id, name: record.name}
              }
              window.sessionStorage.setItem('thelibrary_warehouse', JSON.stringify(obj))

              setTimeout(() => {
                this.inputRef.current.blur()
              }, 0)
            }
          }
        }}
      />
    )
  }

  //api
  getWarehouse() {
    getWarehouse().then(({data}) => {
      let q = JSON.parse(sessionStorage.getItem("thelibrary_warehouse")).warehouse_out
      data = data.data.filter(item => {
        return item.id !== q
      })
      this.setState({
        getWarehouse: data
      })
    })
  }

  render() {
    let {title, disabled, hasvalue} = this.props
    let {iptValue, visible} = this.state
    let {acquireName, handleOk, handleCancel, inputRef, showTable} = this

    return (
      <div className={styles.box}>
        <div className={styles.text}>
          {title}:
        </div>
        <Input
          size="default"
          ref={inputRef}
          style={{fontSize: '18px', textAlign: 'center'}}
          disabled={disabled}
          value={iptValue}
          onClick={acquireName}
        />
        <Modal
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          title='请选择转入仓库'
        >
          {showTable()}
        </Modal>
      </div>
    )
  }
}

index.defaultProps = {
  disabled: false
}

index.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  hasvalue: PropTypes.bool
}

export default connect(mapStateToProps, {})(index)