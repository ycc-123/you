import React, { Component } from 'react'
import { Spin, Layout } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SiderRightFooter from './SiderRightFooter'
import SiderRightFootermember from './SiderRightFootermember'
import SiderRightHeader from './SiderRightHeader'
import SiderRightBody from './SiderRightBody'
import SiderRightBodyList from './SiderRightBodyList'
import './index.less'
// import { menus } from '../../constants/menus';

const { Footer, Content, Header } = Layout

const mapStateToProps = (state, ownProps) => ({
  order: state.order,
  member: state.member,
  setting: state.setting
})

class SiderRightCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      member_information: true,
      selectedName: 'currentOrder',
      showsettings:false
    };
  }

  MakeMoney(){
    this.setState({
      showsettings: true
    },()=>{
      console.log(this.state.showsettings)
    })
    
  }
  onHandleClick(key) {
    this.setState({
      selectedName: key
    })
  }

  render() {
    let { order, member } = this.props
    return (
      <Spin spinning={false} wrapperClassName="app-spin">
        <Layout className="container" style={{ 'fontSize': '30px' }}>
          <Header className="header" style={{ height: 'auto' }}>
            <SiderRightHeader
              onClick={this.onHandleClick.bind(this)}
              selectedName={this.state.selectedName}
              order={this.props.order}
              member={this.props.member}
            />
          </Header>
          <Content className="app-content">
            {
              this.state.selectedName === 'currentOrder' ?
                <SiderRightBody
                  member={member.data}
                  dataList={(order.dataList[order.orderIndex] && order.dataList[order.orderIndex].slice()) || []}
                  orderIndex={this.props.order.orderIndex}
                  setting={this.props.setting}
                />
                :
                <SiderRightBodyList
                  order={order}
                  onClick={this.onHandleClick.bind(this)}
                  member={this.props.member}
                />

            }
          </Content>
          <Footer className="app-footer">
            {
              member.data ?
                <SiderRightFootermember MakeMoney={this.MakeMoney.bind(this)}/>
                :
                <SiderRightFooter showsettings={this.state.showsettings}/>
            }
          </Footer>
        </Layout>
      </Spin>
    )
  }
}

export default withRouter(connect(mapStateToProps)(SiderRightCustom));