import React, {Component, Fragment,} from 'react'
import {Modal, Cascader, Radio, Select, notification,} from 'antd';
import {deriveUnit, getcategory,} from '@/api'
import styles from './append.module.less'
import connect from "react-redux/es/connect/connect";
// import makePy from './Initial'

const mapStateToProps = (state, ownProps) => ({
  store: state.store
})
const {Option} = Select

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      map_text: [
        {
          text: "商品编码",
          value: "",
        },
        {
          text: "国际条形码",
          value: "",
        },
        {
          text: "商品名称",
          value: "",
        },
        {
          text: "零售价",//3 =》2
          value: "",
        },
        {
          text: "会员价",//4 =》 3
          value: "",
        },
        {
          text: "首字母搜索",//2 =》 4
          value: "",
        },
      ],
      map_sort: [],
      map_unit: [],
      map_radio: [
        {
          index: 1,
          value: "否",
        },
        {
          index: 2,
          value: "是",
        },
      ],
      value_sort: '',
      value_unit: '',
      value_rate: 1,
      value_dis: 1,
      value_guide: 1,
    }

  }

  componentDidMount() {
    let {data:{uniacid},} = this.props.store,
      {map_text,} = this.state
    deriveUnit({uniacid})
      .then(({data:{data}})=>{
        this.setState({
          map_unit: data,
        })
      })
    getcategory()
      .then(({data})=>{
        this.setState({
          map_sort: data
        })
      })

    map_text[0].value = new Date().valueOf()
    this.setState({
      map_text
    })
  }

  /**
   * 在按钮输入值时触发
   * @param value
   * @param index
   */
  onChange_input_value = (e, index,) => {
    let {map_text,} = this.state
    let text = map_text[index].text
    map_text[index].value = e.target.value
    if (text === "首字母搜索") {
      // map_text[index].value = String(map_text[index].value).match(/[A-Za-z]{0,}\'{0,1}[A-Za-z]{0,}/) ? String(map_text[index].value).match(/[A-Za-z]{0,}/)[0] : map_text[index].value
    } else if (text === "零售价" || text === "会员价" || text === "国际条形码") {
      map_text[index].value = String(map_text[index].value).match(/\d{0,}\.{0,1}\d{0,2}/) ? String(map_text[index].value).match(/\d{0,}\.{0,1}\d{0,2}/)[0] : map_text[index].value
    }
    // else if (index == 1 && map_text[index].value.match(/[\u4E00-\u9FA5a-zA-Z]{0,}/g)) {
    //   let q = map_text[index].value.match(/[\u4E00-\u9FA5a-zA-Z]{0,}/g).join('')
    //   map_text[4].value = makePy(q.toUpperCase())[0]
    // }
    this.setState({
      map_text
    })
  }

  /**
   * 选择分类时触发
   * @param value
   */
  onsortChange = (value,selectedOptions) => {
    var date = new Date();
    this.setState({
      value_sort: value ? value[value.length-1] : '',
    })
  }

  /**
   * 选择库存单位时触发
   * @param value
   */
  handleunitChange = (value) => {
    this.setState({
      value_unit: value,
    })
  }

  /**
   * 会员价单选按钮
   * @param e
   */
  onChangeRate = (e) => {
    if(this.state.value_dis == 2 && e.target.value == 2){
      notification.warning({
        message: '提示',
        description: '会员权益和会员价不能同时开启',
      })
      return
    }
    this.setState({
      value_rate: e.target.value,
    });
  };

  /**
   * 会员折扣单选按钮
   * @param e
   */
  onChangedis = (e) => {
    var date = new Date();
    if(this.state.value_rate == 2 && e.target.value == 2){
      notification.warning({
        message: '提示',
        description: '会员权益和会员价不能同时开启',
      })
      return
    }
    this.setState({
      value_dis: e.target.value,
    });
  }
  /**
   * 导购权益单选按钮
   */
  onChangeguide = (e) => {
    this.setState({
      value_guide: e.target.value,
    });
  }

  render() {
    let {off_append, itemaddsubmit, store} = this.props,
      {
        map_text,
        map_sort,
        map_unit,
        map_radio,
        value_rate,
        value_sort,
        value_unit,
        value_dis,
        value_guide,
      } = this.state,
      {
        onChange_input_value,
        onsortChange,
        handleunitChange,
        onChangeRate,
        onChangedis,
        onChangeguide,
      } = this

    return (
      <Fragment>
        <Modal
          keyboard={false}
          title="新增商品"
          width={600}
          visible={true}
          maskClosable={false}
          onCancel={off_append}
          onOk={() => itemaddsubmit(
            map_text,
            value_sort,
            value_unit,
            value_rate,
            value_dis,
            value_guide,
            store.data.id,
            store.data.uniacid,
          )}
        >
          <div
            className={styles.box}
          >
            <div
              style={{
                width: '100%',
                padding: "20px 10px",
                whiteSpace: "nowrap",
              }}
            >
              分类：
              <Cascader
                options={map_sort}
                fieldNames={{
                  label: 'name',
                  value: 'id',
                  children: 'children',
                }}
                style={{
                  width: '400px'
                }}
                onChange={onsortChange}
                placeholder="请选择分类"
                expandTrigger="hover"
              />
            </div>
            {/*6个按钮输入框*/}
            {
              map_text.map((item, index) => {
                return (
                  <div
                    className={styles.input}
                    key={index}
                  >
                    <div className={styles.text}>
                      {item.text}：
                    </div>
                    <input
                      disabled={item.text === "会员价" && this.state.value_rate == 1}
                      style={{
                        background: item.text === "会员价" && this.state.value_rate == 1 ? "#00000014" : null,
                      }}
                      type="text"
                      className={styles.conter}
                      value={item.value}
                      onChange={(e) => onChange_input_value(e, index)}
                    />
                  </div>
                )
              })
            }
            <div className={styles.selection}>
              <div
                className={styles.item}
              >
                库存单位：
                <Select
                  placeholder="请选择单位"
                  style={{
                    width: 120,
                  }}
                  onChange={handleunitChange}
                >
                  {
                    map_unit && map_unit.map((item, index) => (
                      <Option value={item.id} key={index}>{item.name}</Option>
                    ))
                  }
                </Select>
              </div>

            </div>
            <div className={styles.radio}>
              <Radio.Group
                onChange={onChangeRate}
                value={value_rate}
                className={styles.item}
              >
                启用会员价：{
                map_radio.map((item, index) => (
                  <Radio value={item.index} key={index}>{item.value}</Radio>
                ))
              }
              </Radio.Group>
              <Radio.Group
                onChange={onChangedis}
                value={value_dis}
                className={styles.item}
              >
                启用会员权益：{
                map_radio.map((item, index) => (
                  <Radio value={item.index} key={index}>{item.value}</Radio>
                ))
              }
              </Radio.Group>
              <Radio.Group
                onChange={onChangeguide}
                value={value_guide}
                className={styles.item}
              >
                启用导购权益：{
                map_radio.map((item, index) => (
                  <Radio value={item.index} key={index}>{item.value}</Radio>
                ))
              }
              </Radio.Group>
            </div>
          </div>
        </Modal>
      </Fragment>
    )
  }
}

export default connect(mapStateToProps, {})(index)
