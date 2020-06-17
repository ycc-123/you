
import React from 'react'
import { Card, Icon, } from 'antd'

export default (props) => {
	return (
		<div className={`goods-cell-container ${props.selectOne === props.index ? 'animated' : '' } ${props.selectOne === props.index ? 'shake' : '' }`} >
            <Card 
	            bordered={false}
	            onClick={() => props.onSelected(props.item, props.index)}
            >
                <Icon
                    type="minus-circle"
                    style={{
                        position: "absolute",
                        right: "12px",
                        top: "12px",
                        fontSize: "20px",
                        color: 'rgb(253,116,56)',
                    }}
                />
                <div className="clear y-center">
                    <div className="pull-left mr-m">
                    { props.item.albumpath ? <img src={props.item.albumpath} alt="img" width="50" /> : null}
                    </div>
                    <div className="clear" style={{fontSize: props.setting.fontSize,}}>

                        <div className="text-muted">{props.item.name}</div>
                        <span className="row">成本：<h3>{props.item.posprice}元/{props.item.unitname}</h3></span>
                    </div>
                </div>
            </Card>
            <span>库存数量：{props.item.stock}</span>
        </div>
	)
}