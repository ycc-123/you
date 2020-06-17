/**
 * file数字键盘
 */

import React, { Component } from 'react'
import { Button, Icon } from 'antd'

import './index.less'

const ButtonGroup = Button.Group

const keys = ['1', '2', '3', '10', '4', '5', '6', '20', '7', '8', '9', '50', '清除', '0', '.', '100']
const alphabet = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '←', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '确定', '小写', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '清除']
const Ualphabet = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '←', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '确定', '大写', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '清除']


/**
 * [虚拟键盘组件]
 * @param  {[type]} Num [Num 为true则显示数字键盘，不显示字母键盘]
 */
class NumericKeypad extends Component {
    state = {
        layout: false,
        Caps: false,
        ison: true
    }

    onhandleClick = item => {
        if (item === '小写' || item === '大写') {
            this.setState({ Caps: !this.state.Caps })
            return
        }
        this.props.onClick(item)
    }

    render() {
        return (
            <div className={`keypad_container ${this.props.className}`}>
                {
                    this.props.layout && this.state.ison ? (
                        <ButtonGroup style={{ width: '726px', textAlign: 'left' }}>
                            {
                                (this.state.Caps ? alphabet : Ualphabet).map((item, index) =>
                                    <Button
                                        key={index}
                                        size="large"
                                        className="key_item"
                                        onClick={() => this.onhandleClick(item)}
                                        style={{ width: item === '确定' ? '132px' : '66px', height: '66px', borderRadius: 0, }}
                                    >
                                        {item}
                                    </Button>)
                            }
                        </ButtonGroup>
                    ) : (this.state.layout ?
                        <ButtonGroup style={{ width: '726px', textAlign: 'center' }}>
                            {
                                (this.state.Caps ? alphabet : Ualphabet).map((item, index) =>
                                    <Button
                                        key={index}
                                        size="large"
                                        className="key_item"
                                        onClick={() => this.onhandleClick(item)}
                                        style={{ width: item === '确定' ? '132px' : '66px', height: '66px', borderRadius: 0, }}
                                    >
                                        {item}
                                    </Button>)
                            }
                        </ButtonGroup> :
                        <div className="row">
                            <ButtonGroup style={{ width: '264px' }}>
                                {
                                    keys.map((item, index) =>
                                        <Button
                                            key={index}
                                            size="large"
                                            className="key_item"
                                            onClick={() => this.props.onClick(item)}
                                            style={{ width: '66px', height: '66px', borderRadius: 0 }}
                                        >
                                            {item}
                                        </Button>)
                                }
                            </ButtonGroup>
                            {
                                this.props.bordWidth ?
                                    <div className="container_right">
                                        <Button
                                            size="large"
                                            style={{ width: '100px', height: '66px' }}
                                            onClick={() => this.props.onClick('退格')}
                                        >←</Button>
                                        <Button
                                            size="large"
                                            style={{ width: '100px', height: '198px' }}
                                            onClick={() => this.props.onClick('确定')}
                                        >确定</Button>
                                    </div>
                                    :
                                    <div className="container_right">
                                        <Button
                                            size="large"
                                            style={{ width: '66px', height: '66px' }}
                                            onClick={() => this.props.onClick('退格')}
                                        >←</Button>
                                        <Button
                                            size="large"
                                            style={{ width: '66px', height: '198px' }}
                                            onClick={() => this.props.onClick('确定')}
                                        >确定</Button>
                                    </div>
                            }
                        </div>
                        )
                }
                {
                    this.props.letter && <div onClick={() => {
                        if (this.props.layout) {
                            this.setState({
                                ison: !this.state.ison
                            })
                        } else {
                            this.setState({ layout: !this.state.layout })
                        }
                    }
                    } style={{ marginLeft: 10, borderWidth: 1, borderStyle: 'solid', borderColor: '#ccc', height: 100, lineHeight: '100px' }}>
                        <Icon type={this.state.layout ? 'right' : 'left'} />
                    </div>
                }
            </div>
        )
    }
}

export const onVirtualKeyboard = (value, str, success) => {
    //判断点击的是否是数字键
    if (!isNaN(Number(value))) {
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

/**
* [格式化输入金额]
*/
export const fat_num = (val) => {
    val = val.replace(/[^0-9.]/g, '')
    if (val.split(/\./g).length > 2) {
        val = val.split(/\./g)
        val = `${val[0]}.${val.splice(1).join('')}`
    }
    return val
}

export default NumericKeypad