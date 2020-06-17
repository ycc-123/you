/**
 * file 调价单商品
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Spin} from 'antd'
import HeaderCustom from '@/components/HeaderCustom'
import Title from '@/widget/TitleSort'
import './index.less'

import SiderRightCustom from './SiderRightCustom'
import FooterCustom from './FooterCustom'
import SiderCustom from '@/components/SiderCustom'
import Verify from '@/widget/PrivilegeVerifier'

import Routes from '@/routes'
import Search from '@/components/Search'
const { Content, Sider} = Layout

const mapStateToProps = ( state, ownProps )=>({
    authority: state.authority,
})

class index extends Component {

	constructor(props) {
		super(props);

		this.state = {
			collapsed: false
		};
	}

	toggle() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

	render() {
		return (
            <Spin
                spinning={false}
                wrapperClassName="app-spin"
            >
                { !this.props.authority.data || this.props.authority.data.status == 2 ? <Verify/> : null }
                <Layout style={{overflow: 'hidden', height: '100%'}}>
                    <HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed} />
                    <Layout>
                        <Sider className="app-sider" width="inherit">
                            <SiderCustom />
                        </Sider>
                        <Content className="app-content" style={{backgroundColor: 'rgb(200, 200, 200)'}}>
                            <Search />
                            <Routes />
                        </Content>
                        <Sider className="app-sider" width={360}>
                            <Title title="商品调价"/>
                            <SiderRightCustom />
                        </Sider>
                    </Layout>
                    <FooterCustom />
                </Layout>
            </Spin>
		);
	}
}

export default connect(mapStateToProps, null)(index)