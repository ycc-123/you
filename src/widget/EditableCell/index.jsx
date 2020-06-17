/**
 * file 可编辑的table单元格
 */
import React, { Component } from 'react'
import { Input, Icon } from 'antd'
import './index.less'

export default class EditableCell extends Component {
    state = {
        value: this.props.value,
        editable: false,
    }
    handleChange = (e) => {
        let value = e.target.value;
        value = Number(value) > this.props.num ? this.props.num : value
        this.setState({ value }, () => {
        });
    }
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    edit = () => {
        this.setState({ editable: true });
    }
    render() {
        const { editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    editable ? (
                        <Input
                            value={this.props.value}
                            onChange={(e)=>this.props.setValue(e.target.value, this.props.index)}
                            onPressEnter={this.check}
                            onFocus={this.props.onFocus(this.props.barcode)}
                            suffix={
                                <Icon
                                    type="check"
                                    className="editable-cell-icon-check"
                                    onClick={this.check}
                                />
                            }
                        />
                    ) : (
                            <div style={{ paddingRight: 24 }}>
                                {this.props.value}
                                <Icon
                                    type="edit"
                                    className="editable-cell-icon"
                                    onClick={this.edit}
                                />
                            </div>
                        )
                }
            </div>
        );
    }
}