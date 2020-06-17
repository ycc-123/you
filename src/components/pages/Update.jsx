import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Card, Progress } from 'antd'
import { UpdateApi, disconnect, fallbackVersion } from '@/api'

const { Header, Content } = Layout

class Update extends Component {
	constructor(props) {
		super(props);

		this.state = {
			downPercent: 0, //进度条进度
			upPercent: 0,
			downStatus: '',
			upStatus: '',
			visable: 'none',
			upOK: 'none',
			isover: true
		};
	}

	componentDidMount() {
		if(this.props.location.query && this.props.location.query.rollback){
			this.fallbackVersion()
		}else{
			this.updateApi()
		}
	}

	async fallbackVersion() {
		let { downPercent, upPercent } = this.state
		let sid = setInterval(() => {
			downPercent = downPercent < 99 ? downPercent += 1 : downPercent
			this.setState({
				downPercent: downPercent
			})
		}, 1000)
		let { data } = await fallbackVersion()
		clearInterval(sid)
		if (data === 'update') {
			localStorage.setItem('isupdate', true)
			//开始更新
			this.setState({
				downPercent: 100,
				visable: 'block'
			})
			let nums = 0
			sid = setInterval(() => {
				nums += 1

				upPercent += 0.5
				this.setState({ upPercent: upPercent.toFixed(1) })
				if (upPercent >= 100) {
					clearInterval(sid)
					this.setState({
						upOK: 'inline',
						isover: false
					})
				}

				if (nums >= 5) {
					disconnect()
						.then(res => {
							console.log('147258369', res)
							if (res) {
								this.setState({ upPercent: 100 })
								clearInterval(sid)
								this.setState({
									upOK: 'inline',
									isover: false
								})
							}
						}).catch(err => {
							console.log('错误信息', err)
						})
				}
			}, 1000)
		}
		if (data === 'error') {
			this.setState({
				downPercent: 100,
				downStatus: 'exception'
			})
			//更新失败
		}
		if (data === 'updateshow') {
			setTimeout(() => {
				window.location.href = "http://127.0.0.1:8089/huodieposV3/login.jsp";
				// this.props.history.push('/app');
			}, 500)
		}
		// console.log('Update',data)
	}

	async updateApi() {
		let { downPercent, upPercent } = this.state
		let sid = setInterval(() => {
			downPercent = downPercent < 99 ? downPercent += 1 : downPercent
			this.setState({
				downPercent: downPercent
			})
		}, 1000)
		let { data } = await UpdateApi()
		clearInterval(sid)
		if (data === 'update') {
			localStorage.setItem('isupdate', true)
			//开始更新
			this.setState({
				downPercent: 100,
				visable: 'block'
			})
			let nums = 0
			sid = setInterval(() => {
				nums += 1

				upPercent += 0.5
				this.setState({ upPercent: upPercent.toFixed(1) })
				if (upPercent >= 100) {
					clearInterval(sid)
					this.setState({
						upOK: 'inline',
						isover: false
					})
				}

				if (nums >= 5) {
					disconnect()
						.then(res => {
							console.log('147258369', res)
							if (res) {
								this.setState({ upPercent: 100 })
								clearInterval(sid)
								this.setState({
									upOK: 'inline',
									isover: false
								})
							}
						}).catch(err => {
							console.log('错误信息', err)
						})
				}
			}, 1000)
		}
		if (data === 'error') {
			this.setState({
				downPercent: 100,
				downStatus: 'exception'
			})
			//更新失败
		}
		if (data === 'updateshow') {
			setTimeout(() => {
				window.location.href = "http://127.0.0.1:8089/huodieposV3/login.jsp";
				// this.props.history.push('/app');
			}, 500)
		}
		// console.log('Update',data)
	}
	render() {
		return (
			<Layout className="layout" style={{ height: '100%' }}>
				<Header>
					<span style={{ color: '#fff', fontSize: '20px', }} >
						系统升级, 请勿关闭此页面！！！
														</span></Header>
				<Content style={{ padding: '0 50px', height: '60%' }}>
					<Card title="开始下载文件" bordered={false}>
						<span style={{ fontSize: '20px', fontWeight: 'bold', margin: '5 0px' }}>开始下载文件</span>
						<Progress type="circle" percent={this.state.downPercent} status={this.state.downStatus} />
						{
							this.state.isover ?
								<span style={{ color: 'red', fontSize: '18px' }} >
									系统升级中, 请勿关闭此页面，否则将导致系统无法使用！！！
														</span> :
								''
						}
					</Card>
					<br />
					<Card title="正在更新" bordered={false} style={{ display: this.state.visable }}>
						<span style={{ fontSize: '20px', fontWeight: 'bold', margin: '50px' }}>正在更新</span>
						<Progress type="circle" percent={this.state.upPercent} status={this.state.upStatus} />
						{
							this.state.isover ?
								<span style={{ color: 'red', fontSize: '18px' }} >
									系统升级中, 请勿关闭此页面，否则将导致系统无法使用！！！
														</span> :
								''
						}
						<a style={{ fontSize: '20px', fontWeight: 'bold', margin: '50px', display: this.state.upOK }} href="http://127.0.0.1:8089/huodieposV3/login.jsp">更新完成，点击此处返回登录</a>
					</Card>
				</Content>
			</Layout>
		);
	}
}

export default withRouter(Update);