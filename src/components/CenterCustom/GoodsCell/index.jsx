import React from 'react'
import { Card } from 'antd'
import './index.less'


export default (props) => {
  let { setting: { rowsnum }, localtion } = props
  let val = null
  let bool1203 = (props.member.data && props.item.is_memberprice == 2) || (localtion && localtion.includes('priceadjustment') && props.item.is_memberprice == 2)
  switch (rowsnum) {
    case 8:
    case 12:
    case 16:
      val = '25%'
      break
    case 20:
      val = '20%'
      break
    case 24:
      val = '16.6%'
      break
    default:
      break
  }
  return (
    <li
      style={{
        flex: '0 1',
        minWidth: props.onTouchStart ? val : null,
      }}
      onTouchStart={props.onTouchStart ? props.onTouchStart : null}
      onTouchEnd={props.onTouchEnd ? props.onTouchEnd : null}
      data-index={props.index}
      className={
        `goods-cell-container ${props.setting.columnNum === 2 ? 'columno' : ''} ${props.setting.columnNum === 3 ? 'columnt' : ''} ${props.setting.columnNum === 4 ? 'columnth' : ''} ${props.selectOne === props.index ? 'animated' : ''} ${props.selectOne === props.index ? 'shake' : ''}`
      }
    >
      <Card
        bordered={false}
        onClick={() => props.onSelected(props.item, props.index)}
        style={{ backgroundColor: props.setting.goodbackground, fontWeight: props.setting.isblod ? '1000' : '300' }}
        className={`${props.setting.isshowgimg ? '' : 'smallheight'}`}
      >
        <div className={`clear y-center ${props.setting.isshowgimg ? '' : 'smalltop'}`}>
          <div className="pull-left mr-m">
            {props.item.albumpath && props.setting.isshowgimg ?
              <img src={props.item.albumpath} alt="img" width="50" /> : null}
          </div>
          <div className="clear" style={{ fontSize: props.setting.fontSize }}>
          {/* className={`text-muted ${props.setting.isshowgimg ? '' : 'zm'}`} */}
            <div>{props.item.name}</div>
            {/* className={`${props.setting.isshowgimg ? '' : 'h3'}`} */}
            <h3>{props.item.posprice}元/{props.item.changeunitname}</h3>
            {
              bool1203
                ? <div
                  style={{
                    color: 'red',
                    fontStyle: 'italic',
                    marginTop: '-8px',
                  }}
                >
                  {props.item.barcode[0].memberprice}元/{props.item.changeunitname}
                </div>
                : null
            }
          </div>
        </div>
        {
          props.onTouchStart ? <div
            className='rank'
            onClick={(e) => props.changerank(props.rank, e)}
          >
            {props.rank}
          </div> : null
        }
      </Card>
      {
        props.setting.showStock ? (
          <div>
            <span>分库存: {props.item.stock}</span>
            <br />
            {
              typeof props.item.stock_all === 'undefined' ? null : <span>总库存: {props.item.stock_all}</span>
            }
          </div>
        ) : null
      }
    </li>
  )
}