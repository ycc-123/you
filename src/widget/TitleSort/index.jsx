import React, { Component } from 'react'
import styles from './index.module.less'

class index extends Component{
    constructor(props){
        super(props)
    }
    render(){
        let {title} = this.props
        return(
            <div className={styles.title}>{title}</div>
        )
    }
}

export default index