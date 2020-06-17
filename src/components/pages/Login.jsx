import React, { Component } from 'react';
import { Icon, Button, Checkbox, Input, Form } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetch, receiveData } from '../../action';

const FormItem = Form.Item;

class Login extends Component {
	componentWillMount() {
		const { receiveData } = this.props;
		receiveData(null, 'auth');
	}

	componentWillReceiveProps(nextProps) {
		const { auth: nextAuth = {} } = nextProps;
		const { history } = this.props;
		if (nextAuth.data && nextAuth.data.uid) {// 判断是否登陆
            localStorage.setItem('user', JSON.stringify(nextAuth.data));
            history.push('/');
        }
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.from.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
                const { fetch } = this.props;
                if (values.userName === 'admin' && values.password === 'admin') fetch({funcName: 'admin', stateName: 'auth'});
                if (values.userName === 'guest' && values.password === 'guest') fetch({funcName: 'guest', stateName: 'auth'});
			}
		})
	};

	gitHub() {
		window.location.href = 'https://github.com/login/oauth/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin';
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="login">
				<div className="login-form">
					<div className="login-logo">
                        <span>React Admin</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="管理员输入admin, 游客输入guest" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="管理员输入admin, 游客输入guest" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            <a className="login-form-forgot" href="" style={{float: 'right'}}>忘记密码</a>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                            <p style={{display: 'flex', justifyContent: 'space-between'}}>
                                <a href="">或 现在就去注册!</a>
                                <a onClick={this.gitHub} ><Icon type="github" />(第三方登录)</a>
                            </p>
                        </FormItem>
                    </Form>
				</div>
			</div>
		);
	}
}

const mapStateToPorps = state => {
    const { auth } = state.httpData;
    return { auth };
};
const mapDispatchToProps = dispatch => ({
    fetch: bindActionCreators(fetch, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToPorps, mapDispatchToProps)(Form.create()(Login));