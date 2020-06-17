import React, { Component } from 'react';
import img from '../../style/imgs/404.png';

export default class NotFound extends Component { 
	state = {
		animated: ''
	};

	enter = () => {
		this.state({animated: 'hinge'})
	}; 

	render () {
		return (
			<div className="center" style={{height: '100%', background: '#ececec', overflow: 'hidden'}}>
				<img src={img} alt="404" className={`animated swing ${this.state.animated}`} onMouseEnter={this.enter} />
			</div>
		);
	}
}