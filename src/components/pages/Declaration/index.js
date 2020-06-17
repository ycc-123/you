/**
 * file 商品报单
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Spin} from 'antd'
import HeaderCustom from '@/components/HeaderCustom'
import FooterCustom from './FooterCustom'
import SiderCustom from './SiderCustom'

import { getStockGoods } from '@/action'
import Routes from '@/routes'
import Search from '@/components/Search'
const { Content, Sider} = Layout

class index extends Component {

	constructor(props) {
		super(props);

		this.state = {
			collapsed: false
		};
	}

	componentDidMount() {
		this.props.getStockGoods({page: 1, pagesize: 16}).then(res => {
			console.log(res)
		})
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
                <Layout style={{overflow: 'hidden', height: '100%'}}>
                    <HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed} />
                    <Layout>
                        <Sider className="app-sider" width={360}>
                            <SiderCustom />
                        </Sider>
                        <Content className="app-content" style={{backgroundColor: 'rgb(200, 200, 200)'}}>
                            <Search />
                            <Routes />
                        </Content>
                    </Layout>
                    <FooterCustom />
                </Layout>
            </Spin>
		);
	}
}

export default connect(null, { getStockGoods })(index)
