
import React from 'react'
import { Card } from 'antd'

export default (props) => {
	return (
		<div className={`goods-cell-container ${props.selectOne === props.index ? 'animated' : '' } ${props.selectOne === props.index ? 'shake' : '' }`} >
            <Card 
	            bordered={false}
	            onClick={() => props.onSelected(props.item, props.index)}
            >
                <div className="clear y-center">
                    <div className="pull-left mr-m">
                    { props.item.albumpath ? <img src={props.item.albumpath} alt="img" width="50" /> : null}
                    </div>
                    <div className="clear" style={{fontSize: props.setting.fontSize}}>
                        <div className="text-muted">{props.item.name}</div>
                        <span className="row">成本：<h3>{props.item.costprice}元/{props.item.unit_name}</h3></span>
                    </div>
                </div>
            </Card>
            <span>库存数量：{props.item.gnum}</span>
        </div>
	)
}