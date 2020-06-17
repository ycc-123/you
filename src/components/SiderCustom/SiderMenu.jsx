import React from 'react'
import { Menu, Icon } from 'antd'

const renderMenuItem = ({ id, name, icon, ...props }, categoryColor) => (
	<Menu.Item
		// selectable={false}
		key={id}
		style={{ backgroundColor: `${categoryColor[props.level - 1] || '#fff'}` }}
		{...props}
	// eslint-disable-next-line
	>
		{icon && <Icon type={icon} />}
		{name}
	</Menu.Item>
)

const renderSubMenu = ({ id, name, icon, children, ...props }, onSubMenuClick, categoryColor) => (
	<Menu.SubMenu
		// selectable={false}
		key={id}
		style={{ backgroundColor: `${categoryColor[props.level - 1] || '#fff'}` }}
		title={
			<span>
				{icon && <Icon type={icon} />}
				{name}
			</span>
		}
		onTitleClick={onSubMenuClick}
		// eslint-disable-next-line
		{...props}>
		{children && children.map(
			item => item.children && item.children.length ?
				renderSubMenu(item, onSubMenuClick, categoryColor) : renderMenuItem(item, categoryColor))}
	</Menu.SubMenu>
)


export default ({ menus, onSubMenuClick, categoryColor, ...props }) => {
	return (
		<Menu {...props}>
			{
				menus && menus.map(
					item => item.children && item.children.length ?
						renderSubMenu(item, onSubMenuClick, categoryColor) : renderMenuItem(item, categoryColor)
				)
			}
		</Menu>
	)
}
