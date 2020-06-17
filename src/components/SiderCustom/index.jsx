import React, { Component } from 'react'
import { Spin, Button, Layout } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getCategoryGoods, setSequence } from '@/api'
import { getCategory, getGoods, getoutGoods, changeSetting } from '@/action'
import SiderMenu from './SiderMenu'
import './index.less'
// import { menus } from '../../constants/menus'


// const { Sider } = Layout;
const mapStateToProps = (state, ownProps) => ({
  category: state.category,
  store: state.store,
  setting: state.setting,
  goods: state.goods,
})

let disable = false

class SiderCustom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menus: [],
      spinning: false,
      collapsed: false,
      mode: 'inline',
      openKey: '',
      selectedKey: '',
      firstHide: true,// 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    };

    this.controlClick = true
  }

  componentDidMount() {
    // console.log('测试测试 ' , this.props.collapsed);
    this.setMenuOpen(this.props);
    const { history } = this.props
    this.props.getCategory()
      .then(data =>
        this.setState({ menus: data }, async () => {
          if (data.length !== 0) {
            switch (this.isPriceAdjustment()) {
              case 'priceadjustment':
                var newPath = `/priceadjustment/${data[0].id}`
                break
              case 'app':
                var newPath = `/app/dashboard/${data[0].id}`
                break
              case 'reportdamage':
                var newPath = `/reportdamage/${data[0].id}`
                break
              case 'fundTransfer':
                var newPath = `/fundTransfer/${data[0].id}`
                break
              case 'purchase':
                var newPath = `/purchase/${data[0].id}`
                break
              case 'putaway':
                var newPath = `/putaway/${data[0].id}`
                this.props.getoutGoods({
                  uniacid: this.props.store.uniacid,
                  category: `${data[0].id}`,
                  store_id: this.props.store.data && this.props.store.data.id,
                  rows: this.props.setting.rowsnum
                }).then(res => {
                  history.replace(newPath)
                  this.setState({
                    activeMenu: data[0].id
                  })
                })
                return
              case 'soldout':
                var newPath = `/soldout/${data[0].id}`
                break
              default:
                break
            }
            if (newPath.includes('/app/dashboard/') && this.props.store.data && this.props.store.data.show_dragsort == 2) {
              try {
                let [{ category, total, search }, { data: { count, data: list } }] = await Promise.all([
                  this.props.getGoods({
                    category: `${data[0].id}`,
                    store_id: this.props.store.data && this.props.store.data.id,
                    rows: this.props.setting.rowsnum
                  }),
                  getCategoryGoods({ category_id: `${data[0].id}` })
                ])
                if (total != count && category) {
                  let { data: { status } } = await setSequence({
                    category_id: `${data[0].id}`,
                    list: list.map((item, i) => ({
                      sequence: i,
                      goods_id: item.id
                    }))
                  })
                  status == 1 ? await this.props.getGoods({
                    category: `${data[0].id}`,
                    store_id: this.props.store.data && this.props.store.data.id,
                    rows: this.props.setting.rowsnum
                  }) : null
                }

                history.replace(newPath)
                this.setState({
                  activeMenu: data[0].id
                })
              } catch (err) {

              }
            } else {
              this.props.getGoods({
                category: `${data[0].id}`,
                store_id: this.props.store.data && this.props.store.data.id,
                rows: this.props.setting.rowsnum
              }).then(res => {
                history.replace(newPath)

                this.setState({
                  activeMenu: data[0].id
                })
              })
            }

          }
        })
      )
      .catch(error => console.log(error))
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    // this.onCollapse(nextProps.collapsed);
    this.setMenuOpen(nextProps)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.category.data !== nextProps.category.data || this.state.menus !== nextState.menus || this.state.mode !== nextState.mode) {
      return true
    }
    return false
  }

  isPriceAdjustment = () => {
    const { history } = this.props
    return history.location.pathname.split('/')[1]
    // return history.location.pathname.split('/')[1] === 'priceadjustment'
  }

  setMenuOpen(props) {
    // console.log(props.location)
    const { pathname } = props.location;
    // console.log(pathname, )
    this.setState({
      openKey: pathname.substr(0, pathname.lastIndexOf('/')),
      selectedKey: pathname.substr(pathname.lastIndexOf('/') + 1)
    });
  }

  onCollapse = collapsed => {
    // console.log(collapsed);
    this.setState({
      collapsed,
      firstHide: collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  }

  stopFastClick = () => {
    this.timer = setTimeout(() => {
      disable = false
    }, 200)
  }

  /**
   * [stopTimeout 清除定时器]
   * @return {[type]} [description]
   */
  stopTimeout() {
    disable = false
    this.timer && clearTimeout(this.timer)
  }


  menuItemClick = async ({ e, key, keyPath }) => {
    if (!this.controlClick) return false
    this.controlClick = false
    this.props.setting.search = ''
    // TODO: 默认缺省路由
    // console.log('menuItemClick: ', e, key, keyPath)
    // 阻止连续点击
    this.stopFastClick()
    if (disable) return
    disable = true
    const { location, history } = this.props
    switch (this.isPriceAdjustment()) {
      case 'priceadjustment':
        var newPath = `/priceadjustment/${keyPath.reverse().join('/')}`
        break
      case 'app':
        var newPath = `/app/dashboard/${keyPath.reverse().join('/')}`
        break
      case 'reportdamage':
        var newPath = `/reportdamage/${keyPath.reverse().join('/')}`
        break
      case 'fundTransfer':
        var newPath = `/fundTransfer/${keyPath.reverse().join('/')}`
        break
      case 'purchase':
        var newPath = `/purchase/${keyPath.reverse().join('/')}`
        break
      case 'putaway':
        var newPath = `/putaway/${keyPath.reverse().join('/')}`
        this.props.getoutGoods({
          uniacid: this.props.store.uniacid,
          category: key,
          store_id: this.props.store.data.id,
          rows: this.props.setting.rowsnum
        })
          .then(res => {
            history.push(newPath)
            this.setState({
              activeMenu: key
            })
          })
          .then(() => {
            this.controlClick = true
          })
        return
      case 'soldout':
        var newPath = `/soldout/${keyPath.reverse().join('/')}`
        break
      default:
        break
    }
    if (newPath.includes('/app/dashboard/') && this.props.store.data && this.props.store.data.show_dragsort == 2) {
      try {
        let [{ category, total, search }, { data: { count, data: list } }] = await Promise.all([
          this.props.getGoods({
            category: key,
            store_id: this.props.store.data.id,
            rows: this.props.setting.rowsnum
          })
            .then(res => {
              this.controlClick = true
              return res
            }),
          getCategoryGoods({ category_id: key })
        ])
        if (total != count && category) {
          let { data: { status } } = await setSequence({
            category_id: key,
            list: list.map((item, i) => ({
              sequence: i,
              goods_id: item.id
            }))
          })
          status == 1 ? await this.props.getGoods({
            category: key,
            store_id: this.props.store.data.id,
            rows: this.props.setting.rowsnum
          }) : null
        }
        history.push(newPath)
        this.setState({
          activeMenu: key
        })
      } catch (e) {
      }
    } else {
      // if (location.pathname !== newPath) {
      this.props.getGoods({
        category: key,
        store_id: this.props.store.data.id,
        rows: this.props.setting.rowsnum
      })
        .then(res => {
          history.push(newPath)
          this.setState({
            activeMenu: key
          }, () => {
            // setTimeout(() => {
            //    this.stopTimeout()
            // },0)
          })
        })
        .then(res => {
          this.controlClick = true
          return res
        })
      // }
    }

  }

  onSubMenuClick = async ({ key, domEvent }) => {
    if (!this.controlClick) return false
    this.controlClick = false
    this.props.setting.search = ''
    // 阻止连续点击
    // this.stopFastClick()
    // if(disable)return
    // disable = true
    const { location, history } = this.props
    switch (this.isPriceAdjustment()) {
      case 'priceadjustment':
        var newPath = `/priceadjustment/${key}`
        break
      case 'app':
        var newPath = `/app/dashboard/${key}`
        break
      case 'reportdamage':
        var newPath = `/reportdamage/${key}`
        break
      case 'fundTransfer':
        var newPath = `/fundTransfer/${key}`
        break
      case 'purchase':
        var newPath = `/purchase/${key}`
        break
      case 'putaway':
        var newPath = `/putaway/${key}`
        if (this.state.mode == 'inline') {
          if (location.pathname !== newPath) {
            this.props.getoutGoods({
              uniacid: this.props.store.uniacid,
              category: key,
              store_id: this.props.store.data.id,
              rows: this.props.setting.rowsnum
            })
              .then(res => {
                history.push(newPath)
              })
              .then(() => {
                this.controlClick = true
              })
          }
        }
        return
      case 'soldout':
        var newPath = `/soldout/${key}`
        break
      default:
        break
    }
    if (this.state.mode == 'inline') {
      if (location.pathname !== newPath) {
        if (newPath.includes('/app/dashboard/') && this.props.store.data && this.props.store.data.show_dragsort == 2) {
          try {
            let [{ category, total, search }, { data: { count, data: list } }] = await Promise.all([
              this.props.getGoods({
                category: key,
                store_id: this.props.store.data.id,
                rows: this.props.setting.rowsnum
              })
                .then(res => {
                  this.controlClick = true
                  return res
                }),
              getCategoryGoods({ category_id: key })
            ])

            if (total != count && category) {
              let { data: { status } } = await setSequence({
                category_id: key,
                list: list.map((item, i) => ({
                  sequence: i,
                  goods_id: item.id
                }))
              })
              status == 1 ? await this.props.getGoods({
                category: key,
                store_id: this.props.store.data.id,
                rows: this.props.setting.rowsnum
              }) : null
            }
            history.push(newPath)
          } catch (e) {
          }
        } else {
          this.props.getGoods({
            category: key,
            store_id: this.props.store.data.id,
            rows: this.props.setting.rowsnum
          })
            .then(res => {
              history.push(newPath)
            })
            .then(res => {
              this.controlClick = true
              return res
            })
        }
      } else {
        this.controlClick = true
      }
    } else {
      this.controlClick = true
    }

  }


  render() {
    return (
      <div className="app-sidebar">
        <Spin spinning={false}>
          <Button icon={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} style={{ width: '100%', borderWidth: 0 }}
            onClick={() => this.onCollapse(!this.state.collapsed)}>切换</Button>
          <SiderMenu
            menus={this.state.menus}
            onClick={this.menuItemClick}
            theme="light"
            mode={this.state.mode}
            selectable={false}
            // selectedKeys={[this.state.selectedKey]}
            onSubMenuClick={this.onSubMenuClick.bind(this)}
            categoryColor={this.props.setting.categoryColor}
            subMenuCloseDelay={0.3}
            subMenuOpenDelay={0.3}
          />
        </Spin>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, { getCategory, getGoods, getoutGoods, changeSetting })(SiderCustom));