/**
 * file 门店信息
 */

import React from 'react'
import {Form, Input, Select} from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 6},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
}
const Option = Select.Option

const TYPE = [
  {title: '中科英泰', 'type': 'ZHONGKEYINTAI'},
  {title: '托利多', 'type': 'TUOLIDUO'},
  {title: '大华', 'type': 'DAHUA'},
  {title: '建宇', 'type': 'JIANYU'},
  {title: '顶尖', 'type': 'DINGJIAN'},
  {title: "爱宝", 'type': 'AIBAO'},
  {title: "火蝶", 'type': 'HUODIE'},
]

const GORGE = [
  {title: 'COM1', type: 'COM1'},
  {title: 'COM2', type: 'COM2'},
  {title: 'COM3', type: 'COM3'},
  {title: 'COM4', type: 'COM4'},
]

const PRINTERTYPE = [
  {title: '58热敏建宇', type: '58REMIN'},
  {title: '58热敏顶尖', type: '58REMIN2'},
]

export default ({info, onChange}) => (
  <div>
    <FormItem
      {...formItemLayout}
      label="店铺名称"
    >
      <Input
        size={'large'}
        defaultValue={info.name}
        style={{width: '100%'}}
        readOnly
        disabled
      />
    </FormItem>
    <FormItem
      {...formItemLayout}
      label="店铺地址"
    >
      <Input
        size={'large'}
        defaultValue={info.address}
        style={{width: '100%'}}
        readOnly
        disabled
      />
    </FormItem>
    <FormItem
      {...formItemLayout}
      label="联系电话"
    >
      <Input
        size={'large'}
        defaultValue={info.phone}
        style={{width: '100%'}}
        readOnly
        disabled
      />
    </FormItem>
    <FormItem
      {...formItemLayout}
      label="称重机类型"
    >
      <Select defaultValue={info.weight} size="large" onChange={(value)=>onChange(value, "weightinfo")} style={{width: '100%'}}>
        {
          TYPE.map((item, index) => <Option value={item.type} key={index}>{item.title}</Option>)
        }
      </Select>
    </FormItem>
    <FormItem
      {...formItemLayout}
      label="称重机串口"
    >
      <Select defaultValue={info.gorge} size="large" onChange={(value)=>onChange(value, "gorge")} style={{width: '100%'}}>
        {
          GORGE.map((item, index) => <Option value={item.type} key={index}>{item.title}</Option>)
        }
      </Select>
    </FormItem>
    <FormItem
      {...formItemLayout}
      label="打印机类型"
    >
      <Select defaultValue={info.printerType} size="large" onChange={(value)=>onChange(value, "printerType")} style={{width: '100%'}}>
        {
          PRINTERTYPE.map((item, index) => <Option value={item.type} key={index}>{item.title}</Option>)
        }
      </Select>
    </FormItem>
  </div>
)

