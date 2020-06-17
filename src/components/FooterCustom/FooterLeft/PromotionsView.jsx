/**
 * file  促销活动 满减
 */
import React from 'react'
import { Table, Divider, Tag } from 'antd'

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '满',
        dataIndex: 'full',
        key: 'full',
    },
    {
        title: '减',
        dataIndex: 'sub',
        key: 'sub',
    }
]

const rules = [
    {
        title: '会员等级',
        key: 'name',
        render: (text, recode) => (
            <span>
                {recode.level.name}
            </span>
        )
    },
    {
        title: '原权益',
        key: 'rights',
        render: (text, recode) => (
            <span>
                {recode.level.rights}
            </span>
        )
    },
     {
        title: '现权益',
        dataIndex: 'value',
        key: 'value',
    }
]

export default ({info}) => (
    <div>
        <Divider>满减规则</Divider>
        <Table
            rowKey="id"
            columns={columns}
            dataSource={info.msg}
            pagination={false}
        />
        <Divider>会员变动</Divider>
        <Table
            rowKey="value"
            columns={rules}
            dataSource={info.data}
            pagination={false}
        />
        <div style={{paddingTop: 10}}>注：在促销日变动的会员权益，会用<Tag color="#f50" style={{paddingHorizontal: 4}}>促</Tag>标记</div>
    </div>
)
