import React,{ Component,createRef } from 'react';
import {Input, Modal, Table} from 'antd';
import PropTypes from 'prop-types';
import { getWarehouse,getSupplier } from '@/api'
import connect from "react-redux/es/connect/connect";
import styles from './index.module.less'

const mapStateToProps = (state, ownProps) => ({
    store: state.store
})

class index extends Component{
    constructor(props){
        super(props)
        this.state = {
            iptValue: '',
            visible: false,
            getWarehouse: '',
            getSupplier: []
        }

        this.inputRef = createRef()
    }

    componentDidMount(){
        // let {hasvalue,store:{data:{id}}} = this.props
        let {store:{data:{id}}} = this.props
        // if(hasvalue){
        //     getWarehouse().then(({data:{data}})=>{
        //         data = data.filter(item=>{
        //             return +item.store_id === +id
        //         })
        //         this.setState({
        //             iptValue: data[0].name
        //         })
        //     })
        // }
        getWarehouse().then(({data:{data}})=>{
            data = data.filter(item=>{
                return +item.store_id === +id
            })

            let obj =  window.sessionStorage.getItem('buyer_warehouse')
            if(obj){
                obj = JSON.parse(obj)
                obj.buyer = data[0].id
            }else {
                obj = {buyer:data[0].id}
            }
            window.sessionStorage.setItem('buyer_warehouse',JSON.stringify(obj))
        })

        let initObj = window.sessionStorage.getItem('buyer_warehouse')
        initObj ? initObj = JSON.parse(initObj) : initObj = false
        if(initObj && initObj.supplier && initObj.name){
            this.setState({
                iptValue: initObj.name
            })
        }
    }

    acquireName = () => {
        this.setState({
            visible: true
        })
        this.getSupplier()
    }

    handleOk = () =>{
        this.setState({
            visible: false,
        });
        setTimeout(()=>{this.inputRef.current.blur()},0)
    }

    handleCancel = () =>{
        this.setState({
            visible: false,
        });
        setTimeout(()=>{this.inputRef.current.blur()},0)
    }

    showTable = ()=>{
        let {getSupplier} = this.state

        getSupplier = getSupplier.sort((a,b)=>{
            return a.id - b.id
        })

        const columns = [

            { title: 'id', dataIndex: 'id', key: 'id' },
            { title: 'name', dataIndex: 'name', key: 'name' },
            {
                title: '选择',
                key: 'operation',
                fixed: 'right',
                width: 100,
                render: () => <a href="javascript:;" onSelect={(changeableRowKeys)=>{
                }}>选择</a>,
            },
        ];

        return (
            <Table
                columns={columns}
                dataSource={getSupplier}
                onRow={(record, index)=>{
                    return {
                        onClick:()=>{
                            this.setState({
                                visible: false,
                                iptValue: record.name
                            })

                            let obj =  window.sessionStorage.getItem('buyer_warehouse')
                            if(obj){
                                obj = JSON.parse(obj)
                                obj.supplier = record.id
                                obj.name = record.name
                            }else {
                                obj = {supplier:record.id,name: record.name}
                            }
                            window.sessionStorage.setItem('buyer_warehouse',JSON.stringify(obj))

                            setTimeout(()=>{this.inputRef.current.blur()},0)
                        }
                    }
                }}
            />
        )
    }

    //api
    getSupplier(){
        let {store:{data:{uniacid}}} = this.props
        getSupplier({uniacid}).then(({data})=>{
            this.setState({
                getSupplier: data
            })
        })
    }

    render(){
        let {title,disabled,hasvalue} = this.props
        let {iptValue,visible} = this.state
        let {acquireName,handleOk,handleCancel,inputRef,showTable} = this

        return (
            <div className={styles.box}>
                <div className={styles.text}>
                    {title}:
                </div>
                <Input
                    size="default"
                    ref={inputRef}
                    style={{fontSize: '18px',textAlign: 'center'}}
                    disabled={disabled}
                    value={iptValue}
                    onClick={acquireName}
                />
                <Modal
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                    title='请选择转入仓库'
                >
                    {showTable()}
                </Modal>
            </div>
        )
    }
}

index.defaultProps = {
    disabled: false
}

index.propTypes = {
    title: PropTypes.string,
    disabled: PropTypes.bool,
    hasvalue: PropTypes.bool
}

export default connect(mapStateToProps, {})(index)