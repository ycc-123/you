/**
 * file 选择退款原因
 */

import React from 'react'
import {Select} from 'antd'

const Option = Select.Option
const REASON = ['请选择退款原因', '不想买了', '破损、污渍', '质量问题', '顶期', '其他']

export default ({onChange, onClick}) => {
  return (
    <Select defaultValue="请选择退款原因" size="large" onChange={onChange}>
      {
        REASON.map((item, index) => <Option value={item} key={index}>{item}</Option>)
      }
    </Select>
  )
}