/**
 * file 底部菜单选项组件
 */
import React from 'react'
import classNames from 'classnames'

export const FooterMenuItem = (props) => {
	return (
        <div className="footer-btn" onClick={props.onClick}>
            <i className={classNames('iconfont', {[`icon-${props.iconNmae}`]: true})} />
            <span>{props.title}</span>
        </div>
    );
}