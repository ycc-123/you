import React, { Component, Fragment, createRef } from 'react'
import styles from './index.module.less'
import PropTypes from 'prop-types';
import connect from "react-redux/es/connect/connect";
import { Input, Icon, Modal } from 'antd'
import NumericKeypad, { fat_num } from '@/widget/NumericKeypad'
import { authorization, } from '@/action'
import { withRouter } from 'react-router-dom'

import login from './login.png'
import dimen from './dimensionalbarcode.png'

const mapStateToProps = (state, ownProps) => ({
  store: state.store,
  authority: state.authority,
})

const Search = Input.Search

const onVirtualKeyboard = (value, str, success) => {
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
      str = '' + str + value
  }
  return str
}

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bool_click: true,
      account: '',
      password: '',
      inputname: '',
      hasShowModal: false,
      search_value: '',
      pc_hint: false,
      sm_hint: false,
    }
    this.code = createRef()
  }

  /**
   * 生命周期-第一次dom加载完成
   */
  componentDidMount() {
    // setTimeout(() => {
    //   if (this.code) this.code.current.focus()
    // }, 0)
  }

  /**
   *点击右上角切换登录方式
   */
  handlevalue = () => {
    this.setState(state => ({
      bool_click: !state.bool_click
    }), () => {
      if (this.state.bool_click) this.code.current.focus()
    })
  }

  /**
   * 扫码触发事件
   */
  onSearch = () => {
    let { search_value, account, password, } = this.state,
      { authorization, store: { data: { uniacid } }, callback } = this.props

    if (search_value !== '') {
      authorization({ member_id: search_value, uniacid })
        .then(res => {
          if (res.status === 2) this.setState({ sm_hint: true })
          this.setState({
            search_value: '',
          })
          if (res.status === 1 && callback) this.init() && callback()
        })
    }

    if (account !== '' && password !== '') {
      authorization({
        name: account,
        password: password,
        uniacid
      }).then(res => {
        if (res.status === 2) this.setState({ pc_hint: true })
        if (res.status === 1 && callback) this.init() && callback()
      })
    } else if (account == '' && password == '' ? false : true) {
      this.setState({
        pc_hint: true
      })
    }

  }

  /**
   * 点击按钮事件
   */
  input_click = (name) => {
    this.setState({
      pc_hint: false,
      hasShowModal: true,
      inputname: name
    })
  }

  /**
   * 返回上一页
   */
  golast = () => {
    const { history, on_click } = this.props
    if (on_click) {
      this.init()
      on_click()
    } else {
      let a = !isNaN(history.location.pathname.split('/').reverse()[0])
      a ? this.props.history.push({ pathname: '/app/dashboard' }) : null
    }

  }

  /**
   * 小键盘函数组件
   */
  Numlock = () => {
    let { inputname } = this.state

    const onClick_num = (v) => {
      let a = onVirtualKeyboard(v, this.state[inputname], () => {
        this.setState({
          hasShowModal: false
        })
        inputname == "password" ? this.onSearch() : null
      })

      this.setState({
        [inputname]: a
      })
    }

    const close = () => {
      this.setState({
        hasShowModal: false
      })
    }

    return (
      <div
        className={styles.mask}
      >
        <div className={styles.box}>
          <div className={styles.top}>
            <div className={styles.title}>
              {inputname === 'account' ? '输入账号' : '输入密码'}
            </div>
            <Icon
              type="close"
              style={{ fontSize: '18px', lineHeight: '40px' }}
              onClick={close}
            />
          </div>
          <Input
            style={{ marginBottom: '20px', width: '330px' }}
            value={this.state[inputname]}
            onFocus={() => this.setState({
              [inputname]: '',
            })}
            onChange={(e) => this.setState({
              [inputname]: fat_num(e.target.value)
            })}
            type={inputname === 'account' ? 'text' : 'password'}
          />
          <NumericKeypad
            Num={true}
            onClick={onClick_num}
          />
        </div>
      </div>
    )
  }

  search1127 = (code, onSearch) => {
    setTimeout(() => {
      if (this.code) this.code.current.focus()
    }, 0)
    this.search1127 = (code, onSearch) => (
      <Search
        ref={code}
        onBlur={() => {
          this.code.current.focus()
        }}
        onSearch={onSearch}
        style={{ opacity: 0 }}
        value={this.state.search_value}
        onChange={e => this.setState({ search_value: e.target.value })}
      />
    )
    return this.search1127(code, onSearch)
  }

  init = () => {
    this.setState({
      bool_click: true,
      account: '',
      password: '',
      inputname: '',
      hasShowModal: false,
      search_value: '',
      pc_hint: false,
      sm_hint: false,
    })
    this.search1127 = (code, onSearch) => {
      setTimeout(() => {
        if (this.code) this.code.current.focus()
      }, 0)
      this.search1127 = (code, onSearch) => (
        <Search
          ref={code}
          onBlur={() => {
            this.code.current.focus()
          }}
          onSearch={onSearch}
          style={{ opacity: 0 }}
          value={this.state.search_value}
          onChange={e => this.setState({ search_value: e.target.value })}
        />
      )
      return this.search1127(code, onSearch)
    }
    return true
  }

  render() {
    let { authority, visible } = this.props,
      { bool_click, account, password, inputname, hasShowModal, search_value, pc_hint, sm_hint, } = this.state,
      { handlevalue, onSearch, Numlock, input_click, golast, code } = this

    return (
      <Fragment>
        {
          visible && hasShowModal ? <Numlock /> : null
        }
        {
          visible
            ? <div className={styles.shade}>
              <div className={styles.box}>

                <div className={styles.title}>
                  {bool_click ? '扫码登录' : '密码登录'}
                </div>
                <div
                  className={styles.btn}
                  onClick={handlevalue}
                >
                  {bool_click ? '密码登录' : '扫码登录'}
                </div>
                <img
                  className={styles.img}
                  src={bool_click ? login : dimen}
                  onClick={handlevalue}
                  alt=''
                />

                <div className={styles.content}>
                  {
                    bool_click ? (
                      <Fragment>
                        {
                          sm_hint ? (<div className={styles.icon_top}>
                            <Icon
                              type="info"
                              style={{
                                color: '#fff',
                                background: 'rgb(255,147,76)',
                                borderRadius: '50%',
                                margin: '0 10px'
                              }}
                            />
                            二维码错误，请扫码管理员二维码
                        </div>) : null
                        }
                        <i
                          className="iconfont icon-erweima"
                          style={{
                            fontSize: '170px',
                            height: '170px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        />
                        {this.search1127(code, onSearch)}
                        <h3>
                          需要管理员权限，请扫描管理员二维码
                      </h3>
                      </Fragment>
                    ) : (
                        <Fragment>
                          {
                            (pc_hint && (authority.data && authority.data.status == 2)) ? (<div className={styles.icon}>
                              <Icon
                                type="info"
                                style={{
                                  color: '#fff',
                                  background: 'rgb(255,147,76)',
                                  borderRadius: '50%',
                                  margin: '0 10px'
                                }}
                              />
                              登录名或登录密码不正确
                        </div>) : null
                          }
                          <input
                            type="text"
                            placeholder="请输入账号"
                            className={styles.account}
                            value={account}
                            onClick={() => input_click('account')}
                          />
                          <input
                            type="password"
                            placeholder="请输入密码"
                            className={styles.password}
                            value={password}
                            onClick={() => input_click('password')}
                          />
                          <div
                            className={styles.sub}
                            onClick={onSearch}
                          >登录
                      </div>
                        </Fragment>
                      )
                  }
                </div>
                <div className={styles.back} onClick={golast}>
                  <div className={styles.text}>返回</div>
                </div>
              </div>
            </div >
            : null
        }
      </Fragment >
    )
  }
}

index.defaultProps = {
  visible: true
}

index.propTypes = {
  callback: PropTypes.func,
  on_click: PropTypes.func,
  visible: PropTypes.bool,
}


export default withRouter(connect(mapStateToProps, { authorization, })(index))